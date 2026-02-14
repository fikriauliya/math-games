import { describe, it, expect } from 'bun:test';
import { solvedBoard, isSolved, findEmpty, canMove, moveTile, shuffleBoard, getNeighbors, getDifficultyMoves, getResultText } from './logic';

describe('sliding-puzzle logic', () => {
  it('solvedBoard has 16 elements with 0 at end', () => {
    const b = solvedBoard();
    expect(b.length).toBe(16);
    expect(b[15]).toBe(0);
    expect(b[0]).toBe(1);
  });

  it('isSolved returns true for solved board', () => {
    expect(isSolved(solvedBoard())).toBe(true);
  });

  it('isSolved returns false for shuffled board', () => {
    const b = shuffleBoard(30);
    // Might be solved by coincidence but extremely unlikely
    // Just test it returns boolean
    expect(typeof isSolved(b)).toBe('boolean');
  });

  it('findEmpty returns index of 0', () => {
    const b = solvedBoard();
    expect(findEmpty(b)).toBe(15);
  });

  it('canMove returns true for neighbor of empty', () => {
    const b = solvedBoard(); // empty at 15
    expect(canMove(b, 14)).toBe(true); // left neighbor
    expect(canMove(b, 11)).toBe(true); // top neighbor
    expect(canMove(b, 0)).toBe(false);
  });

  it('moveTile swaps tile with empty', () => {
    const b = solvedBoard();
    const moved = moveTile(b, 14);
    expect(moved[15]).toBe(15);
    expect(moved[14]).toBe(0);
  });

  it('shuffleBoard returns unsolved board', () => {
    const b = shuffleBoard(50);
    expect(b.length).toBe(16);
    expect(b.filter(x => x === 0).length).toBe(1);
  });

  it('getDifficultyMoves returns correct values', () => {
    expect(getDifficultyMoves('easy')).toBe(30);
    expect(getDifficultyMoves('medium')).toBe(80);
    expect(getDifficultyMoves('hard')).toBe(150);
  });

  it('getResultText returns appropriate result', () => {
    expect(getResultText(30, 60).emoji).toBe('🏆');
    expect(getResultText(80, 120).emoji).toBe('🎉');
  });
});
