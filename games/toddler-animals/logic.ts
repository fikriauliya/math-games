export interface Animal {
  emoji: string;
  name: string;
  sound: string;
  wrong: string[];
}

export const ANIMALS: Animal[] = [
  { emoji: '🐄', name: 'Sapi', sound: 'Mooo!', wrong: ['Guk guk!', 'Meong!', 'Kukuruyuk!'] },
  { emoji: '🐔', name: 'Ayam', sound: 'Kukuruyuk!', wrong: ['Mooo!', 'Mbee!', 'Kwek kwek!'] },
  { emoji: '🐱', name: 'Kucing', sound: 'Meong!', wrong: ['Guk guk!', 'Cit cit!', 'Mooo!'] },
  { emoji: '🐶', name: 'Anjing', sound: 'Guk guk!', wrong: ['Meong!', 'Mooo!', 'Mbee!'] },
  { emoji: '🐸', name: 'Katak', sound: 'Koak koak!', wrong: ['Cit cit!', 'Guk guk!', 'Kukuruyuk!'] },
  { emoji: '🐑', name: 'Domba', sound: 'Mbee!', wrong: ['Mooo!', 'Guk guk!', 'Koak koak!'] },
  { emoji: '🦆', name: 'Bebek', sound: 'Kwek kwek!', wrong: ['Kukuruyuk!', 'Cit cit!', 'Meong!'] },
  { emoji: '🐦', name: 'Burung', sound: 'Cit cit!', wrong: ['Kwek kwek!', 'Koak koak!', 'Mbee!'] },
  { emoji: '🐷', name: 'Babi', sound: 'Oink oink!', wrong: ['Mooo!', 'Guk guk!', 'Mbee!'] },
  { emoji: '🦁', name: 'Singa', sound: 'Aum!', wrong: ['Guk guk!', 'Meong!', 'Mooo!'] },
];

export const TOTAL = 6;

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function checkAnswer(answer: string, correctSound: string): boolean {
  return answer === correctSound;
}

export function getOptions(animal: Animal): string[] {
  const wrongPick = shuffle([...animal.wrong]).slice(0, 3);
  return shuffle([animal.sound, ...wrongPick]);
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
