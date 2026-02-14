import { Effect, Either } from 'effect';

export interface DanceMove {
  emoji: string;
  name: string;
}

export const MOVES: DanceMove[] = [
  { emoji: '🙌', name: 'Angkat tangan' },
  { emoji: '👏', name: 'Tepuk tangan' },
  { emoji: '🦶', name: 'Hentakkan kaki' },
  { emoji: '👋', name: 'Lambaikan tangan' },
];

export const MAX_LEVEL = 6;

export function generateSequence(level: number): number[] {
  const len = Math.min(level + 1, 4);
  const seq: number[] = [];
  for (let i = 0; i < len; i++) {
    seq.push(Math.floor(Math.random() * MOVES.length));
  }
  return seq;
}

export const generateSequenceEffect = (level: number): Effect.Effect<number[]> =>
  Effect.sync(() => generateSequence(level));

export function checkMove(playerIndex: number, expectedIndex: number): boolean {
  return playerIndex === expectedIndex;
}

export const checkMoveEffect = (pi: number, ei: number): Either.Either<string, string> =>
  checkMove(pi, ei) ? Either.right('Benar!') : Either.left('Salah');

export function getResultText(level: number, maxLevel: number): { emoji: string; title: string; sub: string } {
  const perfect = level >= maxLevel;
  const good = level >= maxLevel * 0.5;
  return {
    emoji: perfect ? '🏆' : good ? '💃' : '💪',
    title: perfect ? 'Penari Hebat!' : good ? 'Bagus Sekali!' : 'Ayo Coba Lagi!',
    sub: `Sampai level ${level}!`,
  };
}
