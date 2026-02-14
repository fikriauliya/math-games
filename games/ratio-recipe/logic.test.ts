import { describe, it, expect } from 'bun:test';
import { generateRecipe, checkRecipeAnswer, calcScore, getGrade } from './logic';

describe('ratio-recipe logic', () => {
  it('generates recipe with ingredients', () => {
    const r = generateRecipe('easy');
    expect(r.ingredients.length).toBeGreaterThanOrEqual(3);
    expect(r.answers.length).toBe(r.ingredients.length);
  });

  it('answers scale correctly', () => {
    const r = generateRecipe('easy');
    const ratio = r.servesTarget / r.servesOriginal;
    r.ingredients.forEach((ing, i) => {
      expect(Math.abs(r.answers[i] - ing.amount * ratio)).toBeLessThan(0.01);
    });
  });

  it('checkRecipeAnswer counts correct answers', () => {
    const result = checkRecipeAnswer([4, 2, 8, 4], [4, 2, 8, 4]);
    expect(result.correct).toBe(4);
  });

  it('checkRecipeAnswer detects wrong answers', () => {
    const result = checkRecipeAnswer([4, 3, 8, 4], [4, 2, 8, 4]);
    expect(result.correct).toBe(3);
  });

  it('calcScore increases with round', () => {
    expect(calcScore(4, 4, 2)).toBeGreaterThan(calcScore(4, 4, 1));
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(20, 20).grade).toBe('S');
  });
});
