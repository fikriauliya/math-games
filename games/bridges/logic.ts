import { Effect } from 'effect';

export interface Island { row: number; col: number; target: number; current: number; }
export interface Bridge { from: number; to: number; count: number; } // max 2
export interface Puzzle { size: number; islands: Island[]; solution: Bridge[]; }

const PUZZLES: { size: number; islands: Omit<Island, 'current'>[]; solution: Bridge[] }[] = [
  { size: 5, islands: [
    { row: 0, col: 0, target: 2 }, { row: 0, col: 4, target: 2 },
    { row: 2, col: 2, target: 4 },
    { row: 4, col: 0, target: 2 }, { row: 4, col: 4, target: 2 },
  ], solution: [
    { from: 0, to: 2, count: 1 }, { from: 1, to: 2, count: 1 },
    { from: 2, to: 3, count: 1 }, { from: 2, to: 4, count: 1 },
  ]},
  { size: 5, islands: [
    { row: 0, col: 0, target: 2 }, { row: 0, col: 2, target: 3 }, { row: 0, col: 4, target: 1 },
    { row: 2, col: 0, target: 1 }, { row: 2, col: 2, target: 3 },
    { row: 4, col: 2, target: 1 },
  ], solution: [
    { from: 0, to: 1, count: 1 }, { from: 0, to: 3, count: 1 },
    { from: 1, to: 4, count: 2 }, { from: 2, to: 1, count: 0 },
    { from: 4, to: 5, count: 1 },
  ]},
  { size: 6, islands: [
    { row: 0, col: 0, target: 3 }, { row: 0, col: 3, target: 4 }, { row: 0, col: 5, target: 2 },
    { row: 3, col: 0, target: 2 }, { row: 3, col: 3, target: 3 }, { row: 3, col: 5, target: 2 },
    { row: 5, col: 0, target: 1 }, { row: 5, col: 3, target: 1 },
  ], solution: [
    { from: 0, to: 1, count: 1 }, { from: 0, to: 3, count: 2 },
    { from: 1, to: 2, count: 2 }, { from: 1, to: 4, count: 2 },
    { from: 3, to: 6, count: 0 }, { from: 4, to: 5, count: 2 },
    { from: 4, to: 7, count: 1 }, { from: 6, to: 7, count: 1 },
  ]},
];

export const getPuzzleEffect = (difficulty: string): Effect.Effect<Puzzle> =>
  Effect.sync(() => {
    const pool = difficulty === 'easy' ? [PUZZLES[0]] : difficulty === 'medium' ? [PUZZLES[0], PUZZLES[1]] : PUZZLES;
    const p = pool[Math.floor(Math.random() * pool.length)];
    return { size: p.size, islands: p.islands.map(i => ({ ...i, current: 0 })), solution: p.solution };
  });

export const canConnectEffect = (islands: Island[], a: number, b: number): Effect.Effect<boolean> =>
  Effect.succeed(islands[a].row === islands[b].row || islands[a].col === islands[b].col);

export const isSolvedEffect = (islands: Island[]): Effect.Effect<boolean> =>
  Effect.succeed(islands.every(i => i.current === i.target));

export const addBridgeEffect = (bridges: Bridge[], from: number, to: number): Effect.Effect<Bridge[]> =>
  Effect.sync(() => {
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;
    const f = Math.min(from, to), t = Math.max(from, to);
    const existing = bridges.find(b => b.from === f && b.to === t);
    if (existing) {
      if (existing.count >= 2) return bridges.filter(b => !(b.from === f && b.to === t)); // remove
      return bridges.map(b => b.from === f && b.to === t ? { ...b, count: b.count + 1 } : b);
    }
    return [...bridges, { from: f, to: t, count: 1 }];
  });

export function getPuzzle(d: string): Puzzle { return Effect.runSync(getPuzzleEffect(d)); }
export function canConnect(islands: Island[], a: number, b: number): boolean { return Effect.runSync(canConnectEffect(islands, a, b)); }
export function isSolved(islands: Island[]): boolean { return Effect.runSync(isSolvedEffect(islands)); }
export function addBridge(bridges: Bridge[], from: number, to: number): Bridge[] { return Effect.runSync(addBridgeEffect(bridges, from, to)); }
