import { describe, it, expect } from 'bun:test';
import { TRASH_ITEMS, generateRounds, checkBin, getEndResult } from './logic';

describe('toddler-recycle logic', () => {
  it('TRASH_ITEMS has 12 entries', () => {
    expect(TRASH_ITEMS.length).toBe(12);
  });

  it('has both organik and anorganik items', () => {
    expect(TRASH_ITEMS.filter(t => t.bin === 'organik').length).toBeGreaterThan(0);
    expect(TRASH_ITEMS.filter(t => t.bin === 'anorganik').length).toBeGreaterThan(0);
  });

  it('generateRounds returns requested count', () => {
    expect(generateRounds(5).length).toBe(5);
    expect(generateRounds(10).length).toBe(10);
  });

  it('checkBin works correctly', () => {
    const organik = TRASH_ITEMS.find(t => t.bin === 'organik')!;
    expect(checkBin(organik, 'organik')).toBe(true);
    expect(checkBin(organik, 'anorganik')).toBe(false);
  });

  it('getEndResult returns correct tiers', () => {
    expect(getEndResult(9, 10).title).toBe('🎉 Hebat Sekali!');
    expect(getEndResult(6, 10).title).toBe('⭐ Bagus!');
    expect(getEndResult(3, 10).title).toBe('💪 Coba Lagi!');
  });

  it('each item has emoji and name', () => {
    for (const item of TRASH_ITEMS) {
      expect(item.emoji).toBeTruthy();
      expect(item.name).toBeTruthy();
    }
  });
});
