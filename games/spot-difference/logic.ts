import { Effect, Either } from 'effect';

export interface Puzzle {
  gridA: string[][];
  gridB: string[][];
  differences: [number, number][];
}

const EMOJIS = ['🌟','🍎','🌈','🎈','🐱','🌻','🍕','🎵','🚀','🦋','💎','🍬','🎯','🌙','⚡','🍩','🐸','🎪','🌺','🔮'];
const GRID_SIZE = 4;
const DIFF_COUNT = 3;

const randomInt = (max: number) => Math.floor(Math.random() * max);
const randomPick = <T>(arr: T[]) => arr[randomInt(arr.length)];

export const generatePuzzleEffect = (): Effect.Effect<Puzzle> =>
  Effect.sync(() => generatePuzzle());

export function generatePuzzle(): Puzzle {
  const gridA: string[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    gridA.push([]);
    for (let c = 0; c < GRID_SIZE; c++) {
      gridA[r].push(randomPick(EMOJIS));
    }
  }
  const gridB = gridA.map(row => [...row]);
  
  const positions: Set<string> = new Set();
  while (positions.size < DIFF_COUNT) {
    const r = randomInt(GRID_SIZE);
    const c = randomInt(GRID_SIZE);
    positions.add(`${r},${c}`);
  }
  
  const differences: [number, number][] = [];
  for (const pos of positions) {
    const [r, c] = pos.split(',').map(Number);
    differences.push([r, c]);
    let newEmoji: string;
    do { newEmoji = randomPick(EMOJIS); } while (newEmoji === gridA[r][c]);
    gridB[r][c] = newEmoji;
  }
  
  return { gridA, gridB, differences };
}

export const checkCellEffect = (row: number, col: number, differences: [number, number][]): Either.Either<string, string> =>
  isDifference(row, col, differences) ? Either.right('Found!') : Either.left('Not different');

export function isDifference(row: number, col: number, differences: [number, number][]): boolean {
  return differences.some(([r, c]) => r === row && c === col);
}

export function getResultText(found: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = found === total;
  const good = found >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Perfect Eye!' : good ? 'Great Job!' : 'Try Again!',
    sub: `Found ${found} of ${total} differences`,
  };
}

export { GRID_SIZE, DIFF_COUNT };
