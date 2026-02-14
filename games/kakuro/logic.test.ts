import { describe, it, expect } from 'bun:test';
import { getPuzzle, getPuzzleCount, setCell, checkComplete, countFilled, countTotal, isCellCorrect } from './logic';

describe('kakuro logic', () => {
  it('returns a puzzle with grid', () => {
    const p = getPuzzle(0);
    expect(p.size).toBeGreaterThan(0);
    expect(p.grid.length).toBe(p.size);
  });

  it('setCell updates value', () => {
    const p = getPuzzle(0);
    const p2 = setCell(p, 1, 1, 5);
    const cell = p2.grid[1][1];
    expect(cell.type).toBe('input');
    if (cell.type === 'input') expect(cell.value).toBe(5);
  });

  it('checkComplete false when empty', () => {
    expect(checkComplete(getPuzzle(0))).toBe(false);
  });

  it('checkComplete true when all correct', () => {
    let p = getPuzzle(0);
    // Fill with answers
    for (let r = 0; r < p.size; r++)
      for (let c = 0; c < p.size; c++)
        if (p.grid[r][c].type === 'input') p = setCell(p, r, c, (p.grid[r][c] as any).answer);
    expect(checkComplete(p)).toBe(true);
  });

  it('countFilled counts non-null inputs', () => {
    let p = getPuzzle(0);
    expect(countFilled(p)).toBe(0);
    p = setCell(p, 1, 1, 3);
    expect(countFilled(p)).toBe(1);
  });

  it('countTotal counts input cells', () => {
    const p = getPuzzle(0);
    expect(countTotal(p)).toBeGreaterThan(0);
  });

  it('isCellCorrect works', () => {
    let p = getPuzzle(0);
    p = setCell(p, 1, 1, (p.grid[1][1] as any).answer);
    expect(isCellCorrect(p.grid[1][1])).toBe(true);
  });
});
