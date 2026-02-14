import { describe, it, expect } from 'bun:test';
import { WEATHERS, TOTAL, generateQuestion, checkAnswer, getResultText, shuffle } from './logic';

describe('toddler-weather logic', () => {
  it('has 8 weather types', () => {
    expect(WEATHERS.length).toBe(8);
  });

  it('TOTAL is 8', () => {
    expect(TOTAL).toBe(8);
  });

  it('generateQuestion returns 2 options', () => {
    const q = generateQuestion([], WEATHERS);
    expect(q.options.length).toBe(2);
    expect(q.options.map(o => o.name)).toContain(q.target.name);
  });

  it('options contain different weathers', () => {
    const q = generateQuestion([], WEATHERS);
    expect(q.options[0].name).not.toBe(q.options[1].name);
  });

  it('checkAnswer validates correctly', () => {
    expect(checkAnswer('Hujan', 'Hujan')).toBe(true);
    expect(checkAnswer('Cerah', 'Hujan')).toBe(false);
  });

  it('getResultText returns Bahasa messages', () => {
    expect(getResultText(8, 8).title).toBe('Hebat Sekali!');
    expect(getResultText(5, 8).title).toBe('Bagus!');
    expect(getResultText(2, 8).title).toBe('Ayo Coba Lagi!');
  });

  it('shuffle randomizes array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffle(arr);
    expect(shuffled.length).toBe(arr.length);
    expect(shuffled.sort((a, b) => a - b)).toEqual(arr);
  });
});
