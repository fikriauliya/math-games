import { describe, it, expect } from 'bun:test';
import { createBoard, checkMatch, isComplete, getResultText, shuffle, THEMES } from './logic';

describe('memory-cards logic', () => {
  it('createBoard returns 16 cards', () => {
    const cards = createBoard('animals');
    expect(cards.length).toBe(16);
  });

  it('createBoard has pairs of each emoji', () => {
    const cards = createBoard('food');
    const counts: Record<string, number> = {};
    cards.forEach(c => counts[c.emoji] = (counts[c.emoji] || 0) + 1);
    Object.values(counts).forEach(v => expect(v).toBe(2));
  });

  it('checkMatch returns true for matching emojis', () => {
    expect(checkMatch({ id: 0, emoji: '🐶', matched: false, flipped: false }, { id: 1, emoji: '🐶', matched: false, flipped: false })).toBe(true);
  });

  it('checkMatch returns false for same card', () => {
    expect(checkMatch({ id: 0, emoji: '🐶', matched: false, flipped: false }, { id: 0, emoji: '🐶', matched: false, flipped: false })).toBe(false);
  });

  it('isComplete detects all matched', () => {
    const cards = createBoard('animals').map(c => ({ ...c, matched: true }));
    expect(isComplete(cards)).toBe(true);
  });

  it('THEMES has 3 themes', () => {
    expect(Object.keys(THEMES).length).toBe(3);
  });

  it('getResultText returns appropriate result', () => {
    expect(getResultText(18, 30).emoji).toBe('🏆');
    expect(getResultText(40, 60).emoji).toBe('💪');
  });
});
