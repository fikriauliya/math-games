import { describe, it, expect } from 'bun:test';
import { generateGrid, validateAnswer, calcScore, getGrade, getElapsedText, DIFFICULTY_CONFIG } from './logic';

describe('times-table logic', () => {
  it('generateGrid easy creates 5x5 = 25 cells', () => {
    const grid = generateGrid('easy');
    expect(grid.length).toBe(25);
  });

  it('generateGrid medium creates 8x8 = 64 cells', () => {
    const grid = generateGrid('medium');
    expect(grid.length).toBe(64);
  });

  it('generateGrid hard creates 12x12 = 144 cells', () => {
    const grid = generateGrid('hard');
    expect(grid.length).toBe(144);
  });

  it('each cell answer equals row * col', () => {
    const grid = generateGrid('easy');
    for (const cell of grid) {
      expect(cell.answer).toBe(cell.row * cell.col);
    }
  });

  it('about 40% of cells are blank', () => {
    const grid = generateGrid('medium');
    const blanks = grid.filter(c => c.isBlank).length;
    expect(blanks).toBeGreaterThan(15);
    expect(blanks).toBeLessThan(40);
  });

  it('validateAnswer returns true for correct', () => {
    expect(validateAnswer(12, 12)).toBe(true);
    expect(validateAnswer(11, 12)).toBe(false);
  });

  it('calcScore gives higher score for fewer mistakes', () => {
    const s1 = calcScore(20, 0, 60000);
    const s2 = calcScore(20, 5, 60000);
    expect(s1).toBeGreaterThan(s2);
  });

  it('getGrade returns S for perfect', () => {
    expect(getGrade(0, 20).grade).toBe('S');
  });

  it('getElapsedText formats correctly', () => {
    expect(getElapsedText(65000)).toBe('1m 5s');
    expect(getElapsedText(30000)).toBe('30s');
  });

  it('DIFFICULTY_CONFIG has correct sizes', () => {
    expect(DIFFICULTY_CONFIG.easy.size).toBe(5);
    expect(DIFFICULTY_CONFIG.medium.size).toBe(8);
    expect(DIFFICULTY_CONFIG.hard.size).toBe(12);
  });
});
