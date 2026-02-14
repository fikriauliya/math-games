import { describe, it, expect } from 'bun:test';
import { createGameState, dropDisc, checkWin, isColumnFull, COLS, ROWS } from './logic';

describe('connect-four logic', () => {
  it('creates empty board', () => {
    const state = createGameState();
    expect(state.board.length).toBe(ROWS);
    expect(state.board[0].length).toBe(COLS);
    expect(state.currentPlayer).toBe('red');
    expect(state.winner).toBeNull();
  });

  it('drops disc to bottom of column', () => {
    const state = createGameState();
    const next = dropDisc(state, 3)!;
    expect(next.board[ROWS - 1][3]).toBe('red');
    expect(next.currentPlayer).toBe('yellow');
  });

  it('stacks discs in same column', () => {
    let state = createGameState();
    state = dropDisc(state, 0)!;
    state = dropDisc(state, 0)!;
    expect(state.board[ROWS - 1][0]).toBe('red');
    expect(state.board[ROWS - 2][0]).toBe('yellow');
  });

  it('returns null for full column', () => {
    let state = createGameState();
    for (let i = 0; i < ROWS; i++) state = dropDisc(state, 0)!;
    expect(dropDisc(state, 0)).toBeNull();
  });

  it('detects horizontal win', () => {
    let state = createGameState();
    // Red: 0,1,2,3. Yellow: 0,1,2 (row above)
    state = dropDisc(state, 0)!; state = dropDisc(state, 0)!;
    state = dropDisc(state, 1)!; state = dropDisc(state, 1)!;
    state = dropDisc(state, 2)!; state = dropDisc(state, 2)!;
    state = dropDisc(state, 3)!;
    expect(state.winner).toBe('red');
  });

  it('detects vertical win', () => {
    let state = createGameState();
    // Red: col 0 x4, Yellow: col 1 x3
    state = dropDisc(state, 0)!; state = dropDisc(state, 1)!;
    state = dropDisc(state, 0)!; state = dropDisc(state, 1)!;
    state = dropDisc(state, 0)!; state = dropDisc(state, 1)!;
    state = dropDisc(state, 0)!;
    expect(state.winner).toBe('red');
  });

  it('isColumnFull detects full column', () => {
    let state = createGameState();
    expect(isColumnFull(state.board, 0)).toBe(false);
    for (let i = 0; i < ROWS; i++) state = dropDisc(state, 0)!;
    expect(isColumnFull(state.board, 0)).toBe(true);
  });
});
