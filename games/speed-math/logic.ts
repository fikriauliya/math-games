export interface Question {
  text: string;
  answer: number;
  choices: number[];
}

export function genQ(diff: string): Question {
  const max: Record<string, number> = { easy: 10, medium: 20, hard: 50 };
  const ops = diff === 'easy' ? ['+'] : diff === 'medium' ? ['+', '−'] : ['+', '−', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, ans: number;
  if (op === '×') { a = Math.floor(Math.random()*12)+1; b = Math.floor(Math.random()*12)+1; ans = a*b; }
  else if (op === '−') { a = Math.floor(Math.random()*max[diff])+1; b = Math.floor(Math.random()*a)+1; ans = a-b; }
  else { a = Math.floor(Math.random()*max[diff])+1; b = Math.floor(Math.random()*max[diff])+1; ans = a+b; }

  const choices = new Set([ans]);
  while (choices.size < 4) {
    const wrong = ans + Math.floor(Math.random()*10) - 5;
    if (wrong !== ans && wrong >= 0) choices.add(wrong);
  }
  return { text: `${a} ${op} ${b} = ?`, answer: ans, choices: [...choices].sort((a,b) => a-b) };
}

export function calcScore(streak: number): number {
  const bonus = Math.min(streak, 5);
  return 10 * bonus;
}

export function getGrade(correct: number, total: number): { grade: string; message: string } {
  const pct = correct / total * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  return { grade, message };
}
