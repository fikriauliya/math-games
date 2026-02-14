import { describe, it, expect } from 'bun:test';
import { createEmptyBoard, placeMines, reveal, toggleFlag, checkWin, checkLoss, countFlags, DIFFICULTIES } from './logic';

describe('minesweeper logic', () => {
  it('createEmptyBoard creates correct size', () => {
    const b = createEmptyBoard(6, 6);
    expect(b.length).toBe(6);
    expect(b[0].length).toBe(6);
    expect(b[0][0].mine).toBe(false);
  });

  it('placeMines places correct number of mines', () => {
    const b = placeMines(6, 6, 6, 0, 0);
    const mineCount = b.flat().filter(c => c.mine).length;
    expect(mineCount).toBe(6);
    expect(b[0][0].mine).toBe(false); // safe cell
  });

  it('reveal reveals cell and floods empty', () => {
    const b = createEmptyBoard(3, 3);
    const revealed = reveal(b, 0, 0);
    expect(revealed[0][0].revealed).toBe(true);
  });

  it('toggleFlag toggles flagged state', () => {
    const b = createEmptyBoard(3, 3);
    const flagged = toggleFlag(b, 0, 0);
    expect(flagged[0][0].flagged).toBe(true);
    const unflagged = toggleFlag(flagged, 0, 0);
    expect(unflagged[0][0].flagged).toBe(false);
  });

  it('checkWin detects win', () => {
    const b = createEmptyBoard(2, 2);
    b[0][0].mine = true;
    b[0][1].revealed = true;
    b[1][0].revealed = true;
    b[1][1].revealed = true;
    expect(checkWin(b)).toBe(true);
  });

  it('checkLoss detects loss', () => {
    const b = createEmptyBoard(2, 2);
    b[0][0].mine = true;
    b[0][0].revealed = true;
    expect(checkLoss(b)).toBe(true);
  });

  it('countFlags counts flagged cells', () => {
    const b = createEmptyBoard(3, 3);
    b[0][0].flagged = true;
    b[1][1].flagged = true;
    expect(countFlags(b)).toBe(2);
  });

  it('DIFFICULTIES has 3 levels', () => {
    expect(Object.keys(DIFFICULTIES).length).toBe(3);
    expect(DIFFICULTIES.easy.mines).toBe(6);
  });
});
