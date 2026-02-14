export const EMOJIS = ['🍎','🍌','🌟','🐟','🦋','🌸','🎈','🍪','🐣','🍓','🧁','🐞','🌈','🎀','🍩'];
export const TOTAL = 8;

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateAnswer(): number {
  return Math.floor(Math.random() * 5) + 1;
}

export function pickEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export function generateChoices(answer: number): number[] {
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const n = Math.floor(Math.random() * 5) + 1;
    if (n !== answer) wrong.add(n);
  }
  return shuffle([answer, ...wrong]);
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Pintar Sekali!' : good ? 'Bagus!' : 'Ayo Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
