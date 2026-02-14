import { describe, it, expect } from 'bun:test';
import { createPuzzleSync, createGrid, toggleMark, checkSolution, formatTime } from './logic';

describe('logic-grid logic', () => {
  it('creates easy puzzle with size 2', () => {
    const p = createPuzzleSync('easy');
    expect(p.size).toBe(2);
    expect(p.categories[0].length).toBe(2);
    expect(p.categories[1].length).toBe(2);
  });

  it('creates medium puzzle with size 3', () => {
    const p = createPuzzleSync('medium');
    expect(p.size).toBe(3);
  });

  it('creates hard puzzle with size 4', () => {
    const p = createPuzzleSync('hard');
    expect(p.size).toBe(4);
  });

  it('solution is a valid permutation', () => {
    const p = createPuzzleSync('medium');
    const sorted = [...p.solution].sort();
    expect(sorted).toEqual([0, 1, 2]);
  });

  it('createGrid initializes marks to 0', () => {
    const p = createPuzzleSync('easy');
    const g = createGrid(p);
    for (const row of g.marks)
      for (const v of row) expect(v).toBe(0);
  });

  it('toggleMark cycles through 0 -> -1 -> 1 -> 0', () => {
    const p = createPuzzleSync('easy');
    let g = createGrid(p);
    expect(g.marks[0][0]).toBe(0);
    g = toggleMark(g, 0, 0);
    expect(g.marks[0][0]).toBe(-1);
    g = toggleMark(g, 0, 0);
    expect(g.marks[0][0]).toBe(1);
    g = toggleMark(g, 0, 0);
    expect(g.marks[0][0]).toBe(0);
  });

  it('checkSolution returns true when correct', () => {
    const p = createPuzzleSync('easy');
    const marks = Array.from({ length: p.size }, (_, i) =>
      Array.from({ length: p.size }, (_, j) => p.solution[i] === j ? 1 : -1)
    );
    expect(checkSolution(marks, p.solution)).toBe(true);
  });

  it('formatTime works', () => {
    expect(formatTime(90000)).toBe('1:30');
  });

  it('puzzle has clues', () => {
    const p = createPuzzleSync('medium');
    expect(p.clues.length).toBeGreaterThan(0);
  });
});
