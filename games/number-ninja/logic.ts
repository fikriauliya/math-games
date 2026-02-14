export interface DiffConfig {
  maxNum: number;
  ops: string[];
  speed: number;
  spawnMs: number;
  lives: number;
}

export const CONFIG: Record<string, DiffConfig> = {
  easy:   { maxNum: 10, ops: ['+','-'], speed: 0.4, spawnMs: 3000, lives: 5 },
  medium: { maxNum: 12, ops: ['+','-','×'], speed: 0.6, spawnMs: 2200, lives: 4 },
  hard:   { maxNum: 15, ops: ['+','-','×','÷'], speed: 0.8, spawnMs: 1800, lives: 3 },
};

export function genQuestion(diff: string): { text: string; answer: number } {
  const c = CONFIG[diff];
  const op = c.ops[Math.floor(Math.random() * c.ops.length)];
  let a: number, b: number, answer: number, text: string;
  switch (op) {
    case '+':
      a = Math.floor(Math.random() * c.maxNum) + 1;
      b = Math.floor(Math.random() * c.maxNum) + 1;
      answer = a + b; text = `${a} + ${b}`;
      break;
    case '-':
      a = Math.floor(Math.random() * c.maxNum) + 2;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b; text = `${a} − ${b}`;
      break;
    case '×':
      a = Math.floor(Math.random() * c.maxNum) + 1;
      b = Math.floor(Math.random() * 10) + 2;
      answer = a * b; text = `${a} × ${b}`;
      break;
    case '÷':
    default:
      b = Math.floor(Math.random() * 9) + 2;
      answer = Math.floor(Math.random() * c.maxNum) + 1;
      a = answer * b;
      text = `${a} ÷ ${b}`;
      break;
  }
  return { text, answer };
}

export function calcPoints(combo: number): number {
  return 10 * (1 + Math.floor(combo / 3));
}

export function calcAccuracy(slashed: number, missed: number): number {
  return slashed + missed > 0 ? Math.round(slashed / (slashed + missed) * 100) : 0;
}
