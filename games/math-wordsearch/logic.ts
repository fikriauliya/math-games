import { Effect } from 'effect';

export interface Puzzle {
  grid: string[][];
  words: string[];
  size: number;
  placements: { word: string; row: number; col: number; dr: number; dc: number }[];
}

const WORD_POOL = ['ADDITION', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'FRACTION', 'DECIMAL', 'PRIME', 'ANGLE', 'AREA', 'PERIMETER', 'RATIO', 'PERCENT', 'SQUARE', 'CUBE', 'MEDIAN', 'MEAN', 'SUM', 'FACTOR', 'DIGIT', 'ZERO', 'EQUAL', 'GRAPH', 'ALGEBRA', 'NUMBER', 'RADIUS'];

const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

function tryPlace(grid: string[][], word: string, size: number): { row: number; col: number; dr: number; dc: number } | null {
  const attempts = 100;
  for (let a = 0; a < attempts; a++) {
    const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) { fits = false; break; }
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) { fits = false; break; }
    }
    if (fits) {
      for (let i = 0; i < word.length; i++) grid[row + dr * i][col + dc * i] = word[i];
      return { row, col, dr, dc };
    }
  }
  return null;
}

export const generatePuzzleEffect = (difficulty: string): Effect.Effect<Puzzle> =>
  Effect.sync(() => {
    const size = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
    const wordCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const pool = [...WORD_POOL].filter(w => w.length <= size).sort(() => Math.random() - 0.5);

    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    const placements: Puzzle['placements'] = [];
    const words: string[] = [];

    for (const word of pool) {
      if (words.length >= wordCount) break;
      const p = tryPlace(grid, word, size);
      if (p) { placements.push({ word, ...p }); words.push(word); }
    }

    // Fill empty
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (grid[r][c] === '') grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    return { grid, words, size, placements };
  });

export const checkWordEffect = (word: string, words: string[]): Effect.Effect<boolean> =>
  Effect.succeed(words.includes(word));

export const calcScoreEffect = (found: number, total: number, timeLeft: number): Effect.Effect<number> =>
  Effect.succeed(found * 50 + timeLeft * 2);

export function generatePuzzle(d: string): Puzzle { return Effect.runSync(generatePuzzleEffect(d)); }
export function checkWord(w: string, ws: string[]): boolean { return Effect.runSync(checkWordEffect(w, ws)); }
export function calcScore(f: number, t: number, tl: number): number { return Effect.runSync(calcScoreEffect(f, t, tl)); }
