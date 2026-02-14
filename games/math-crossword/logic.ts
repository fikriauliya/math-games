import { Effect } from 'effect';

export interface Clue {
  direction: 'across' | 'down';
  row: number;
  col: number;
  length: number;
  expression: string;
  answer: string; // digits as string
  number: number; // clue number
}

export interface Puzzle {
  size: number;
  grid: (string | null)[][]; // null = black cell
  clues: Clue[];
}

// Pre-made 5x5 puzzles — each cell is a digit or null (black)
const PUZZLES: { grid: (string | null)[][]; clues: Omit<Clue, 'number'>[] }[] = [
  {
    grid: [
      ['5', '6', null, '7', '2'],
      ['4', null, null, '1', null],
      [null, null, null, '2', '5'],
      ['4', '8', null, null, null],
      ['9', null, null, '3', '6'],
    ],
    clues: [
      { direction: 'across', row: 0, col: 0, length: 2, expression: '2 + 4', answer: '56' },
      { direction: 'across', row: 0, col: 3, length: 2, expression: '8 × 9', answer: '72' },
      { direction: 'across', row: 2, col: 3, length: 2, expression: '5 × 5', answer: '25' },
      { direction: 'across', row: 3, col: 0, length: 2, expression: '6 × 8', answer: '48' },
      { direction: 'across', row: 4, col: 3, length: 2, expression: '4 × 9', answer: '36' },
      { direction: 'down', row: 0, col: 0, length: 2, expression: '9 × 6', answer: '54' },
      { direction: 'down', row: 0, col: 3, length: 3, expression: '6 + 6', answer: '712' },
      { direction: 'down', row: 3, col: 0, length: 2, expression: '7 × 7', answer: '49' },
    ],
  },
  {
    grid: [
      ['3', '6', null, '8', '1'],
      [null, null, null, null, '2'],
      ['1', '4', null, '6', '3'],
      ['2', null, null, null, null],
      ['8', '4', null, '2', '7'],
    ],
    clues: [
      { direction: 'across', row: 0, col: 0, length: 2, expression: '4 × 9', answer: '36' },
      { direction: 'across', row: 0, col: 3, length: 2, expression: '9 × 9', answer: '81' },
      { direction: 'across', row: 2, col: 0, length: 2, expression: '7 + 7', answer: '14' },
      { direction: 'across', row: 2, col: 3, length: 2, expression: '7 × 9', answer: '63' },
      { direction: 'across', row: 4, col: 0, length: 2, expression: '12 × 7', answer: '84' },
      { direction: 'across', row: 4, col: 3, length: 2, expression: '3 × 9', answer: '27' },
      { direction: 'down', row: 0, col: 3, length: 3, expression: '8 × ?', answer: '862' },
      { direction: 'down', row: 0, col: 4, length: 3, expression: '4 × 3', answer: '123' },
    ],
  },
  {
    grid: [
      ['2', '4', null, '6', '4'],
      [null, '5', null, null, null],
      ['7', '2', null, '9', '6'],
      [null, null, null, '1', null],
      ['4', '5', null, '8', '8'],
    ],
    clues: [
      { direction: 'across', row: 0, col: 0, length: 2, expression: '3 × 8', answer: '24' },
      { direction: 'across', row: 0, col: 3, length: 2, expression: '8 × 8', answer: '64' },
      { direction: 'across', row: 2, col: 0, length: 2, expression: '8 × 9', answer: '72' },
      { direction: 'across', row: 2, col: 3, length: 2, expression: '12 × 8', answer: '96' },
      { direction: 'across', row: 4, col: 0, length: 2, expression: '5 × 9', answer: '45' },
      { direction: 'across', row: 4, col: 3, length: 2, expression: '11 × 8', answer: '88' },
      { direction: 'down', row: 0, col: 1, length: 3, expression: '9 × 5', answer: '452' },
      { direction: 'down', row: 0, col: 3, length: 3, expression: '3 × ?', answer: '691' },
    ],
  },
];

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const getPuzzleEffect = (difficulty: number): Effect.Effect<Puzzle> =>
  Effect.gen(function* () {
    const idx = yield* randomInt(PUZZLES.length);
    const raw = PUZZLES[idx];
    let num = 1;
    const clues: Clue[] = raw.clues.map(c => ({ ...c, number: num++ }));
    return { size: 5, grid: raw.grid.map(r => [...r]), clues };
  });

export const checkCell = (input: string, expected: string): boolean => input === expected;

export const checkPuzzle = (userGrid: string[][], puzzle: Puzzle): { correct: number; total: number } => {
  let correct = 0, total = 0;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.grid[r][c] !== null) {
        total++;
        if (userGrid[r][c] === puzzle.grid[r][c]) correct++;
      }
    }
  }
  return { correct, total };
};

export const getResultText = (correct: number, total: number): { emoji: string; title: string; sub: string } => {
  const pct = (correct / total) * 100;
  if (pct >= 100) return { emoji: '📰', title: 'Perfect Puzzle!', sub: `${correct}/${total} cells correct!` };
  if (pct >= 70) return { emoji: '⭐', title: 'Great Job!', sub: `${correct}/${total} cells correct!` };
  return { emoji: '💪', title: 'Keep Trying!', sub: `${correct}/${total} cells correct!` };
};

export function getPuzzle(difficulty: number): Puzzle {
  return Effect.runSync(getPuzzleEffect(difficulty));
}
