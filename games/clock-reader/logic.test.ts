import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, formatTime, getResultText, TOTAL, DIFFICULTY_SCHEDULE } from './logic';

describe('clock-reader logic', () => {
  it('formatTime pads correctly', () => {
    expect(formatTime(1, 0)).toBe('01:00');
    expect(formatTime(12, 30)).toBe('12:30');
    expect(formatTime(3, 5)).toBe('03:05');
  });

  it('easy questions have minute=0', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion('easy');
      expect(q.minute).toBe(0);
    }
  });

  it('medium questions have 0/15/30/45 minutes', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('medium');
      expect([0, 15, 30, 45]).toContain(q.minute);
    }
  });

  it('hard questions have 5-min intervals', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('hard');
      expect(q.minute % 5).toBe(0);
    }
  });

  it('generates 4 options including correct', () => {
    const q = generateQuestion('medium');
    expect(q.options.length).toBe(4);
    expect(q.options).toContain(q.display);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer('03:00', '03:00')).toBe(true);
    expect(checkAnswer('03:00', '04:00')).toBe(false);
  });

  it('getResultText returns correct tiers', () => {
    expect(getResultText(10, 10).title).toBe('Sempurna!');
    expect(getResultText(7, 10).title).toBe('Bagus!');
    expect(getResultText(2, 10).title).toBe('Ayo Coba Lagi!');
  });

  it('DIFFICULTY_SCHEDULE has TOTAL entries', () => {
    expect(DIFFICULTY_SCHEDULE.length).toBe(TOTAL);
  });
});
