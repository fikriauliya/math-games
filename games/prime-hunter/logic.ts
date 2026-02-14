import { Effect } from 'effect';

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export interface RoundConfig {
  numbers: number[];
  primes: number[];
  timeLimit: number;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const ROUNDS: { min: number; max: number; time: number }[] = [
  { min: 1, max: 20, time: 30 },
  { min: 1, max: 50, time: 45 },
  { min: 1, max: 100, time: 60 },
];

export const generateRoundEffect = (roundIdx: number): Effect.Effect<RoundConfig> =>
  Effect.gen(function* () {
    const cfg = ROUNDS[Math.min(roundIdx, ROUNDS.length - 1)];
    const allNums: number[] = [];
    for (let i = cfg.min; i <= cfg.max; i++) allNums.push(i);
    // Shuffle
    for (let i = allNums.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
    }
    const numbers = allNums.slice(0, Math.min(allNums.length, roundIdx === 0 ? 20 : roundIdx === 1 ? 30 : 40));
    const primes = numbers.filter(isPrime);
    return { numbers, primes, timeLimit: cfg.time };
  });

export const calcRoundScore = (found: number[], missed: number[], wrong: number): number => {
  return Math.max(0, found.length * 10 - wrong * 5);
};

export const getResultText = (totalScore: number): { emoji: string; title: string; sub: string } => {
  if (totalScore >= 80) return { emoji: '🌟', title: 'Prime Master!', sub: `Score: ${totalScore}` };
  if (totalScore >= 40) return { emoji: '⭐', title: 'Great Hunter!', sub: `Score: ${totalScore}` };
  return { emoji: '💪', title: 'Keep Hunting!', sub: `Score: ${totalScore}` };
};

export function generateRound(roundIdx: number): RoundConfig {
  return Effect.runSync(generateRoundEffect(roundIdx));
}
