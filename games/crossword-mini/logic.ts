import { Effect } from 'effect';

export interface Clue {
  id: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  answer: string;
  clue: string;
}

export interface Puzzle {
  size: number;
  grid: (string | null)[][]; // null = black cell
  clues: Clue[];
}

const PUZZLES: Puzzle[] = [
  {
    size: 5,
    grid: [
      ['C','A','T',null,null],
      ['U',null,'H',null,null],
      ['P','L','U','S',null],
      [null,null,'M',null,null],
      [null,null,'B',null,null],
    ],
    clues: [
      { id: 1, direction: 'across', row: 0, col: 0, answer: 'CAT', clue: 'A pet that meows 🐱' },
      { id: 2, direction: 'across', row: 2, col: 0, answer: 'PLUS', clue: 'The + sign is called ___' },
      { id: 3, direction: 'down', row: 0, col: 0, answer: 'CUP', clue: 'You drink from a ___' },
      { id: 4, direction: 'down', row: 0, col: 2, answer: 'THUMB', clue: 'Your biggest finger 👍' },
    ]
  },
  {
    size: 5,
    grid: [
      ['S','U','N',null,null],
      [null,null,'I',null,null],
      ['F','I','N','E',null],
      [null,null,'E',null,null],
      [null,null,null,null,null],
    ],
    clues: [
      { id: 1, direction: 'across', row: 0, col: 0, answer: 'SUN', clue: 'It shines in the sky ☀️' },
      { id: 2, direction: 'across', row: 2, col: 0, answer: 'FINE', clue: 'Opposite of bad' },
      { id: 3, direction: 'down', row: 0, col: 2, answer: 'NINE', clue: '3 × 3 = ___' },
    ]
  },
  {
    size: 5,
    grid: [
      ['D','O','G',null,null],
      [null,'N','O',null,null],
      [null,'E','O','D',null],
      [null,null,'D',null,null],
      [null,null,null,null,null],
    ],
    clues: [
      { id: 1, direction: 'across', row: 0, col: 0, answer: 'DOG', clue: 'A pet that barks 🐶' },
      { id: 2, direction: 'across', row: 1, col: 1, answer: 'NO', clue: 'Opposite of yes' },
      { id: 3, direction: 'down', row: 0, col: 2, answer: 'GOOD', clue: 'Opposite of bad' },
      { id: 4, direction: 'down', row: 1, col: 1, answer: 'ONE', clue: 'The first number' },
    ]
  },
];

export function getPuzzle(index: number): Puzzle {
  return PUZZLES[index % PUZZLES.length];
}

export function getPuzzleCount(): number {
  return PUZZLES.length;
}

export function createEmptyGrid(puzzle: Puzzle): (string | null)[][] {
  return puzzle.grid.map(row => row.map(cell => cell === null ? null : ''));
}

export function checkCell(puzzle: Puzzle, row: number, col: number, letter: string): boolean {
  const expected = puzzle.grid[row]?.[col];
  return expected !== null && expected !== undefined && expected.toUpperCase() === letter.toUpperCase();
}

export function checkComplete(puzzle: Puzzle, userGrid: (string | null)[][]): boolean {
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.grid[r][c] !== null) {
        if (!userGrid[r][c] || userGrid[r][c]!.toUpperCase() !== puzzle.grid[r][c]!.toUpperCase()) {
          return false;
        }
      }
    }
  }
  return true;
}

export function countCorrect(puzzle: Puzzle, userGrid: (string | null)[][]): number {
  let count = 0;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.grid[r][c] !== null && userGrid[r][c] && userGrid[r][c]!.toUpperCase() === puzzle.grid[r][c]!.toUpperCase()) {
        count++;
      }
    }
  }
  return count;
}

export function totalLetters(puzzle: Puzzle): number {
  let count = 0;
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (puzzle.grid[r][c] !== null) count++;
    }
  }
  return count;
}

// Effect wrappers
export const getPuzzleEffect = (i: number) => Effect.sync(() => getPuzzle(i));
export const checkCellEffect = (p: Puzzle, r: number, c: number, l: string) => Effect.sync(() => checkCell(p, r, c, l));
export const checkCompleteEffect = (p: Puzzle, g: (string | null)[][]) => Effect.sync(() => checkComplete(p, g));
