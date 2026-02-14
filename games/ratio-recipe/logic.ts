import { Effect } from 'effect';

export interface Recipe {
  name: string;
  servesOriginal: number;
  servesTarget: number;
  ingredients: { name: string; amount: number; unit: string }[];
  answers: number[];
}

const RECIPES = [
  { name: '🍪 Cookies', ingredients: [{ name: 'Flour', amount: 2, unit: 'cups' }, { name: 'Sugar', amount: 1, unit: 'cup' }, { name: 'Butter', amount: 4, unit: 'tbsp' }, { name: 'Eggs', amount: 2, unit: '' }] },
  { name: '🥞 Pancakes', ingredients: [{ name: 'Flour', amount: 3, unit: 'cups' }, { name: 'Milk', amount: 2, unit: 'cups' }, { name: 'Eggs', amount: 1, unit: '' }, { name: 'Sugar', amount: 4, unit: 'tbsp' }] },
  { name: '🍕 Pizza Dough', ingredients: [{ name: 'Flour', amount: 4, unit: 'cups' }, { name: 'Water', amount: 1, unit: 'cup' }, { name: 'Yeast', amount: 2, unit: 'tsp' }, { name: 'Salt', amount: 1, unit: 'tsp' }] },
  { name: '🧁 Cupcakes', ingredients: [{ name: 'Flour', amount: 2, unit: 'cups' }, { name: 'Sugar', amount: 1, unit: 'cup' }, { name: 'Milk', amount: 1, unit: 'cup' }, { name: 'Eggs', amount: 3, unit: '' }] },
  { name: '🍰 Cake', ingredients: [{ name: 'Flour', amount: 3, unit: 'cups' }, { name: 'Sugar', amount: 2, unit: 'cups' }, { name: 'Butter', amount: 6, unit: 'tbsp' }, { name: 'Eggs', amount: 4, unit: '' }] },
];

export const generateRecipeEffect = (difficulty: string): Effect.Effect<Recipe> =>
  Effect.sync(() => {
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    const servesOriginal = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 4 : 6;
    const multipliers = difficulty === 'easy' ? [2, 3] : difficulty === 'medium' ? [2, 3, 0.5] : [1.5, 2.5, 0.5, 3];
    const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    const servesTarget = servesOriginal * mult;
    const answers = recipe.ingredients.map(i => i.amount * mult);
    return { name: recipe.name, servesOriginal, servesTarget, ingredients: recipe.ingredients, answers };
  });

export const checkAnswerEffect = (userAnswers: number[], correct: number[]): Effect.Effect<{ correct: number; total: number }> =>
  Effect.succeed((() => {
    let c = 0;
    for (let i = 0; i < correct.length; i++) {
      if (Math.abs(userAnswers[i] - correct[i]) < 0.01) c++;
    }
    return { correct: c, total: correct.length };
  })());

export const calcScoreEffect = (correct: number, total: number, round: number): Effect.Effect<number> =>
  Effect.succeed(correct * 25 * round);

export const getGradeEffect = (totalCorrect: number, totalQuestions: number): Effect.Effect<{ grade: string; message: string }> =>
  Effect.succeed((() => {
    const pct = totalCorrect / totalQuestions * 100;
    const grade = pct >= 95 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const message = pct >= 95 ? '🏆 Master Chef!' : pct >= 80 ? '⭐ Great Cook!' : '💪 Keep Practicing!';
    return { grade, message };
  })());

export function generateRecipe(d: string): Recipe { return Effect.runSync(generateRecipeEffect(d)); }
export function checkRecipeAnswer(u: number[], c: number[]) { return Effect.runSync(checkAnswerEffect(u, c)); }
export function calcScore(c: number, t: number, r: number): number { return Effect.runSync(calcScoreEffect(c, t, r)); }
export function getGrade(c: number, t: number) { return Effect.runSync(getGradeEffect(c, t)); }
