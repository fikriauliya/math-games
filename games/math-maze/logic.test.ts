import { describe, it, expect } from 'bun:test';
import { generateMaze, checkAnswer, canMove, getResultText } from './logic';

describe('math-maze logic', () => {
  it('generateMaze creates a valid maze', () => {
    const maze = generateMaze('easy');
    expect(maze.width).toBe(4);
    expect(maze.height).toBe(4);
    expect(maze.playerX).toBe(0);
    expect(maze.playerY).toBe(0);
    expect(maze.exitX).toBe(3);
    expect(maze.exitY).toBe(3);
  });

  it('medium maze is 5x5', () => {
    const maze = generateMaze('medium');
    expect(maze.width).toBe(5);
  });

  it('hard maze is 6x6', () => {
    const maze = generateMaze('hard');
    expect(maze.width).toBe(6);
  });

  it('maze has questions on path cells', () => {
    const maze = generateMaze('easy');
    let qCount = 0;
    for (const row of maze.grid) {
      for (const cell of row) {
        if (cell.question) qCount++;
      }
    }
    expect(qCount).toBeGreaterThan(0);
  });

  it('checkAnswer validates correctly', () => {
    expect(checkAnswer(10, 10)).toBe(true);
    expect(checkAnswer(9, 10)).toBe(false);
  });

  it('canMove respects walls', () => {
    const maze = generateMaze('easy');
    // At least one direction should be movable from start
    const moves = [canMove(maze, 1, 0), canMove(maze, 0, 1), canMove(maze, -1, 0), canMove(maze, 0, -1)];
    expect(moves.some(m => m)).toBe(true);
  });

  it('getResultText returns correct grades', () => {
    expect(getResultText(3, 3).title).toBe('Dungeon Master!');
    expect(getResultText(1, 3).title).toBe('Keep Adventuring!');
  });
});
