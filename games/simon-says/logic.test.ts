import { describe, it, expect } from 'bun:test';
import { createGameState, addToSequence, checkInput, getResultText, COLORS } from './logic';

describe('simon-says logic', () => {
  it('creates empty game state', () => {
    const state = createGameState();
    expect(state.sequence).toEqual([]);
    expect(state.score).toBe(0);
    expect(state.gameOver).toBe(false);
  });

  it('addToSequence adds one color', () => {
    const seq = addToSequence([]);
    expect(seq.length).toBe(1);
    expect(COLORS).toContain(seq[0]);
  });

  it('addToSequence preserves existing sequence', () => {
    const seq = addToSequence(['red', 'blue']);
    expect(seq.length).toBe(3);
    expect(seq[0]).toBe('red');
    expect(seq[1]).toBe('blue');
  });

  it('checkInput validates correct input', () => {
    const state = { ...createGameState(), sequence: ['red', 'blue', 'green'] as any, playerIndex: 0 };
    expect(checkInput(state, 'red')).toEqual({ correct: true, roundComplete: false });
  });

  it('checkInput detects wrong input', () => {
    const state = { ...createGameState(), sequence: ['red'] as any, playerIndex: 0 };
    expect(checkInput(state, 'blue').correct).toBe(false);
  });

  it('checkInput detects round complete', () => {
    const state = { ...createGameState(), sequence: ['red'] as any, playerIndex: 0 };
    expect(checkInput(state, 'red')).toEqual({ correct: true, roundComplete: true });
  });

  it('getResultText returns correct messages', () => {
    expect(getResultText(10).title).toBe('Amazing Memory!');
    expect(getResultText(5).title).toBe('Good Job!');
    expect(getResultText(2).title).toBe('Keep Practicing!');
  });
});
