import { describe, it, expect } from 'bun:test';
import { createBlocks, swapBlocks, isCorrectOrder, getEndResult, BLOCK_COLORS } from './logic';

describe('toddler-stacking logic', () => {
  it('createBlocks returns requested count', () => {
    expect(createBlocks(5).length).toBe(5);
  });

  it('blocks have decreasing sizes when sorted', () => {
    const blocks = createBlocks(5).sort((a, b) => b.size - a.size);
    for (let i = 0; i < blocks.length - 1; i++) {
      expect(blocks[i].size).toBeGreaterThan(blocks[i + 1].size);
    }
  });

  it('swapBlocks swaps correctly', () => {
    const blocks = createBlocks(3).sort((a, b) => b.size - a.size);
    const swapped = swapBlocks(blocks, 0, 2);
    expect(swapped[0].size).toBe(blocks[2].size);
    expect(swapped[2].size).toBe(blocks[0].size);
  });

  it('isCorrectOrder works', () => {
    const sorted = createBlocks(5).sort((a, b) => b.size - a.size);
    expect(isCorrectOrder(sorted)).toBe(true);
    const wrong = swapBlocks(sorted, 0, 4);
    expect(isCorrectOrder(wrong)).toBe(false);
  });

  it('getEndResult tiers', () => {
    expect(getEndResult(5).stars).toBe('⭐⭐⭐');
    expect(getEndResult(12).stars).toBe('⭐⭐');
    expect(getEndResult(20).stars).toBe('⭐');
  });

  it('BLOCK_COLORS has enough colors', () => {
    expect(BLOCK_COLORS.length).toBeGreaterThanOrEqual(5);
  });
});
