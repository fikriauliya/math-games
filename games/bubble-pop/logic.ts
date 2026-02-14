export const COLORS = ['#f093fb','#f5576c','#00d2ff','#3a7bd5','#ffd700','#4caf50','#ff6b6b','#a29bfe','#fd79a8','#00cec9'];

export function generateTarget(mode: string): number {
  return mode === 'single' ? Math.floor(Math.random() * 20) + 1 : Math.floor(Math.random() * 15) + 5;
}

export function generateBubbleNumber(mode: string, target: number): number {
  if (Math.random() < 0.3) {
    if (mode === 'single') return target;
    return Math.floor(Math.random() * (target - 1)) + 1;
  }
  return Math.floor(Math.random() * 20) + 1;
}

export function checkSingleMatch(num: number, target: number): boolean {
  return num === target;
}

export function checkPairMatch(num1: number, num2: number, target: number): boolean {
  return num1 + num2 === target;
}

export function calcPopScore(combo: number, mode: string): number {
  const base = mode === 'single' ? 10 : 20;
  return base * Math.min(combo, 5);
}

export function getResultTitle(score: number): string {
  if (score >= 500) return '🏆 AMAZING!';
  if (score >= 200) return '⭐ Great Job!';
  return '💪 Keep Going!';
}
