import { describe, it, expect } from 'bun:test';
import { createGameState, makeMove, checkWinner, isDraw, getAIMove, getWinLine } from './logic';

describe('tic-tac-toe logic', () => {
  it('creates empty board', () => {
    const state = createGameState('1p');
    expect(state.board.length).toBe(9);
    expect(state.board.every(c => c === null)).toBe(true);
    expect(state.currentPlayer).toBe('X');
  });

  it('makes a move correctly', () => {
    const state = createGameState('2p');
    const next = makeMove(state, 4)!;
    expect(next.board[4]).toBe('X');
    expect(next.currentPlayer).toBe('O');
  });

  it('prevents move on occupied cell', () => {
    const state = createGameState('2p');
    const next = makeMove(state, 4)!;
    expect(makeMove(next, 4)).toBeNull();
  });

  it('detects winner', () => {
    expect(checkWinner(['X','X','X',null,null,null,null,null,null])).toBe('X');
    expect(checkWinner(['O',null,null,'O',null,null,'O',null,null])).toBe('O');
    expect(checkWinner([null,null,null,null,null,null,null,null,null])).toBeNull();
  });

  it('detects draw', () => {
    expect(isDraw(['X','O','X','X','O','O','O','X','X'])).toBe(true);
  });

  it('AI blocks winning move', () => {
    const board = ['X','X',null,null,'O',null,null,null,null];
    expect(getAIMove(board as any)).toBe(2);
  });

  it('getWinLine returns winning indices', () => {
    expect(getWinLine(['X','X','X',null,null,null,null,null,null])).toEqual([0,1,2]);
    expect(getWinLine([null,null,null,null,null,null,null,null,null])).toBeNull();
  });
});
