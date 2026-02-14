import { Effect } from 'effect';

export interface Emotion {
  name: string;
  emoji: string;
}

export const EMOTIONS: Emotion[] = [
  { name: 'SENANG', emoji: '😊' },
  { name: 'SEDIH', emoji: '😢' },
  { name: 'MARAH', emoji: '😠' },
  { name: 'TAKUT', emoji: '😨' },
  { name: 'TERKEJUT', emoji: '😲' },
  { name: 'MENGANTUK', emoji: '😴' },
];

export const TOTAL = 8;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(arr: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });

export interface EmotionRound {
  target: Emotion;
  choices: Emotion[];
}

export const generateRoundEffect = (target: Emotion, allEmotions: Emotion[]): Effect.Effect<EmotionRound> =>
  Effect.gen(function* () {
    const others = allEmotions.filter(e => e.name !== target.name);
    const shuffled = yield* shuffleEffect(others);
    const wrong = shuffled[0];
    const choices = yield* shuffleEffect([target, wrong]);
    return { target, choices };
  });

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateRound(target: Emotion, all: Emotion[]): EmotionRound { return Effect.runSync(generateRoundEffect(target, all)); }
export function checkAnswer(selected: string, correct: string): boolean { return selected === correct; }

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
}
