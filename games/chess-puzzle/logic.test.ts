import { describe, it, expect } from 'bun:test';
import { PUZZLES, TOTAL, checkMove, shufflePuzzles, getResultText, PIECE_DISPLAY } from './logic';

describe('chess-puzzle logic', () => {
  it('has correct number of puzzles', () => {
    expect(PUZZLES.length).toBe(TOTAL);
    expect(TOTAL).toBeGreaterThanOrEqual(5);
  });

  it('each puzzle has 8x8 board', () => {
    for (const p of PUZZLES) {
      expect(p.board.length).toBe(8);
      for (const row of p.board) expect(row.length).toBe(8);
    }
  });

  it('checkMove returns true for correct move', () => {
    const p = PUZZLES[0];
    expect(checkMove(p.correctMove[0], p.correctMove[1], p)).toBe(true);
  });

  it('checkMove returns false for wrong move', () => {
    expect(checkMove(4, 4, PUZZLES[0])).toBe(false);
  });

  it('shufflePuzzles returns all puzzles', () => {
    const s = shufflePuzzles();
    expect(s.length).toBe(TOTAL);
    const ids = s.map(p => p.id).sort();
    expect(ids).toEqual(PUZZLES.map(p => p.id).sort());
  });

  it('PIECE_DISPLAY has all pieces', () => {
    expect(PIECE_DISPLAY['wK']).toBe('♔');
    expect(PIECE_DISPLAY['bK']).toBe('♚');
  });

  it('getResultText returns correct text', () => {
    expect(getResultText(TOTAL, TOTAL).title).toBe('Grandmaster!');
    expect(getResultText(1, TOTAL).title).toBe('Keep Practicing!');
  });
});
