import { Effect } from 'effect';

export interface SoundItem {
  emoji: string;
  name: string;
  soundDesc: string;
  freq: number;
  type: OscillatorType;
  duration: number;
}

export const SOUNDS: SoundItem[] = [
  { emoji: '🚗', name: 'Mobil', soundDesc: 'Tin tin!', freq: 400, type: 'square', duration: 0.3 },
  { emoji: '🐶', name: 'Anjing', soundDesc: 'Guk guk!', freq: 300, type: 'sawtooth', duration: 0.2 },
  { emoji: '🐱', name: 'Kucing', soundDesc: 'Meong!', freq: 600, type: 'sine', duration: 0.4 },
  { emoji: '🌧️', name: 'Hujan', soundDesc: 'Ssshhh...', freq: 200, type: 'triangle', duration: 0.5 },
  { emoji: '🐔', name: 'Ayam', soundDesc: 'Kukuruyuk!', freq: 500, type: 'square', duration: 0.15 },
  { emoji: '🔔', name: 'Lonceng', soundDesc: 'Ting ting!', freq: 800, type: 'sine', duration: 0.3 },
  { emoji: '🐸', name: 'Katak', soundDesc: 'Koak koak!', freq: 250, type: 'square', duration: 0.2 },
  { emoji: '🎺', name: 'Terompet', soundDesc: 'Tut tut!', freq: 700, type: 'sawtooth', duration: 0.3 },
];

export interface SoundRound {
  target: SoundItem;
  choices: SoundItem[];
}

export const generateRoundEffect = (): Effect.Effect<SoundRound> =>
  Effect.sync(() => {
    const shuffled = [...SOUNDS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const wrong = shuffled[1];
    const choices = Math.random() > 0.5 ? [target, wrong] : [wrong, target];
    return { target, choices };
  });

export function generateRound(): SoundRound {
  return Effect.runSync(generateRoundEffect());
}

export function checkAnswer(selected: SoundItem, target: SoundItem): boolean {
  return selected.emoji === target.emoji;
}

export function getEndResult(correct: number, total: number): { title: string; stars: string } {
  const pct = correct / total;
  return {
    title: pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!',
    stars: pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐',
  };
}
