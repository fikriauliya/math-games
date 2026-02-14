import { Effect } from 'effect';

export interface ClockQuestion { hour: number; minute: number; angle: number; choices: number[]; }

export const generateQuestionEffect = (difficulty: string): Effect.Effect<ClockQuestion> =>
  Effect.sync(() => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minuteOptions = difficulty === 'easy' ? [0, 30] : difficulty === 'medium' ? [0, 15, 30, 45] : Array.from({ length: 12 }, (_, i) => i * 5);
    const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];

    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    const minuteAngle = minute * 6;
    let angle = Math.abs(hourAngle - minuteAngle);
    if (angle > 180) angle = 360 - angle;
    angle = Math.round(angle * 10) / 10;

    const choices = new Set([angle]);
    while (choices.size < 4) {
      const offset = [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)] * (Math.random() < 0.5 ? 1 : -1);
      const wrong = Math.abs(angle + offset);
      if (wrong !== angle && wrong >= 0 && wrong <= 360) choices.add(wrong);
    }
    return { hour, minute, angle, choices: [...choices].sort((a, b) => a - b) };
  });

export const checkAnswerEffect = (s: number, c: number): Effect.Effect<boolean> => Effect.succeed(s === c);

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = correct / total * 100;
    const grade = pct >= 95 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 95 ? '🏆 Clock Master!' : pct >= 80 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function generateQuestion(d: string): ClockQuestion { return Effect.runSync(generateQuestionEffect(d)); }
export function checkAnswer(s: number, c: number): boolean { return Effect.runSync(checkAnswerEffect(s, c)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
