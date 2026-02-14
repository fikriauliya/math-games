import { Effect } from 'effect';

export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND';

export interface Puzzle {
  gates: { type: GateType; inputs: boolean[]; }[];
  answer: boolean;
  description: string;
}

function evalGate(type: GateType, inputs: boolean[]): boolean {
  switch (type) {
    case 'AND': return inputs.every(Boolean);
    case 'OR': return inputs.some(Boolean);
    case 'NOT': return !inputs[0];
    case 'XOR': return inputs[0] !== inputs[1];
    case 'NAND': return !inputs.every(Boolean);
  }
}

function boolStr(b: boolean): string { return b ? '1' : '0'; }

const PUZZLE_TEMPLATES: (() => Puzzle)[] = [
  () => {
    const a = Math.random() > 0.5, b = Math.random() > 0.5;
    return { gates: [{ type: 'AND', inputs: [a, b] }], answer: evalGate('AND', [a, b]),
      description: `${boolStr(a)} AND ${boolStr(b)} = ?` };
  },
  () => {
    const a = Math.random() > 0.5, b = Math.random() > 0.5;
    return { gates: [{ type: 'OR', inputs: [a, b] }], answer: evalGate('OR', [a, b]),
      description: `${boolStr(a)} OR ${boolStr(b)} = ?` };
  },
  () => {
    const a = Math.random() > 0.5;
    return { gates: [{ type: 'NOT', inputs: [a] }], answer: evalGate('NOT', [a]),
      description: `NOT ${boolStr(a)} = ?` };
  },
  () => {
    const a = Math.random() > 0.5, b = Math.random() > 0.5;
    return { gates: [{ type: 'XOR', inputs: [a, b] }], answer: evalGate('XOR', [a, b]),
      description: `${boolStr(a)} XOR ${boolStr(b)} = ?` };
  },
  () => {
    const a = Math.random() > 0.5, b = Math.random() > 0.5;
    const mid = evalGate('AND', [a, b]);
    return { gates: [{ type: 'AND', inputs: [a, b] }, { type: 'NOT', inputs: [mid] }], answer: !mid,
      description: `NOT (${boolStr(a)} AND ${boolStr(b)}) = ?` };
  },
  () => {
    const a = Math.random() > 0.5, b = Math.random() > 0.5;
    return { gates: [{ type: 'NAND', inputs: [a, b] }], answer: evalGate('NAND', [a, b]),
      description: `${boolStr(a)} NAND ${boolStr(b)} = ?` };
  },
];

export function generatePuzzle(): Puzzle {
  return PUZZLE_TEMPLATES[Math.floor(Math.random() * PUZZLE_TEMPLATES.length)]();
}

export function checkAnswer(puzzle: Puzzle, answer: boolean): boolean {
  return puzzle.answer === answer;
}

export function evalGateExport(type: GateType, inputs: boolean[]): boolean {
  return evalGate(type, inputs);
}

// Effect wrappers
export const generatePuzzleEffect = () => Effect.sync(() => generatePuzzle());
export const checkAnswerEffect = (p: Puzzle, a: boolean) => Effect.sync(() => checkAnswer(p, a));
