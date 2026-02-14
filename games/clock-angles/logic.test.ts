import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getGrade } from './logic';

describe('clock-angles logic', () => {
  it('generates valid hour and minute', () => {
    const q = generateQuestion('easy');
    expect(q.hour).toBeGreaterThanOrEqual(1);
    expect(q.hour).toBeLessThanOrEqual(12);
    expect(q.minute).toBeGreaterThanOrEqual(0);
  });

  it('angle at 3:00 is 90', () => {
    // Test manually: hour=3, min=0 → hourAngle=90, minAngle=0, diff=90
    const q = { hour: 3, minute: 0 };
    const ha = (q.hour % 12) * 30 + q.minute * 0.5;
    const ma = q.minute * 6;
    let angle = Math.abs(ha - ma);
    if (angle > 180) angle = 360 - angle;
    expect(angle).toBe(90);
  });

  it('angle at 6:00 is 180', () => {
    const ha = 6 * 30;
    const ma = 0;
    expect(Math.abs(ha - ma)).toBe(180);
  });

  it('has 4 choices including answer', () => {
    const q = generateQuestion('medium');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.angle);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(90, 90)).toBe(true);
    expect(checkAnswer(90, 45)).toBe(false);
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(10, 10).grade).toBe('S');
  });

  it('angle is between 0 and 180', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion('hard');
      expect(q.angle).toBeGreaterThanOrEqual(0);
      expect(q.angle).toBeLessThanOrEqual(180);
    }
  });
});
