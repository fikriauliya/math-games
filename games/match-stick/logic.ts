import { Effect } from 'effect';

// Matchstick segments for digits 0-9 (7-segment: top, topRight, bottomRight, bottom, bottomLeft, topLeft, middle)
export const SEGMENTS: Record<string, boolean[]> = {
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
  '+': [false, false, false, false, false, false, true],
  '-': [false, false, false, false, false, false, true],
  '=': [false, false, false, true, false, false, true],
};

export interface Puzzle {
  broken: string;    // e.g., "8+3=12" (wrong)
  answer: string;    // e.g., "6+3=9"  (correct after moving)
  hint: string;
}

const PUZZLES: Puzzle[] = [
  { broken: '6+4=4', answer: '8+4=12', hint: 'Move 1 stick on the 6' },
  { broken: '5+5=55', answer: '5+5=10', hint: 'Fix the equals side' },
  { broken: '3+3=8', answer: '3+5=8', hint: 'Change the second 3' },
  { broken: '1+1=3', answer: '1+1=2', hint: 'Fix the answer' },
  { broken: '9-6=1', answer: '9-6=3', hint: 'Fix the result' },
  { broken: '6+6=6', answer: '8+6=14', hint: 'Move sticks to fix it' },
];

export function getPuzzle(index: number): Puzzle {
  return PUZZLES[index % PUZZLES.length];
}

export function getPuzzleCount(): number { return PUZZLES.length; }

export function checkSolution(puzzle: Puzzle, userAnswer: string): boolean {
  return userAnswer.replace(/\s/g, '') === puzzle.answer.replace(/\s/g, '');
}

export function getSegments(ch: string): boolean[] {
  return SEGMENTS[ch] || [false, false, false, false, false, false, false];
}

// Effect wrappers
export const getPuzzleEffect = (i: number) => Effect.sync(() => getPuzzle(i));
export const checkSolutionEffect = (p: Puzzle, a: string) => Effect.sync(() => checkSolution(p, a));
