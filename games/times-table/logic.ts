import { Effect, Either } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GridCell {
  row: number;
  col: number;
  answer: number;
  isBlank: boolean;
}

export interface GridConfig {
  size: number;
  maxFactor: number;
}

export interface GameState {
  grid: GridCell[];
  size: number;
  blanks: number;
  filled: number;
  mistakes: number;
  startTime: number;
}

// ── Config ─────────────────────────────────────────────────────
export const DIFFICULTY_CONFIG: Record<Difficulty, GridConfig> = {
  easy: { size: 5, maxFactor: 5 },
  medium: { size: 8, maxFactor: 8 },
  hard: { size: 12, maxFactor: 12 },
};

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const generateGridEffect = (diff: Difficulty): Effect.Effect<GridCell[]> =>
  Effect.gen(function* () {
    const config = DIFFICULTY_CONFIG[diff];
    const { size } = config;
    const cells: GridCell[] = [];
    const blankCount = Math.floor(size * size * 0.4);
    const blankIndices = new Set<number>();

    while (blankIndices.size < blankCount) {
      const idx = yield* randomInt(size * size);
      blankIndices.add(idx);
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        cells.push({
          row: r + 1,
          col: c + 1,
          answer: (r + 1) * (c + 1),
          isBlank: blankIndices.has(idx),
        });
      }
    }
    return cells;
  });

export const validateAnswerEffect = (userAnswer: number, correct: number): Either.Either<string, string> =>
  userAnswer === correct ? Either.right('Correct!') : Either.left(`Wrong! ${correct}`);

export const getElapsedText = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

export const calcScore = (blanks: number, mistakes: number, elapsedMs: number): number => {
  const base = blanks * 10;
  const penalty = mistakes * 5;
  const timeBonus = Math.max(0, Math.floor((300000 - elapsedMs) / 10000));
  return Math.max(0, base - penalty + timeBonus);
};

export const getGrade = (mistakes: number, blanks: number): { grade: string; message: string } => {
  const pct = Math.max(0, (blanks - mistakes) / blanks) * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generateGrid(diff: Difficulty): GridCell[] {
  return Effect.runSync(generateGridEffect(diff));
}

export function validateAnswer(userAnswer: number, correct: number): boolean {
  return userAnswer === correct;
}
