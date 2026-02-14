import { describe, it, expect } from 'bun:test';
import { generatePuzzle, checkWord, calcScore } from './logic';

describe('math-wordsearch logic', () => {
  it('generates grid of correct size', () => {
    const p = generatePuzzle('easy');
    expect(p.size).toBe(8);
    expect(p.grid.length).toBe(8);
    expect(p.grid[0].length).toBe(8);
  });

  it('medium has 10x10 grid', () => {
    const p = generatePuzzle('medium');
    expect(p.size).toBe(10);
  });

  it('all cells are filled', () => {
    const p = generatePuzzle('easy');
    for (const row of p.grid) for (const cell of row) expect(cell.length).toBe(1);
  });

  it('words are placed in grid', () => {
    const p = generatePuzzle('medium');
    for (const pl of p.placements) {
      let word = '';
      for (let i = 0; i < pl.word.length; i++) {
        word += p.grid[pl.row + pl.dr * i][pl.col + pl.dc * i];
      }
      expect(word).toBe(pl.word);
    }
  });

  it('checkWord finds words', () => {
    const p = generatePuzzle('easy');
    expect(checkWord(p.words[0], p.words)).toBe(true);
    expect(checkWord('ZZZZZ', p.words)).toBe(false);
  });

  it('calcScore rewards time', () => {
    expect(calcScore(4, 4, 30)).toBeGreaterThan(calcScore(4, 4, 0));
  });
});
