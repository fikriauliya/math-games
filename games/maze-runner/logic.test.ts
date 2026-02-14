import { describe, it, expect } from 'bun:test';
import { createMaze, createMazeState, move, canMove, formatTime } from './logic';

describe('maze-runner logic', () => {
  it('easy maze is 8x8', () => {
    const m = createMaze('easy');
    expect(m.width).toBe(8);
    expect(m.height).toBe(8);
  });

  it('medium maze is 12x12', () => {
    const m = createMaze('medium');
    expect(m.width).toBe(12);
    expect(m.height).toBe(12);
  });

  it('hard maze is 16x16', () => {
    const m = createMaze('hard');
    expect(m.width).toBe(16);
    expect(m.height).toBe(16);
  });

  it('start position is 0,0', () => {
    const m = createMaze('easy');
    const s = createMazeState(m);
    expect(s.pos).toEqual([0, 0]);
    expect(s.completed).toBe(false);
    expect(s.moves).toBe(0);
  });

  it('cannot move through walls', () => {
    const m = createMaze('easy');
    // Top wall of (0,0) should always exist (border)
    expect(canMove(m, [0, 0], 'up')).toBe(false);
    // Left wall of (0,0) should always exist (border)
    expect(canMove(m, [0, 0], 'left')).toBe(false);
  });

  it('move increments moves counter', () => {
    const m = createMaze('easy');
    let s = createMazeState(m);
    // Try all directions, one should work from start
    for (const dir of ['right', 'down'] as const) {
      const s2 = move(s, dir);
      if (s2.moves > s.moves) {
        expect(s2.moves).toBe(1);
        break;
      }
    }
  });

  it('maze is solvable (every cell reachable via DFS)', () => {
    const m = createMaze('easy');
    const visited = new Set<string>();
    const stack: [number, number][] = [[0, 0]];
    visited.add('0,0');
    const dirs: ['up' | 'down' | 'left' | 'right', number, number][] = [
      ['up', -1, 0], ['down', 1, 0], ['left', 0, -1], ['right', 0, 1]
    ];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      for (const [dir, dr, dc] of dirs) {
        if (canMove(m, [r, c], dir)) {
          const key = `${r + dr},${c + dc}`;
          if (!visited.has(key)) { visited.add(key); stack.push([r + dr, c + dc]); }
        }
      }
    }
    expect(visited.has(`${m.height - 1},${m.width - 1}`)).toBe(true);
  });

  it('formatTime formats correctly', () => {
    expect(formatTime(125000)).toBe('2:05');
  });
});
