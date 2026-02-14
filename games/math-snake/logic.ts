import { Effect } from 'effect';

export interface MathProblem { text: string; answer: number; }
export interface FoodItem { x: number; y: number; value: number; }

const randomInt = (min: number, max: number) => Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min);

export const genProblemEffect = (): Effect.Effect<MathProblem> =>
  Effect.gen(function* () {
    const a = yield* randomInt(1, 12);
    const b = yield* randomInt(1, 12);
    const opIdx = yield* randomInt(0, 1);
    if (opIdx === 0) return { text: `${a} + ${b}`, answer: a + b };
    const big = Math.max(a, b), small = Math.min(a, b);
    return { text: `${big} − ${small}`, answer: big - small };
  });

export const genFoodItemsEffect = (answer: number, gridSize: number, count: number): Effect.Effect<FoodItem[]> =>
  Effect.gen(function* () {
    const items: FoodItem[] = [];
    const positions = new Set<string>();
    // Add correct answer
    let x = yield* randomInt(1, gridSize - 2);
    let y = yield* randomInt(1, gridSize - 2);
    positions.add(`${x},${y}`);
    items.push({ x, y, value: answer });
    // Add wrong answers
    while (items.length < count) {
      x = yield* randomInt(1, gridSize - 2);
      y = yield* randomInt(1, gridSize - 2);
      const key = `${x},${y}`;
      if (positions.has(key)) continue;
      positions.add(key);
      let wrong = answer + (yield* randomInt(1, 5)) * ((yield* randomInt(0, 1)) === 0 ? 1 : -1);
      if (wrong < 0) wrong = answer + (yield* randomInt(1, 5));
      if (wrong === answer) wrong = answer + 1;
      items.push({ x, y, value: wrong });
    }
    return items;
  });

export const getGradeEffect = (correct: number, total: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = total === 0 ? 0 : (correct / total) * 100;
    const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const message = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function genProblem(): MathProblem { return Effect.runSync(genProblemEffect()); }
export function genFoodItems(answer: number, gridSize: number, count: number): FoodItem[] { return Effect.runSync(genFoodItemsEffect(answer, gridSize, count)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
export function isCorrectFood(value: number, answer: number): boolean { return value === answer; }
