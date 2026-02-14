import { describe, it, expect } from 'bun:test';
import { initState, canMove, moveDisc, isWon, getMinMoves, getNumDiscs, getResultText, DISC_COLORS } from './logic';

describe('tower-sort logic', () => {
  it('initState creates correct number of discs', () => {
    const state = initState('easy');
    expect(state.pegs[0].length).toBe(3);
    expect(state.pegs[1].length).toBe(0);
    expect(state.pegs[2].length).toBe(0);
  });

  it('discs are ordered largest to smallest', () => {
    const state = initState('easy');
    expect(state.pegs[0]).toEqual([3, 2, 1]);
  });

  it('canMove prevents larger on smaller', () => {
    const state = initState('easy');
    // Move 1 to peg 1
    const s2 = moveDisc(state, 0, 1)!;
    // Move 2 to peg 1 should fail
    expect(canMove(s2, 0, 1)).toBe(false);
  });

  it('canMove allows smaller on larger', () => {
    const state = initState('easy');
    const s2 = moveDisc(state, 0, 1)!;
    const s3 = moveDisc(s2, 0, 2)!;
    expect(canMove(s3, 1, 2)).toBe(true);
  });

  it('moveDisc returns null for invalid move', () => {
    const state = initState('easy');
    expect(moveDisc(state, 1, 2)).toBeNull();
  });

  it('isWon detects all discs on peg 2', () => {
    const state = { pegs: [[], [], [3, 2, 1]], moves: 7, numDiscs: 3, minMoves: 7 };
    expect(isWon(state)).toBe(true);
  });

  it('getMinMoves is 2^n - 1', () => {
    expect(getMinMoves(3)).toBe(7);
    expect(getMinMoves(4)).toBe(15);
    expect(getMinMoves(5)).toBe(31);
  });

  it('getResultText tiers', () => {
    expect(getResultText(7, 7).emoji).toBe('🏆');
    expect(getResultText(10, 7).emoji).toBe('⭐');
    expect(getResultText(20, 7).emoji).toBe('💪');
  });

  it('DISC_COLORS has 5 colors', () => {
    expect(DISC_COLORS.length).toBe(5);
  });
});
