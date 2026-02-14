import { Effect } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TowerState {
  pegs: number[][]; // 3 pegs, each with disc sizes (larger = bigger)
  moves: number;
  numDiscs: number;
  minMoves: number;
}

export function getNumDiscs(diff: Difficulty): number {
  return diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5;
}

export function getMinMoves(numDiscs: number): number {
  return Math.pow(2, numDiscs) - 1;
}

export const initStateEffect = (diff: Difficulty): Effect.Effect<TowerState> =>
  Effect.succeed(initState(diff));

export const canMoveEffect = (state: TowerState, from: number, to: number): Effect.Effect<boolean> =>
  Effect.succeed(canMove(state, from, to));

export const moveDiscEffect = (state: TowerState, from: number, to: number): Effect.Effect<TowerState | null> =>
  Effect.succeed(moveDisc(state, from, to));

export const isWonEffect = (state: TowerState): Effect.Effect<boolean> =>
  Effect.succeed(isWon(state));

// ── Plain functions ────────────────────────────────────────────
export function initState(diff: Difficulty): TowerState {
  const numDiscs = getNumDiscs(diff);
  const discs = Array.from({ length: numDiscs }, (_, i) => numDiscs - i);
  return { pegs: [discs, [], []], moves: 0, numDiscs, minMoves: getMinMoves(numDiscs) };
}

export function canMove(state: TowerState, from: number, to: number): boolean {
  if (from === to) return false;
  if (state.pegs[from].length === 0) return false;
  const disc = state.pegs[from][state.pegs[from].length - 1];
  const topTo = state.pegs[to].length > 0 ? state.pegs[to][state.pegs[to].length - 1] : Infinity;
  return disc < topTo;
}

export function moveDisc(state: TowerState, from: number, to: number): TowerState | null {
  if (!canMove(state, from, to)) return null;
  const newPegs = state.pegs.map(p => [...p]);
  const disc = newPegs[from].pop()!;
  newPegs[to].push(disc);
  return { ...state, pegs: newPegs, moves: state.moves + 1 };
}

export function isWon(state: TowerState): boolean {
  return state.pegs[2].length === state.numDiscs;
}

export function getResultText(moves: number, minMoves: number): { emoji: string; title: string; sub: string } {
  const ratio = moves / minMoves;
  return {
    emoji: ratio <= 1 ? '🏆' : ratio <= 1.5 ? '⭐' : '💪',
    title: ratio <= 1 ? 'Perfect!' : ratio <= 1.5 ? 'Great!' : 'You Did It!',
    sub: `${moves} moves (minimum: ${minMoves})`,
  };
}

export const DISC_COLORS = ['#e53935', '#ff9800', '#fdd835', '#43a047', '#1e88e5'];
