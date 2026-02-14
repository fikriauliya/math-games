import { describe, it, expect } from 'bun:test';
import { createGame, addToPath, isOptimal, bfs, GRID_SIZE } from './logic';

describe('path-finder logic', () => {
  it('creates game with valid grid', () => {
    const g = createGame();
    expect(g.grid.cells.length).toBe(GRID_SIZE);
    expect(g.grid.cells[0][0]).toBe('start');
    expect(g.grid.cells[GRID_SIZE - 1][GRID_SIZE - 1]).toBe('end');
  });

  it('shortest path exists', () => {
    const g = createGame();
    expect(g.shortestLength).toBeGreaterThan(0);
  });

  it('addToPath for adjacent cell works', () => {
    const g = createGame();
    // Try moving right or down from start
    const right = addToPath(g, 0, 1);
    const down = addToPath(g, 1, 0);
    // At least one should work (unless both are walls, unlikely)
    expect(right !== null || down !== null).toBe(true);
  });

  it('addToPath rejects non-adjacent', () => {
    const g = createGame();
    expect(addToPath(g, 2, 2)).toBeNull();
  });

  it('addToPath rejects wall', () => {
    const g = createGame();
    // Force a wall
    g.grid.cells[0][1] = 'wall';
    expect(addToPath(g, 0, 1)).toBeNull();
  });

  it('bfs returns -1 for unreachable', () => {
    const cells = [['start', 'wall'], ['wall', 'end']] as any;
    expect(bfs(cells, [0, 0], [1, 1])).toBe(-1);
  });
});
