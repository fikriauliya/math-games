import { Effect, Either } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  count: number;
  range: number;
  decimals: boolean;
  speed: number;
}

// ── Effect-based functions ─────────────────────────────────────

export const getDifficultyConfigEffect = (level: Difficulty): Effect.Effect<DifficultyConfig> =>
  Effect.succeed(getDifficultyConfig(level));

export const generateNumbersEffect = (difficulty: Difficulty, count: number, allowDecimals: boolean): Effect.Effect<number[]> =>
  Effect.sync(() => generateNumbers(difficulty, count, allowDecimals));

export const calculateAnswerEffect = (numbers: number[]): Effect.Effect<number> =>
  Effect.succeed(calculateAnswer(numbers));

export const checkAnswerEffect = (input: number, correct: number, tolerance?: number): Either.Either<string, string> =>
  checkAnswer(input, correct, tolerance)
    ? Either.right('Correct!')
    : Either.left(`Wrong! Answer was ${formatNumber(correct)}`);

// ── Plain functions ────────────────────────────────────────────

export function getDifficultyConfig(level: Difficulty): DifficultyConfig {
  const configs: Record<Difficulty, DifficultyConfig> = {
    easy:   { count: 3,  range: 9,  decimals: false, speed: 2 },
    medium: { count: 5,  range: 20, decimals: false, speed: 1.5 },
    hard:   { count: 6,  range: 20, decimals: true,  speed: 1 },
    expert: { count: 8,  range: 20, decimals: true,  speed: 0.7 },
  };
  return configs[level];
}

export function generateNumbers(difficulty: Difficulty, count: number, allowDecimals: boolean): number[] {
  const config = getDifficultyConfig(difficulty);
  const numbers: number[] = [];
  const useDecimals = allowDecimals && config.decimals;

  for (let i = 0; i < count; i++) {
    let n: number;
    if (useDecimals) {
      n = Math.round((Math.random() * config.range + 0.01) * 100) / 100;
    } else {
      n = Math.floor(Math.random() * config.range) + 1;
    }
    // First number always positive; rest can be negative for medium+
    if (i > 0 && difficulty !== 'easy') {
      if (Math.random() < 0.5) n = -n;
    }
    numbers.push(n);
  }

  return numbers;
}

export function calculateAnswer(numbers: number[]): number {
  // Use integer math to avoid floating point issues
  const sum = numbers.reduce((acc, n) => acc + Math.round(n * 100), 0);
  return Math.round(sum) / 100;
}

export function formatNumber(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return '0';
}

export function formatFirstNumber(n: number): string {
  return `${n}`;
}

export function checkAnswer(input: number, correct: number, tolerance = 0.01): boolean {
  return Math.abs(input - correct) <= tolerance;
}

export function getGrade(correct: number, total: number): { grade: string; message: string } {
  const pct = (correct / total) * 100;
  if (pct >= 100) return { grade: 'S', message: '🏆 SEMPURNA!' };
  if (pct >= 90)  return { grade: 'A+', message: '🌟 LUAR BIASA!' };
  if (pct >= 80)  return { grade: 'A', message: '⭐ Hebat!' };
  if (pct >= 70)  return { grade: 'B', message: '👍 Bagus!' };
  if (pct >= 60)  return { grade: 'C', message: '💪 Terus Berlatih!' };
  return { grade: 'D', message: '📚 Coba Lagi!' };
}

export function getSpeedMs(speedLabel: string): number {
  const speeds: Record<string, number> = {
    slow: 2000,
    normal: 1500,
    fast: 1000,
    turbo: 500,
  };
  return speeds[speedLabel] || 1500;
}
