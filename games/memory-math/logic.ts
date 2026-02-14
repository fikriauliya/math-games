import { Effect, pipe, Either, Option } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export interface Pair {
  equation: string;
  answer: string;
  id: number;
}

export interface Card {
  text: string;
  pairId: number;
  type: string;
}

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const genPairsEffect = (count: number): Effect.Effect<Pair[]> =>
  Effect.gen(function* () {
    const pairs: Pair[] = [];
    const used = new Set<string>();
    while (pairs.length < count) {
      const a = (yield* randomInt(12)) + 1;
      const b = (yield* randomInt(12)) + 1;
      const ops = ['+', '−', '×'];
      const op = ops[yield* randomInt(ops.length)];
      let ans: number;
      if (op === '+') ans = a + b;
      else if (op === '−') { if (a < b) continue; ans = a - b; }
      else ans = a * b;

      const eq = `${a} ${op} ${b}`;
      const key = eq + '=' + ans!;
      if (used.has(key)) continue;
      used.add(key);
      pairs.push({ equation: eq, answer: String(ans!), id: pairs.length });
    }
    return pairs;
  });

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export const makeCardsEffect = (pairs: Pair[]): Effect.Effect<Card[]> =>
  Effect.succeed((() => {
    const cards: Card[] = [];
    pairs.forEach(p => {
      cards.push({ text: p.equation, pairId: p.id, type: 'eq' });
      cards.push({ text: p.answer, pairId: p.id, type: 'ans' });
    });
    return cards;
  })());

export const isMatchEffect = (cardA: Card, cardB: Card): Either.Either<string, string> =>
  cardA.pairId === cardB.pairId ? Either.right('Match!') : Either.left('No match');

export const getStarsEffect = (matched: number, moves: number): Effect.Effect<string> =>
  Effect.succeed((() => {
    const efficiency = matched / moves;
    return efficiency >= 0.8 ? '⭐⭐⭐' : efficiency >= 0.5 ? '⭐⭐' : '⭐';
  })());

export const formatTimeEffect = (seconds: number): Effect.Effect<string> =>
  Effect.succeed(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`);

// ── Plain wrappers ─────────────────────────────────────────────
export function genPairs(count: number): Pair[] {
  return Effect.runSync(genPairsEffect(count));
}

export function shuffle<T>(arr: T[]): T[] {
  return Effect.runSync(shuffleEffect(arr));
}

export function makeCards(pairs: Pair[]): Card[] {
  return Effect.runSync(makeCardsEffect(pairs));
}

export function isMatch(cardA: Card, cardB: Card): boolean {
  return cardA.pairId === cardB.pairId;
}

export function getStars(matched: number, moves: number): string {
  return Effect.runSync(getStarsEffect(matched, moves));
}

export function formatTime(seconds: number): string {
  return Effect.runSync(formatTimeEffect(seconds));
}
