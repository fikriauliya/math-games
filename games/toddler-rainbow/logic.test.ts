import { describe, it, expect } from 'bun:test';
import { RAINBOW_COLORS, shuffleColors, isCorrectOrder, swapColors, getEndResult } from './logic';

describe('toddler-rainbow logic', () => {
  it('has 7 rainbow colors', () => {
    expect(RAINBOW_COLORS.length).toBe(7);
  });

  it('colors are in correct order', () => {
    expect(isCorrectOrder(RAINBOW_COLORS)).toBe(true);
  });

  it('shuffleColors returns 7 colors', () => {
    expect(shuffleColors().length).toBe(7);
  });

  it('swapColors swaps correctly', () => {
    const colors = [...RAINBOW_COLORS];
    const swapped = swapColors(colors, 0, 1);
    expect(swapped[0].name).toBe('Jingga');
    expect(swapped[1].name).toBe('Merah');
  });

  it('isCorrectOrder detects wrong order', () => {
    const colors = swapColors([...RAINBOW_COLORS], 0, 1);
    expect(isCorrectOrder(colors)).toBe(false);
  });

  it('getEndResult returns correct tiers', () => {
    expect(getEndResult(5).stars).toBe('⭐⭐⭐');
    expect(getEndResult(15).stars).toBe('⭐⭐');
    expect(getEndResult(25).stars).toBe('⭐');
  });
});
