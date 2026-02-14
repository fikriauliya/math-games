import { describe, it, expect } from 'bun:test';
import { generateQuestion, checkAnswer, getGrade } from './logic';

describe('unit-converter logic', () => {
  it('generates question with valid units', () => {
    const q = generateQuestion('easy');
    expect(q.fromUnit).toBeTruthy();
    expect(q.toUnit).toBeTruthy();
    expect(q.value).toBeGreaterThan(0);
  });

  it('has 4 choices with answer', () => {
    const q = generateQuestion('medium');
    expect(q.choices.length).toBe(4);
    expect(q.choices).toContain(q.answer);
  });

  it('choices sorted ascending', () => {
    const q = generateQuestion('hard');
    for (let i = 1; i < q.choices.length; i++) expect(q.choices[i]).toBeGreaterThanOrEqual(q.choices[i-1]);
  });

  it('checkAnswer works', () => {
    expect(checkAnswer(100, 100)).toBe(true);
    expect(checkAnswer(100, 200)).toBe(false);
  });

  it('getGrade returns correct grades', () => {
    expect(getGrade(10, 10).grade).toBe('S');
    expect(getGrade(3, 10).grade).toBe('D');
  });

  it('has category', () => {
    const q = generateQuestion('easy');
    expect(['Length', 'Weight', 'Time', 'Volume']).toContain(q.category);
  });
});
