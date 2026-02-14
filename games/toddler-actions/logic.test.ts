import { describe, it, expect } from 'bun:test';
import { ACTIONS, TOTAL, shuffle, generateRound, checkAnswer, getResultText } from './logic';

describe('toddler-actions logic', () => {
  it('ACTIONS has 8 entries', () => {
    expect(ACTIONS.length).toBe(8);
  });

  it('each action has unique name', () => {
    const names = ACTIONS.map(a => a.name);
    expect(new Set(names).size).toBe(8);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3]);
  });

  it('generateRound returns 2 choices including target', () => {
    const round = generateRound(ACTIONS[0], ACTIONS);
    expect(round.choices.length).toBe(2);
    expect(round.choices.map(c => c.name)).toContain(ACTIONS[0].name);
  });

  it('wrong choice differs from target', () => {
    const round = generateRound(ACTIONS[0], ACTIONS);
    const other = round.choices.find(c => c.name !== ACTIONS[0].name)!;
    expect(other.name).not.toBe(ACTIONS[0].name);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('LARI', 'LARI')).toBe(true);
    expect(checkAnswer('TIDUR', 'LARI')).toBe(false);
  });

  it('getResultText tiers', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });
});
