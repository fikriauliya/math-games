import { Effect, Either } from 'effect';

export interface Question {
  text: string;
  answer: string;
  choices: string[];
  direction: 'toArabic' | 'toRoman';
}

const ROMAN_MAP: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
  [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I'],
];

export function toRoman(n: number): string {
  let result = '';
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

export function fromRoman(s: string): number {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]], next = map[s[i + 1]] || 0;
    result += cur < next ? -cur : cur;
  }
  return result;
}

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

const RANGES: [number, number][] = [
  [1, 10], [1, 20], [1, 30], [1, 50], [10, 100], [50, 200],
  [1, 300], [100, 500], [1, 1000], [100, 2000], [500, 3000], [1, 3999],
];

export const genQuestionEffect = (round: number): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const [min, max] = RANGES[Math.min(round, RANGES.length - 1)];
    const num = (yield* randomInt(max - min + 1)) + min;
    const roman = toRoman(num);
    const dir = (yield* randomInt(2)) === 0 ? 'toArabic' : 'toRoman';

    if (dir === 'toArabic') {
      const answer = String(num);
      const choices = new Set([num]);
      while (choices.size < 4) {
        const wrong = num + (yield* randomInt(20)) - 10;
        if (wrong !== num && wrong > 0) choices.add(wrong);
      }
      return { text: `What is ${roman}?`, answer, choices: [...choices].sort((a, b) => a - b).map(String), direction: dir };
    } else {
      const answer = roman;
      const choices = new Set([roman]);
      while (choices.size < 4) {
        const wrongNum = num + (yield* randomInt(10)) - 5;
        if (wrongNum > 0 && wrongNum !== num) choices.add(toRoman(wrongNum));
      }
      return { text: `Write ${num} in Roman numerals`, answer, choices: [...choices].sort(), direction: dir };
    }
  });

export const validateAnswer = (user: string, correct: string): Either.Either<string, string> =>
  user === correct ? Either.right('Correct!') : Either.left(`Wrong! Answer: ${correct}`);

export const getResultText = (score: number, total: number): { emoji: string; title: string; sub: string } => {
  const pct = (score / total) * 100;
  if (pct >= 90) return { emoji: '🏛️', title: 'Roman Emperor!', sub: `${score}/${total} correct!` };
  if (pct >= 60) return { emoji: '⚔️', title: 'Great Centurion!', sub: `${score}/${total} correct!` };
  return { emoji: '🛡️', title: 'Keep Training!', sub: `${score}/${total} correct!` };
};

export const TOTAL = 12;

export function genQuestion(round: number): Question {
  return Effect.runSync(genQuestionEffect(round));
}
