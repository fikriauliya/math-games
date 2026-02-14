import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

export default async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('', { headers: CORS });

  const store = getStore('analytics');

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { event, gameId, data, timestamp, sessionId } = body;
      if (!event || !gameId) return json({ error: 'missing fields' }, 400);

      const date = new Date(timestamp || Date.now()).toISOString().slice(0, 10);
      const key = date + '.jsonl';
      let existing = '';
      try { existing = await store.get(key, { type: 'text' }) || ''; } catch (_) {}
      const line = JSON.stringify({ event, gameId, data, timestamp, sessionId }) + '\n';
      await store.set(key, existing + line);
      return json({ ok: true });
    } catch (e) {
      return json({ error: 'invalid body' }, 400);
    }
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const summary = url.searchParams.get('summary');

    if (date) {
      const key = date + '.jsonl';
      let raw = '';
      try { raw = await store.get(key, { type: 'text' }) || ''; } catch (_) {}
      const events = raw.trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
      return json(events);
    }

    if (summary === 'true') {
      // Aggregate all data from last 90 days
      const stats: Record<string, { plays: number; completions: number; total_duration: number; duration_count: number; thumbs_up: number; thumbs_down: number; sessions: Set<string> }> = {};

      const now = new Date();
      for (let i = 0; i < 90; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10) + '.jsonl';
        let raw = '';
        try { raw = await store.get(key, { type: 'text' }) || ''; } catch (_) { continue; }
        if (!raw.trim()) continue;

        for (const line of raw.trim().split('\n')) {
          if (!line) continue;
          const ev = JSON.parse(line);
          const gid = ev.gameId;
          if (!stats[gid]) stats[gid] = { plays: 0, completions: 0, total_duration: 0, duration_count: 0, thumbs_up: 0, thumbs_down: 0, sessions: new Set() };
          const s = stats[gid];

          if (ev.event === 'game_start') {
            s.plays++;
            if (ev.sessionId) s.sessions.add(ev.sessionId);
          }
          if (ev.event === 'game_end') {
            if (ev.data?.completed) s.completions++;
            if (ev.data?.duration_ms) { s.total_duration += ev.data.duration_ms; s.duration_count++; }
          }
          if (ev.event === 'rating') {
            if (ev.data?.rating === 'up') s.thumbs_up++;
            if (ev.data?.rating === 'down') s.thumbs_down++;
          }
        }
      }

      const result: Record<string, any> = {};
      for (const [gid, s] of Object.entries(stats)) {
        const totalRatings = s.thumbs_up + s.thumbs_down;
        result[gid] = {
          plays: s.plays,
          completions: s.completions,
          avg_duration: s.duration_count ? Math.round(s.total_duration / s.duration_count / 1000) : 0,
          thumbs_up: s.thumbs_up,
          thumbs_down: s.thumbs_down,
          replay_rate: s.sessions.size ? Math.round((s.plays / s.sessions.size - 1) * 10) / 10 : 0,
        };
      }
      return json(result);
    }

    return json({ error: 'provide ?date=YYYY-MM-DD or ?summary=true' }, 400);
  }

  return json({ error: 'method not allowed' }, 405);
};

export const config = { path: '/api/analytics' };
