import { Effect, Either } from 'effect';

export interface Weather {
  emoji: string;
  name: string;
}

export const WEATHERS: Weather[] = [
  { emoji: '🌧️', name: 'Hujan' },
  { emoji: '☀️', name: 'Cerah' },
  { emoji: '☁️', name: 'Mendung' },
  { emoji: '❄️', name: 'Salju' },
  { emoji: '⛈️', name: 'Petir' },
  { emoji: '💨', name: 'Angin' },
  { emoji: '🌈', name: 'Pelangi' },
  { emoji: '🌤️', name: 'Berawan' },
];

export const TOTAL = 8;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export interface WeatherQuestion {
  target: Weather;
  options: Weather[];
}

export const generateQuestionEffect = (used: Weather[], remaining: Weather[]): Effect.Effect<WeatherQuestion> =>
  Effect.gen(function* () {
    const available = remaining.length > 0 ? remaining : WEATHERS;
    const idx = yield* randomInt(available.length);
    const target = available[idx];
    const others = WEATHERS.filter(w => w.name !== target.name);
    const wrongIdx = yield* randomInt(others.length);
    const wrong = others[wrongIdx];
    const options = yield* shuffleEffect([target, wrong]);
    return { target, options };
  });

export const checkAnswerEffect = (answer: string, correct: string): Either.Either<string, string> =>
  answer === correct ? Either.right('Benar!') : Either.left('Salah!');

export const getResultText = (score: number, total: number) => {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🌈' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
};

// Plain wrappers
export function shuffle<T>(a: T[]): T[] { return Effect.runSync(shuffleEffect(a)); }
export function generateQuestion(used: Weather[], remaining: Weather[]): WeatherQuestion { return Effect.runSync(generateQuestionEffect(used, remaining)); }
export function checkAnswer(answer: string, correct: string): boolean { return answer === correct; }
