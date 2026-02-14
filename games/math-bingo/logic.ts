import { Effect, Either } from 'effect';

// ── Types ──────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BingoQuestion {
  text: string;
  answer: number;
}

export interface BingoCard {
  cells: (number | null)[][]; // 5x5, center is null (FREE)
}

// ── Random helpers ─────────────────────────────────────────────
const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

// ── Effect-based functions ─────────────────────────────────────
export const generateCardEffect = (diff: Difficulty): Effect.Effect<BingoCard> =>
  Effect.sync(() => {
    const range = diff === 'easy' ? 20 : diff === 'medium' ? 40 : 100;
    const nums = new Set<number>();
    while (nums.size < 24) {
      nums.add(Math.floor(Math.random() * range) + 1);
    }
    const arr = [...nums];
    const cells: (number | null)[][] = [];
    let idx = 0;
    for (let r = 0; r < 5; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < 5; c++) {
        if (r === 2 && c === 2) { row.push(null); }
        else { row.push(arr[idx++]); }
      }
      cells.push(row);
    }
    return { cells };
  });

export const generateQuestionEffect = (answer: number, diff: Difficulty): Effect.Effect<BingoQuestion> =>
  Effect.gen(function* () {
    if (diff === 'easy') {
      const a = (yield* randomInt(answer)) + 1;
      const b = answer - a;
      return { text: `${a} + ${b}`, answer };
    } else if (diff === 'medium') {
      const useAdd = (yield* randomInt(2)) === 0;
      if (useAdd) {
        const a = (yield* randomInt(answer)) + 1;
        return { text: `${a} + ${answer - a}`, answer };
      } else {
        const extra = (yield* randomInt(20)) + 1;
        return { text: `${answer + extra} − ${extra}`, answer };
      }
    } else {
      const ops = ['+', '−', '×'];
      const op = ops[yield* randomInt(3)];
      if (op === '×') {
        const factors = getFactors(answer);
        if (factors.length > 0) {
          const [a, b] = factors[yield* randomInt(factors.length)];
          return { text: `${a} × ${b}`, answer };
        }
        const a = (yield* randomInt(answer)) + 1;
        return { text: `${a} + ${answer - a}`, answer };
      } else if (op === '−') {
        const extra = (yield* randomInt(30)) + 1;
        return { text: `${answer + extra} − ${extra}`, answer };
      } else {
        const a = (yield* randomInt(answer)) + 1;
        return { text: `${a} + ${answer - a}`, answer };
      }
    }
  });

function getFactors(n: number): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) result.push([i, n / i]);
  }
  return result;
}

export const checkBingoEffect = (marked: boolean[][]): Effect.Effect<boolean> =>
  Effect.succeed(checkBingo(marked));

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

// ── Pure functions ─────────────────────────────────────────────
export function checkBingo(marked: boolean[][]): boolean {
  // Check rows
  for (let r = 0; r < 5; r++) {
    if (marked[r].every(v => v)) return true;
  }
  // Check columns
  for (let c = 0; c < 5; c++) {
    if (marked.every(row => row[c])) return true;
  }
  // Diagonals
  if ([0,1,2,3,4].every(i => marked[i][i])) return true;
  if ([0,1,2,3,4].every(i => marked[i][4-i])) return true;
  return false;
}

export function generateCard(diff: Difficulty): BingoCard {
  return Effect.runSync(generateCardEffect(diff));
}

export function generateQuestion(answer: number, diff: Difficulty): BingoQuestion {
  return Effect.runSync(generateQuestionEffect(answer, diff));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function getAllCardNumbers(card: BingoCard): number[] {
  return card.cells.flat().filter((n): n is number => n !== null);
}
