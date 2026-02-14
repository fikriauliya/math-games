import { Effect } from 'effect';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  categories: string[][];
  solution: number[]; // solution[i] = index in categories[1] that matches categories[0][i]
  clues: string[];
  size: number;
}

export interface GridState {
  puzzle: Puzzle;
  marks: number[][]; // 0=unknown, 1=yes, -1=no
  completed: boolean;
  startTime: number;
}

const NAMES_POOL = [
  ['Ali', 'Bella', 'Citra', 'Dani'],
  ['Eko', 'Fira', 'Gita', 'Hadi'],
];
const PETS_POOL = [
  ['Cat', 'Dog', 'Fish', 'Bird'],
  ['Rabbit', 'Hamster', 'Turtle', 'Parrot'],
];
const COLORS_POOL = [
  ['Red', 'Blue', 'Green', 'Yellow'],
  ['Purple', 'Orange', 'Pink', 'White'],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateClues(names: string[], items: string[], solution: number[], size: number): string[] {
  const clues: string[] = [];
  // Direct clue for one pair
  const directIdx = Math.floor(Math.random() * size);
  clues.push(`${names[directIdx]} has the ${items[solution[directIdx]]}.`);

  // Elimination clues for the rest
  for (let i = 0; i < size; i++) {
    if (i === directIdx) continue;
    // "X does NOT have Y" for two wrong items
    const wrong = shuffle(Array.from({ length: size }, (_, j) => j).filter(j => j !== solution[i]));
    if (wrong.length > 0) {
      clues.push(`${names[i]} does NOT have the ${items[wrong[0]]}.`);
    }
    if (wrong.length > 1 && size > 2) {
      clues.push(`${names[i]} does NOT have the ${items[wrong[1]]}.`);
    }
  }
  return shuffle(clues);
}

export const generatePuzzle = (diff: Difficulty): Effect.Effect<Puzzle> =>
  Effect.sync(() => {
    const size = diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;
    const poolIdx = Math.floor(Math.random() * NAMES_POOL.length);
    const names = shuffle(NAMES_POOL[poolIdx]).slice(0, size);
    const itemPool = Math.random() < 0.5 ? PETS_POOL : COLORS_POOL;
    const items = shuffle(itemPool[Math.floor(Math.random() * itemPool.length)]).slice(0, size);
    const solution = shuffle(Array.from({ length: size }, (_, i) => i));
    const clues = generateClues(names, items, solution, size);
    return { categories: [names, items], solution, clues, size };
  });

export function createGrid(puzzle: Puzzle): GridState {
  const marks = Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(0));
  return { puzzle, marks, completed: false, startTime: Date.now() };
}

export function toggleMark(state: GridState, row: number, col: number): GridState {
  if (state.completed) return state;
  const marks = state.marks.map(r => [...r]);
  marks[row][col] = marks[row][col] === 0 ? -1 : marks[row][col] === -1 ? 1 : 0;
  const completed = checkSolution(marks, state.puzzle.solution);
  return { ...state, marks, completed };
}

export function checkSolution(marks: number[][], solution: number[]): boolean {
  for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution.length; j++) {
      const expected = solution[i] === j ? 1 : -1;
      if (marks[i][j] !== expected) return false;
    }
  }
  return true;
}

export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function createPuzzleSync(diff: Difficulty): Puzzle {
  return Effect.runSync(generatePuzzle(diff));
}
