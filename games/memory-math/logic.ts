export interface Pair {
  equation: string;
  answer: string;
  id: number;
}

export interface Card {
  text: string;
  pairId: number;
  type: string;
}

export function genPairs(count: number): Pair[] {
  const pairs: Pair[] = [];
  const used = new Set<string>();
  while (pairs.length < count) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const ops = ['+', '−', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans: number;
    if (op === '+') ans = a + b;
    else if (op === '−') { if (a < b) continue; ans = a - b; }
    else ans = a * b;

    const eq = `${a} ${op} ${b}`;
    const key = eq + '=' + ans!;
    if (used.has(key)) continue;
    used.add(key);
    pairs.push({ equation: eq, answer: String(ans!), id: pairs.length });
  }
  return pairs;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeCards(pairs: Pair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach(p => {
    cards.push({ text: p.equation, pairId: p.id, type: 'eq' });
    cards.push({ text: p.answer, pairId: p.id, type: 'ans' });
  });
  return cards;
}

export function isMatch(cardA: Card, cardB: Card): boolean {
  return cardA.pairId === cardB.pairId;
}

export function getStars(matched: number, moves: number): string {
  const efficiency = matched / moves;
  return efficiency >= 0.8 ? '⭐⭐⭐' : efficiency >= 0.5 ? '⭐⭐' : '⭐';
}

export function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}
