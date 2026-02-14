import { Effect } from 'effect';

export const COLORS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
export const CODE_LENGTH = 4;
export const MAX_GUESSES = 10;

export interface Peg { type: 'black' | 'white'; }
export interface GuessResult { guess: string[]; pegs: Peg[]; }

export const generateCodeEffect = (): Effect.Effect<string[]> =>
  Effect.sync(() => Array.from({ length: CODE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)]));

export const evaluateGuessEffect = (secret: string[], guess: string[]): Effect.Effect<Peg[]> =>
  Effect.sync(() => {
    const pegs: Peg[] = [];
    const sRemain: (string | null)[] = [...secret];
    const gRemain: (string | null)[] = [...guess];
    // Black pegs
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guess[i] === secret[i]) { pegs.push({ type: 'black' }); sRemain[i] = null; gRemain[i] = null; }
    }
    // White pegs
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (gRemain[i] === null) continue;
      const idx = sRemain.findIndex(s => s === gRemain[i]);
      if (idx >= 0) { pegs.push({ type: 'white' }); sRemain[idx] = null; }
    }
    return pegs;
  });

export const isWinEffect = (pegs: Peg[]): Effect.Effect<boolean> =>
  Effect.succeed(pegs.filter(p => p.type === 'black').length === CODE_LENGTH);

export function generateCode(): string[] { return Effect.runSync(generateCodeEffect()); }
export function evaluateGuess(secret: string[], guess: string[]): Peg[] { return Effect.runSync(evaluateGuessEffect(secret, guess)); }
export function isWin(pegs: Peg[]): boolean { return Effect.runSync(isWinEffect(pegs)); }

export function getGrade(guessCount: number): { grade: string; message: string } {
  if (guessCount <= 3) return { grade: 'S', message: '🏆 Master Spy!' };
  if (guessCount <= 5) return { grade: 'A', message: '⭐ Great Deduction!' };
  if (guessCount <= 7) return { grade: 'B', message: '👍 Good Work!' };
  return { grade: 'C', message: '💪 Keep Trying!' };
}
