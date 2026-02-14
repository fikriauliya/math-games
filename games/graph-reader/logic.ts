import { Effect } from 'effect';

export interface BarData { label: string; value: number; }
export interface Question {
  bars: BarData[];
  questionText: string;
  answer: number;
  choices: number[];
}

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const topics = ['books read', 'points scored', 'apples picked', 'laps run', 'goals scored'];

export const genQuestionEffect = (): Effect.Effect<Question> =>
  Effect.gen(function* () {
    const count = yield* randomInt(4, 7);
    const bars: BarData[] = [];
    for (let i = 0; i < count; i++) {
      bars.push({ label: labels[i], value: yield* randomInt(1, 20) });
    }
    const qType = yield* randomInt(0, 3);
    const topic = topics[yield* randomInt(0, topics.length - 1)];
    let questionText: string, answer: number;

    if (qType === 0) {
      const idx = yield* randomInt(0, bars.length - 1);
      questionText = `How many ${topic} on ${bars[idx].label}?`;
      answer = bars[idx].value;
    } else if (qType === 1) {
      const max = bars.reduce((a, b) => a.value > b.value ? a : b);
      questionText = `Which day had the most ${topic}? (value)`;
      answer = max.value;
    } else if (qType === 2) {
      const min = bars.reduce((a, b) => a.value < b.value ? a : b);
      questionText = `Which day had the fewest ${topic}? (value)`;
      answer = min.value;
    } else {
      answer = bars.reduce((s, b) => s + b.value, 0);
      questionText = `Total ${topic} for all days?`;
    }

    const choices = new Set([answer]);
    while (choices.size < 4) {
      const off = (yield* randomInt(1, 5)) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      const w = answer + off;
      if (w > 0 && w !== answer) choices.add(w);
    }

    return { bars, questionText, answer, choices: [...choices].sort((a, b) => a - b) };
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genQuestion(): Question { return Effect.runSync(genQuestionEffect()); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function sumBars(bars: BarData[]): number { return bars.reduce((s, b) => s + b.value, 0); }
export function maxBar(bars: BarData[]): BarData { return bars.reduce((a, b) => a.value > b.value ? a : b); }
export function minBar(bars: BarData[]): BarData { return bars.reduce((a, b) => a.value < b.value ? a : b); }
