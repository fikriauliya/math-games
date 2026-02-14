import { describe, it, expect } from 'bun:test';
import { createTrain, swapCars, isCorrectOrder, getEndResult, CAR_COLORS } from './logic';

describe('toddler-train logic', () => {
  it('createTrain returns 5 cars', () => {
    expect(createTrain().length).toBe(5);
  });

  it('cars have numbers 1-5', () => {
    const cars = createTrain();
    const nums = cars.map(c => c.number).sort();
    expect(nums).toEqual([1, 2, 3, 4, 5]);
  });

  it('swapCars swaps correctly', () => {
    const cars = createTrain().sort((a, b) => a.number - b.number);
    const swapped = swapCars(cars, 0, 4);
    expect(swapped[0].number).toBe(5);
    expect(swapped[4].number).toBe(1);
  });

  it('isCorrectOrder works', () => {
    const sorted = createTrain().sort((a, b) => a.number - b.number);
    expect(isCorrectOrder(sorted)).toBe(true);
    const wrong = swapCars(sorted, 0, 1);
    expect(isCorrectOrder(wrong)).toBe(false);
  });

  it('getEndResult tiers', () => {
    expect(getEndResult(4).stars).toBe('⭐⭐⭐');
    expect(getEndResult(10).stars).toBe('⭐⭐');
    expect(getEndResult(15).stars).toBe('⭐');
  });

  it('CAR_COLORS has 5 colors', () => {
    expect(CAR_COLORS.length).toBe(5);
  });
});
