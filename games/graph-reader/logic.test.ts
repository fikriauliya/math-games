import { describe, it, expect } from 'bun:test';
import { genQuestion, getGrade, sumBars, maxBar, minBar } from './logic';

describe('graph-reader logic', () => {
  it('sumBars', () => { expect(sumBars([{ label: 'a', value: 3 }, { label: 'b', value: 7 }])).toBe(10); });
  it('maxBar', () => { expect(maxBar([{ label: 'a', value: 3 }, { label: 'b', value: 7 }]).value).toBe(7); });
  it('minBar', () => { expect(minBar([{ label: 'a', value: 3 }, { label: 'b', value: 7 }]).value).toBe(3); });
  it('genQuestion has 4 choices', () => { expect(genQuestion().choices.length).toBe(4); });
  it('genQuestion answer in choices', () => {
    const q = genQuestion();
    expect(q.choices).toContain(q.answer);
  });
  it('genQuestion has 4-7 bars', () => {
    for (let i = 0; i < 10; i++) {
      const q = genQuestion();
      expect(q.bars.length).toBeGreaterThanOrEqual(4);
      expect(q.bars.length).toBeLessThanOrEqual(7);
    }
  });
  it('getGrade works', () => { expect(getGrade(10, 10).grade).toBe('S'); });
});
