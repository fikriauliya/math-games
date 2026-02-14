import { describe, it, expect } from 'bun:test';
import { createGrid, move, canMove, hasWon, addRandomTile, TILE_COLORS } from './logic';

describe('twenty-fortyeight logic', () => {
  it('createGrid returns 4x4 of zeros', () => {
    const g = createGrid();
    expect(g.length).toBe(4);
    g.forEach(r => { expect(r.length).toBe(4); r.forEach(v => expect(v).toBe(0)); });
  });

  it('move left slides tiles', () => {
    const grid = [[2, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid: g, score, moved } = move(grid, 'left');
    expect(g[0][0]).toBe(4);
    expect(g[0][1]).toBe(0);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('move right slides tiles', () => {
    const grid = [[2, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid: g } = move(grid, 'right');
    expect(g[0][3]).toBe(4);
  });

  it('move up slides tiles', () => {
    const grid = [[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid: g } = move(grid, 'up');
    expect(g[0][0]).toBe(4);
    expect(g[1][0]).toBe(0);
  });

  it('move down slides tiles', () => {
    const grid = [[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid: g } = move(grid, 'down');
    expect(g[3][0]).toBe(4);
  });

  it('canMove returns true for empty grid', () => {
    expect(canMove(createGrid())).toBe(true);
  });

  it('canMove returns false for full grid with no merges', () => {
    const grid = [[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]];
    expect(canMove(grid)).toBe(false);
  });

  it('hasWon detects 2048', () => {
    const grid = [[2048, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    expect(hasWon(grid)).toBe(true);
    expect(hasWon(createGrid())).toBe(false);
  });

  it('addRandomTile adds a tile', () => {
    const g = createGrid();
    const g2 = addRandomTile(g);
    const count = g2.flat().filter(v => v > 0).length;
    expect(count).toBe(1);
  });

  it('TILE_COLORS has entries for common tiles', () => {
    expect(TILE_COLORS[2]).toBeDefined();
    expect(TILE_COLORS[2048]).toBeDefined();
  });
});
