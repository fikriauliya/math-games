import { describe, it, expect } from 'bun:test';
import { createPuzzle, placeNumber, clearCell, getConflicts, checkComplete, formatTime } from './logic';

describe('sudoku-mini logic', () => {
  it('createPuzzle easy generates a 4x4 grid', () => {
    const s = createPuzzle('easy');
    expect(s.size).toBe(4);
    expect(s.board.length).toBe(4);
    expect(s.board[0].length).toBe(4);
  });

  it('createPuzzle medium generates 6x6', () => {
    const s = createPuzzle('medium');
    expect(s.size).toBe(6);
  });

  it('createPuzzle hard generates 9x9', () => {
    const s = createPuzzle('hard');
    expect(s.size).toBe(9);
  });

  it('solution has no conflicts', () => {
    const s = createPuzzle('easy');
    const conflicts = getConflicts(s.solution, s.size, s.boxW, s.boxH);
    expect(conflicts.size).toBe(0);
  });

  it('placeNumber updates the board', () => {
    const s = createPuzzle('easy');
    // Find an empty cell
    let r = -1, c = -1;
    for (let i = 0; i < s.size && r === -1; i++)
      for (let j = 0; j < s.size && r === -1; j++)
        if (!s.fixed[i][j]) { r = i; c = j; }
    if (r >= 0) {
      const s2 = placeNumber(s, r, c, 1);
      expect(s2.board[r][c]).toBe(1);
    }
  });

  it('clearCell resets a non-fixed cell', () => {
    const s = createPuzzle('easy');
    let r = -1, c = -1;
    for (let i = 0; i < s.size && r === -1; i++)
      for (let j = 0; j < s.size && r === -1; j++)
        if (!s.fixed[i][j]) { r = i; c = j; }
    if (r >= 0) {
      const s2 = placeNumber(s, r, c, 2);
      const s3 = clearCell(s2, r, c);
      expect(s3.board[r][c]).toBe(0);
    }
  });

  it('cannot modify fixed cells', () => {
    const s = createPuzzle('easy');
    let r = -1, c = -1;
    for (let i = 0; i < s.size && r === -1; i++)
      for (let j = 0; j < s.size && r === -1; j++)
        if (s.fixed[i][j]) { r = i; c = j; }
    if (r >= 0) {
      const val = s.board[r][c];
      const s2 = placeNumber(s, r, c, val === 1 ? 2 : 1);
      expect(s2.board[r][c]).toBe(val);
    }
  });

  it('checkComplete returns true when board matches solution', () => {
    const s = createPuzzle('easy');
    expect(checkComplete(s.solution, s.solution)).toBe(true);
  });

  it('formatTime formats correctly', () => {
    expect(formatTime(65000)).toBe('1:05');
    expect(formatTime(3600000)).toBe('60:00');
  });
});
