const SESSION_KEY = 'mathgames-session-id';
const RATED_PREFIX = 'mathgames-rated-';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = uuid(); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

function send(event: string, gameId: string, data: Record<string, any>): void {
  try {
    const body = JSON.stringify({ event, gameId, data, timestamp: Date.now(), sessionId: getSessionId() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    } else {
      fetch('/api/analytics', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch (_) {}
}

export function trackGameStart(gameId: string, difficulty?: string): void {
  send('game_start', gameId, { difficulty });
}

export function trackGameEnd(gameId: string, score: number, durationMs: number, completed: boolean): void {
  send('game_end', gameId, { score, duration_ms: durationMs, completed });
}

export function trackRating(gameId: string, rating: 'up' | 'down'): void {
  send('rating', gameId, { rating });
  localStorage.setItem(`${RATED_PREFIX}${gameId}`, String(Date.now()));
}

export function wasRecentlyRated(gameId: string): boolean {
  const ts = localStorage.getItem(`${RATED_PREFIX}${gameId}`);
  if (!ts) return false;
  return Date.now() - parseInt(ts) < 24 * 60 * 60 * 1000;
}

export function createRatingUI(gameId: string, container: HTMLElement): void {
  if (wasRecentlyRated(gameId)) return;
  const div = document.createElement('div');
  div.className = 'rating-prompt';
  div.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:0.5rem;margin:1rem 0;padding:0.8rem;background:rgba(255,255,255,0.1);border-radius:12px;font-size:0.95rem;';
  const span = document.createElement('span');
  span.textContent = 'Suka game ini?';
  div.appendChild(span);
  ['up', 'down'].forEach(rating => {
    const btn = document.createElement('button');
    btn.className = 'rate-btn';
    btn.dataset.rating = rating;
    btn.textContent = rating === 'up' ? '👍' : '👎';
    btn.style.cssText = 'font-size:1.5rem;background:none;border:none;cursor:pointer;padding:0.3rem 0.6rem;border-radius:8px;transition:transform 0.15s,background 0.15s;';
    btn.onmouseenter = () => btn.style.transform = 'scale(1.2)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    btn.onclick = () => {
      trackRating(gameId, rating as 'up' | 'down');
      div.innerHTML = '';
      div.style.cssText += 'opacity:0.8;';
      const ty = document.createElement('span');
      ty.textContent = 'Terima kasih! 🙏';
      div.appendChild(ty);
    };
    div.appendChild(btn);
  });
  container.appendChild(div);
}
