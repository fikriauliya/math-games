import { describe, it, expect } from 'bun:test';
import { createEmptyGrid, toggle, isSolved, PUZZLES, generateRandomPuzzle, countLightsOn } from './logic';

describe('lights-out logic', () => {
  it('createEmptyGrid returns 5x5 all false', () => {
    const g = createEmptyGrid();
    expect(g.length).toBe(5);
    g.forEach(r => { expect(r.length).toBe(5); r.forEach(v => expect(v).toBe(false)); });
  });

  it('toggle flips center and neighbors', () => {
    const g = toggle(createEmptyGrid(), 2, 2);
    expect(g[2][2]).toBe(true);
    expect(g[1][2]).toBe(true);
    expect(g[3][2]).toBe(true);
    expect(g[2][1]).toBe(true);
    expect(g[2][3]).toBe(true);
    expect(g[0][0]).toBe(false);
  });

  it('toggle at corner only affects valid neighbors', () => {
    const g = toggle(createEmptyGrid(), 0, 0);
    expect(g[0][0]).toBe(true);
    expect(g[0][1]).toBe(true);
    expect(g[1][0]).toBe(true);
    expect(countLightsOn(g)).toBe(3);
  });

  it('double toggle returns to original', () => {
    let g = toggle(createEmptyGrid(), 2, 2);
    g = toggle(g, 2, 2);
    expect(isSolved(g)).toBe(true);
  });

  it('isSolved detects solved grid', () => {
    expect(isSolved(createEmptyGrid())).toBe(true);
    expect(isSolved(toggle(createEmptyGrid(), 0, 0))).toBe(false);
  });

  it('PUZZLES has 5 puzzles', () => {
    expect(PUZZLES.length).toBe(5);
    PUZZLES.forEach(p => {
      expect(p.length).toBe(5);
      expect(isSolved(p)).toBe(false);
    });
  });

  it('generateRandomPuzzle returns unsolved grid', () => {
    const g = generateRandomPuzzle();
    expect(isSolved(g)).toBe(false);
    expect(g.length).toBe(5);
  });

  it('countLightsOn counts correctly', () => {
    expect(countLightsOn(createEmptyGrid())).toBe(0);
    expect(countLightsOn(toggle(createEmptyGrid(), 2, 2))).toBe(5);
  });
});
