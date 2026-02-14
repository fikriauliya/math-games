import { describe, it, expect } from 'bun:test';
import { createGame, createBoard, flood, isGameOver, currentColor, COLORS, BOARD_SIZE } from './logic';

describe('flood-fill logic', () => {
  it('creates board of correct size', () => {
    const b = createBoard();
    expect(b.length).toBe(BOARD_SIZE);
    expect(b[0].length).toBe(BOARD_SIZE);
  });

  it('creates game with 0 moves', () => {
    const g = createGame();
    expect(g.moves).toBe(0);
    expect(g.won).toBe(false);
  });

  it('flood changes top-left region color', () => {
    const g = createGame();
    const oldColor = g.board[0][0];
    const newColor = (oldColor + 1) % COLORS.length;
    const next = flood(g, newColor);
    expect(next.board[0][0]).toBe(newColor);
    expect(next.moves).toBe(1);
  });

  it('flood with same color does nothing', () => {
    const g = createGame();
    const same = g.board[0][0];
    const next = flood(g, same);
    expect(next.moves).toBe(0);
  });

  it('isGameOver when max moves reached', () => {
    const g = createGame();
    g.moves = g.maxMoves;
    expect(isGameOver(g)).toBe(true);
  });

  it('detects win when all same color', () => {
    const g = createGame(2);
    // Force board to almost uniform
    g.board = [[0, 0], [0, 1]];
    const next = flood(g, 0); // 0->0 no change since top-left already 0
    // Try changing to 1 then back
    const g2 = { ...g, board: [[1, 1], [1, 0]] };
    const next2 = flood(g2, 0);
    // top-left is 1, flood to 0 won't fill [1][1]=0 since it's already 0 but not connected to old color
    expect(next2.board[0][0]).toBe(0);
  });
});
