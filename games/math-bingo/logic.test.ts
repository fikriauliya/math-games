import { describe, it, expect } from 'bun:test';
import { generateCard, generateQuestion, checkBingo, getAllCardNumbers, shuffle } from './logic';

describe('math-bingo logic', () => {
  it('generates a 5x5 card with FREE center', () => {
    const card = generateCard('easy');
    expect(card.cells.length).toBe(5);
    expect(card.cells[0].length).toBe(5);
    expect(card.cells[2][2]).toBeNull();
  });

  it('card has 24 unique numbers', () => {
    const card = generateCard('easy');
    const nums = getAllCardNumbers(card);
    expect(nums.length).toBe(24);
    expect(new Set(nums).size).toBe(24);
  });

  it('generateQuestion produces correct answer', () => {
    const q = generateQuestion(15, 'easy');
    expect(q.answer).toBe(15);
    expect(q.text).toContain('+');
  });

  it('generateQuestion hard mode works', () => {
    const q = generateQuestion(12, 'hard');
    expect(q.answer).toBe(12);
  });

  it('checkBingo detects row win', () => {
    const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
    for (let c = 0; c < 5; c++) marked[0][c] = true;
    expect(checkBingo(marked)).toBe(true);
  });

  it('checkBingo detects column win', () => {
    const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
    for (let r = 0; r < 5; r++) marked[r][2] = true;
    expect(checkBingo(marked)).toBe(true);
  });

  it('checkBingo detects diagonal win', () => {
    const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
    for (let i = 0; i < 5; i++) marked[i][i] = true;
    expect(checkBingo(marked)).toBe(true);
  });

  it('checkBingo returns false when no win', () => {
    const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
    marked[0][0] = true;
    marked[1][1] = true;
    expect(checkBingo(marked)).toBe(false);
  });

  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
