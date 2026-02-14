import { describe, it, expect } from 'bun:test';
import { PUZZLES, checkSolution, createEmptyGrid, toggleCell, getPuzzlesForDifficulty } from './logic';

describe('nonogram logic', () => {
  it('has 10 puzzles', () => {
    expect(PUZZLES.length).toBe(10);
  });

  it('all puzzles are 5x5', () => {
    for (const p of PUZZLES) {
      expect(p.grid.length).toBe(5);
      p.grid.forEach(row => expect(row.length).toBe(5));
    }
  });

  it('row clues match grid', () => {
    const p = PUZZLES[0]; // Heart
    expect(p.rowClues[0]).toEqual([1, 1]);
    expect(p.rowClues[1]).toEqual([5]);
  });

  it('col clues match grid', () => {
    const p = PUZZLES[1]; // Cross
    expect(p.colClues[2]).toEqual([5]); // center column all filled
  });

  it('checkSolution detects correct solution', () => {
    const p = PUZZLES[0];
    expect(checkSolution(p.grid, p)).toBe(true);
  });

  it('checkSolution detects wrong solution', () => {
    const p = PUZZLES[0];
    const wrong = createEmptyGrid();
    expect(checkSolution(wrong, p)).toBe(false);
  });

  it('createEmptyGrid returns 5x5 false', () => {
    const g = createEmptyGrid();
    expect(g.length).toBe(5);
    g.forEach(row => row.forEach(cell => expect(cell).toBe(false)));
  });

  it('toggleCell toggles correctly', () => {
    const g = createEmptyGrid();
    const g2 = toggleCell(g, 2, 3);
    expect(g2[2][3]).toBe(true);
    expect(g[2][3]).toBe(false); // no mutation
    const g3 = toggleCell(g2, 2, 3);
    expect(g3[2][3]).toBe(false);
  });

  it('getPuzzlesForDifficulty returns puzzles', () => {
    expect(getPuzzlesForDifficulty(0).length).toBe(5);
  });
});
