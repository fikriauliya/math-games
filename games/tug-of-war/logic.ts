export interface Question {
  text: string;
  answer: number;
}

export function genQuestion(difficulty: string, operations: string): Question {
  const ranges: Record<string, number> = { easy: 10, medium: 20, hard: 50 };
  const max = ranges[difficulty] || 20;

  let op: string;
  if (operations === 'add') op = '+';
  else if (operations === 'sub') op = '−';
  else if (operations === 'mul') op = '×';
  else if (operations === 'mix') op = Math.random() < 0.5 ? '+' : '−';
  else op = ['+', '−', '×'][Math.floor(Math.random() * 3)];

  let a: number, b: number, answer: number;
  if (op === '×') {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  } else if (op === '−') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}

export function clampRopeOffset(offset: number): number {
  return Math.max(-100, Math.min(100, offset));
}

export function calcRopeOffset(current: number, team: number, delta: number = 8): number {
  const newOffset = current + (team === 1 ? -delta : delta);
  return clampRopeOffset(newOffset);
}

export function determineWinner(score1: number, score2: number): string {
  if (score1 > score2) return '🏆 Team 1 Wins!';
  if (score2 > score1) return '🏆 Team 2 Wins!';
  return "🤝 It's a Tie!";
}

export function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
