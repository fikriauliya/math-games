import { Effect } from 'effect';

export interface ActionItem {
  name: string;
  emoji: string;
}

export const ACTIONS: ActionItem[] = [
  { name: 'LARI', emoji: '🏃' },
  { name: 'RENANG', emoji: '🏊' },
  { name: 'MAKAN', emoji: '🍽️' },
  { name: 'TIDUR', emoji: '😴' },
  { name: 'MENARI', emoji: '💃' },
  { name: 'MEMBACA', emoji: '📖' },
  { name: 'BERMAIN', emoji: '⚽' },
  { name: 'MENYANYI', emoji: '🎤' },
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

export interface ActionRound {
  target: ActionItem;
  choices: ActionItem[];
}

export const generateRoundEffect = (target: ActionItem, allActions: ActionItem[]): Effect.Effect<ActionRound> =>
  Effect.gen(function* () {
    const others = allActions.filter(a => a.name !== target.name);
    const shuffled = yield* shuffleEffect(others);
    const wrong = shuffled[0];
    const choices = yield* shuffleEffect([target, wrong]);
    return { target, choices };
  });

export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateRound(target: ActionItem, all: ActionItem[]): ActionRound { return Effect.runSync(generateRoundEffect(target, all)); }
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
