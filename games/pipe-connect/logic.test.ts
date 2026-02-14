import { describe, it, expect } from 'bun:test';
import { createPuzzle, rotatePipe, getConnections, checkFlow, GRID_SIZE } from './logic';

describe('pipe-connect logic', () => {
  it('creates puzzle with correct grid size', () => {
    const g = createPuzzle();
    expect(g.grid.length).toBe(GRID_SIZE);
    expect(g.grid[0].length).toBe(GRID_SIZE);
  });

  it('source is at middle-left', () => {
    const g = createPuzzle();
    const mid = Math.floor(GRID_SIZE / 2);
    expect(g.grid[mid][0].type).toBe('source');
  });

  it('drain is at middle-right', () => {
    const g = createPuzzle();
    const mid = Math.floor(GRID_SIZE / 2);
    expect(g.grid[mid][GRID_SIZE - 1].type).toBe('drain');
  });

  it('getConnections rotates correctly', () => {
    const base = getConnections('straight', 0); // [T,F,T,F]
    expect(base).toEqual([true, false, true, false]);
    const rot1 = getConnections('straight', 1); // [F,T,F,T]
    expect(rot1).toEqual([false, true, false, true]);
  });

  it('rotatePipe increments rotation', () => {
    const g = createPuzzle();
    const mid = Math.floor(GRID_SIZE / 2);
    // Rotate a non-source/drain cell
    const r = 0, c = 1;
    const oldRot = g.grid[r][c].rotation;
    const next = rotatePipe(g, r, c);
    expect(next.grid[r][c].rotation).toBe((oldRot + 1) % 4);
  });

  it('rotatePipe does not rotate source', () => {
    const g = createPuzzle();
    const mid = Math.floor(GRID_SIZE / 2);
    const next = rotatePipe(g, mid, 0);
    expect(next).toBe(g); // same reference = no change
  });
});
