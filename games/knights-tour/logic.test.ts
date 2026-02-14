import { describe, it, expect } from 'bun:test';
import { createGame, getValidMoves, makeMove, isKnightMove, BOARD_SIZE } from './logic';

describe('knights-tour logic', () => {
  it('creates game with knight at start', () => {
    const g = createGame(0, 0);
    expect(g.board[0][0]).toBe(1);
    expect(g.moveCount).toBe(1);
    expect(g.currentPos).toEqual([0, 0]);
  });

  it('getValidMoves returns L-shaped moves', () => {
    const g = createGame(2, 2);
    const moves = getValidMoves(g);
    expect(moves.length).toBeGreaterThan(0);
    moves.forEach(([r, c]) => {
      expect(isKnightMove(2, 2, r, c)).toBe(true);
    });
  });

  it('makeMove updates position', () => {
    const g = createGame(0, 0);
    const valid = getValidMoves(g);
    const [r, c] = valid[0];
    const next = makeMove(g, r, c)!;
    expect(next.currentPos).toEqual([r, c]);
    expect(next.moveCount).toBe(2);
    expect(next.board[r][c]).toBe(2);
  });

  it('makeMove returns null for invalid', () => {
    const g = createGame(0, 0);
    expect(makeMove(g, 0, 1)).toBeNull();
  });

  it('isKnightMove validates correctly', () => {
    expect(isKnightMove(0, 0, 2, 1)).toBe(true);
    expect(isKnightMove(0, 0, 1, 1)).toBe(false);
  });

  it('cannot revisit a square', () => {
    const g = createGame(0, 0);
    const valid = getValidMoves(g);
    const next = makeMove(g, valid[0][0], valid[0][1])!;
    // 0,0 should not be in valid moves anymore
    const moves2 = getValidMoves(next);
    expect(moves2.some(([r, c]) => r === 0 && c === 0)).toBe(false);
  });
});
