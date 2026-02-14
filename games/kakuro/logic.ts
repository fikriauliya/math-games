import { Effect } from 'effect';

export type CellType = 'blank' | 'clue' | 'input';

export interface ClueCell {
  type: 'clue';
  across?: number;
  down?: number;
}

export interface InputCell {
  type: 'input';
  value: number | null;
  answer: number;
}

export interface BlankCell {
  type: 'blank';
}

export type Cell = ClueCell | InputCell | BlankCell;

export interface Puzzle {
  size: number;
  grid: Cell[][];
}

const PUZZLES: Puzzle[] = [
  {
    size: 4,
    grid: [
      [{ type: 'blank' }, { type: 'clue', down: 3 }, { type: 'clue', down: 7 }, { type: 'blank' }],
      [{ type: 'clue', across: 3 }, { type: 'input', value: null, answer: 1 }, { type: 'input', value: null, answer: 2 }, { type: 'blank' }],
      [{ type: 'clue', across: 7 }, { type: 'input', value: null, answer: 2 }, { type: 'input', value: null, answer: 5 }, { type: 'blank' }],
      [{ type: 'blank' }, { type: 'blank' }, { type: 'blank' }, { type: 'blank' }],
    ]
  },
  {
    size: 4,
    grid: [
      [{ type: 'blank' }, { type: 'clue', down: 4 }, { type: 'clue', down: 11 }, { type: 'blank' }],
      [{ type: 'clue', across: 6 }, { type: 'input', value: null, answer: 1 }, { type: 'input', value: null, answer: 5 }, { type: 'blank' }],
      [{ type: 'clue', across: 9 }, { type: 'input', value: null, answer: 3 }, { type: 'input', value: null, answer: 6 }, { type: 'blank' }],
      [{ type: 'blank' }, { type: 'blank' }, { type: 'blank' }, { type: 'blank' }],
    ]
  },
  {
    size: 5,
    grid: [
      [{ type: 'blank' }, { type: 'clue', down: 6 }, { type: 'clue', down: 15 }, { type: 'clue', down: 3 }, { type: 'blank' }],
      [{ type: 'clue', across: 7 }, { type: 'input', value: null, answer: 1 }, { type: 'input', value: null, answer: 4 }, { type: 'input', value: null, answer: 2 }, { type: 'blank' }],
      [{ type: 'clue', across: 11 }, { type: 'input', value: null, answer: 2 }, { type: 'input', value: null, answer: 8 }, { type: 'input', value: null, answer: 1 }, { type: 'blank' }],
      [{ type: 'clue', across: 6 }, { type: 'input', value: null, answer: 3 }, { type: 'input', value: null, answer: 3 }, { type: 'blank' }, { type: 'blank' }],
      [{ type: 'blank' }, { type: 'blank' }, { type: 'blank' }, { type: 'blank' }, { type: 'blank' }],
    ]
  },
];

export function getPuzzle(index: number): Puzzle {
  const p = PUZZLES[index % PUZZLES.length];
  return { size: p.size, grid: p.grid.map(row => row.map(c => c.type === 'input' ? { ...c, value: null } : { ...c })) };
}

export function getPuzzleCount(): number { return PUZZLES.length; }

export function setCell(puzzle: Puzzle, r: number, c: number, val: number | null): Puzzle {
  const grid = puzzle.grid.map(row => row.map(cell => cell.type === 'input' ? { ...cell } : { ...cell }));
  const cell = grid[r][c];
  if (cell.type === 'input') (cell as InputCell).value = val;
  return { ...puzzle, grid };
}

export function checkComplete(puzzle: Puzzle): boolean {
  for (const row of puzzle.grid) {
    for (const cell of row) {
      if (cell.type === 'input' && (cell as InputCell).value !== (cell as InputCell).answer) return false;
    }
  }
  return true;
}

export function isCellCorrect(cell: Cell): boolean {
  if (cell.type !== 'input') return false;
  return (cell as InputCell).value === (cell as InputCell).answer;
}

export function countFilled(puzzle: Puzzle): number {
  let n = 0;
  for (const row of puzzle.grid) for (const c of row) if (c.type === 'input' && (c as InputCell).value !== null) n++;
  return n;
}

export function countTotal(puzzle: Puzzle): number {
  let n = 0;
  for (const row of puzzle.grid) for (const c of row) if (c.type === 'input') n++;
  return n;
}

// Effect wrappers
export const getPuzzleEffect = (i: number) => Effect.sync(() => getPuzzle(i));
export const checkCompleteEffect = (p: Puzzle) => Effect.sync(() => checkComplete(p));
