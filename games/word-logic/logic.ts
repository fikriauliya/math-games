import { Effect } from 'effect';

export function letterValue(ch: string): number {
  return ch.toUpperCase().charCodeAt(0) - 64;
}

export function wordValue(word: string): number {
  return word.toUpperCase().split('').reduce((sum, ch) => sum + letterValue(ch), 0);
}

export type QuestionType = 'forward' | 'reverse';

export interface WordQuestion {
  type: QuestionType;
  word?: string;
  targetValue?: number;
  options: string[];
  answer: string;
}

const WORDS = [
  'CAT','DOG','SUN','MAP','PEN','CUP','HAT','BED','RUN','FLY',
  'BOX','JAM','NET','ZIP','OWL','BIG','RED','TOP','USE','WIN',
  'ACE','ADD','AGE','AIR','ANT','APE','ARC','ARM','AXE','BAD',
  'BAG','BAT','BAY','BUS','CAN','COP','DAD','DIG','DIP','EAR',
];

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

export const generateQuestionEffect = (round: number): Effect.Effect<WordQuestion> =>
  Effect.gen(function* () {
    const type: QuestionType = round % 2 === 0 ? 'forward' : 'reverse';
    const shuffled = yield* shuffleEffect([...WORDS]);

    if (type === 'forward') {
      const word = shuffled[0];
      const answer = String(wordValue(word));
      const wrongs = new Set<string>();
      while (wrongs.size < 3) {
        const w = String(wordValue(word) + (yield* randomInt(21)) - 10);
        if (w !== answer && parseInt(w) > 0) wrongs.add(w);
      }
      const options = yield* shuffleEffect([answer, ...wrongs]);
      return { type, word, options, answer };
    } else {
      const word = shuffled[0];
      const targetValue = wordValue(word);
      const wrongWords: string[] = [];
      for (const w of shuffled.slice(1)) {
        if (wordValue(w) !== targetValue && wrongWords.length < 3) wrongWords.push(w);
      }
      const options = yield* shuffleEffect([word, ...wrongWords]);
      return { type, targetValue, options, answer: word };
    }
  });

export const TOTAL = 10;

export function generateQuestion(round: number): WordQuestion {
  return Effect.runSync(generateQuestionEffect(round));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}

export function checkAnswer(selected: string, correct: string): boolean {
  return selected === correct;
}

export function getResultText(score: number, total: number): { emoji: string; title: string; sub: string } {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '📚' : '💪',
    title: perfect ? 'Word Genius!' : good ? 'Well Read!' : 'Keep Learning!',
    sub: `${score} of ${total} correct!`,
  };
}
