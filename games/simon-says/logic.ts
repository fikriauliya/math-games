import { Effect } from 'effect';

export type Color = 'red' | 'blue' | 'green' | 'yellow';
export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow'];

export interface GameState {
  sequence: Color[];
  playerIndex: number;
  score: number;
  gameOver: boolean;
  highStreak: number;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const addToSequenceEffect = (seq: Color[]): Effect.Effect<Color[]> =>
  Effect.gen(function* () {
    const idx = yield* randomInt(COLORS.length);
    return [...seq, COLORS[idx]];
  });

export function createGameState(): GameState {
  return { sequence: [], playerIndex: 0, score: 0, gameOver: false, highStreak: 0 };
}

export function checkInput(state: GameState, color: Color): { correct: boolean; roundComplete: boolean } {
  const expected = state.sequence[state.playerIndex];
  if (color !== expected) return { correct: false, roundComplete: false };
  const roundComplete = state.playerIndex + 1 >= state.sequence.length;
  return { correct: true, roundComplete };
}

export function getResultText(score: number) {
  const great = score >= 10;
  const good = score >= 5;
  return {
    emoji: great ? '🏆' : good ? '🎉' : '🧠',
    title: great ? 'Amazing Memory!' : good ? 'Good Job!' : 'Keep Practicing!',
    sub: `Longest streak: ${score} rounds`,
  };
}

// Plain wrappers
export function addToSequence(seq: Color[]): Color[] { return Effect.runSync(addToSequenceEffect(seq)); }
