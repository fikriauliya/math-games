import { describe, it, expect } from 'bun:test';
import { createBoard, fire, aiFire, isGameOver, countHits } from './logic';

describe('battleship logic', () => {
  it('creates 10x10 board', () => {
    const b = createBoard();
    expect(b.length).toBe(10);
    expect(b[0].length).toBe(10);
  });

  it('board has correct number of ship cells', () => {
    const b = createBoard();
    const ships = b.flat().filter(c => c === 'ship').length;
    expect(ships).toBe(5 + 4 + 3 + 3 + 2); // 17
  });

  it('fire hits a ship', () => {
    const b = createBoard();
    const shipCell = (() => { for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (b[r][c] === 'ship') return { r, c }; return { r: 0, c: 0 }; })();
    const result = fire(b, shipCell.r, shipCell.c);
    expect(result.result).toBe('hit');
    expect(b[shipCell.r][shipCell.c]).toBe('hit');
  });

  it('fire misses empty cell', () => {
    const b = createBoard();
    const emptyCell = (() => { for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) if (b[r][c] === 'empty') return { r, c }; return { r: 0, c: 0 }; })();
    const result = fire(b, emptyCell.r, emptyCell.c);
    expect(result.result).toBe('miss');
  });

  it('aiFire returns valid coords', () => {
    const b = createBoard();
    const { r, c } = aiFire(b);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThan(10);
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThan(10);
  });

  it('isGameOver false initially', () => {
    expect(isGameOver(createBoard())).toBe(false);
  });

  it('countHits starts at 0', () => {
    expect(countHits(createBoard())).toBe(0);
  });
});
