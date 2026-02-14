import { Effect } from 'effect';

export interface Puzzle {
  name: string;
  grid: boolean[][];  // 5x5, true = filled
  rowClues: number[][];
  colClues: number[][];
}

function computeClues(line: boolean[]): number[] {
  const clues: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell) count++;
    else if (count > 0) { clues.push(count); count = 0; }
  }
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
}

function makePuzzle(name: string, rows: string[]): Puzzle {
  const grid = rows.map(r => r.split('').map(c => c === '█'));
  const rowClues = grid.map(row => computeClues(row));
  const colClues: number[][] = [];
  for (let c = 0; c < 5; c++) {
    colClues.push(computeClues(grid.map(r => r[c])));
  }
  return { name, grid, rowClues, colClues };
}

export const PUZZLES: Puzzle[] = [
  makePuzzle('Heart', [
    '░█░█░',
    '█████',
    '█████',
    '░███░',
    '░░█░░',
  ]),
  makePuzzle('Cross', [
    '░░█░░',
    '░░█░░',
    '█████',
    '░░█░░',
    '░░█░░',
  ]),
  makePuzzle('Arrow', [
    '░░█░░',
    '░███░',
    '█████',
    '░░█░░',
    '░░█░░',
  ]),
  makePuzzle('Smile', [
    '░░░░░',
    '░█░█░',
    '░░░░░',
    '█░░░█',
    '░███░',
  ]),
  makePuzzle('Star', [
    '░░█░░',
    '░███░',
    '█████',
    '░███░',
    '░█░█░',
  ]),
  makePuzzle('T', [
    '█████',
    '░░█░░',
    '░░█░░',
    '░░█░░',
    '░░█░░',
  ]),
  makePuzzle('L', [
    '█░░░░',
    '█░░░░',
    '█░░░░',
    '█░░░░',
    '█████',
  ]),
  makePuzzle('Diamond', [
    '░░█░░',
    '░█░█░',
    '█░░░█',
    '░█░█░',
    '░░█░░',
  ]),
  makePuzzle('Box', [
    '█████',
    '█░░░█',
    '█░░░█',
    '█░░░█',
    '█████',
  ]),
  makePuzzle('Check', [
    '░░░░█',
    '░░░█░',
    '█░█░░',
    '░█░░░',
    '░░░░░',
  ]),
];

export function checkSolution(playerGrid: boolean[][], puzzle: Puzzle): boolean {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (playerGrid[r][c] !== puzzle.grid[r][c]) return false;
    }
  }
  return true;
}

export function createEmptyGrid(): boolean[][] {
  return Array.from({ length: 5 }, () => Array(5).fill(false));
}

export function toggleCell(grid: boolean[][], r: number, c: number): boolean[][] {
  const g = grid.map(row => [...row]);
  g[r][c] = !g[r][c];
  return g;
}

export function getPuzzlesForDifficulty(diff: number): Puzzle[] {
  const start = diff * 5;
  return PUZZLES.slice(start, start + 5).length ? PUZZLES.slice(start, start + 5) : PUZZLES.slice(0, 5);
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const pickRandomPuzzle = (puzzles: Puzzle[]): Effect.Effect<Puzzle> =>
  Effect.gen(function* () {
    const i = yield* randomInt(puzzles.length);
    return puzzles[i];
  });

export function getRandomPuzzle(puzzles: Puzzle[]): Puzzle {
  return Effect.runSync(pickRandomPuzzle(puzzles));
}
