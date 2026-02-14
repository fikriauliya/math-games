import { describe, it, expect } from 'bun:test';
import { createGameSync, selectItem } from './logic';

describe('odd-one-out logic', () => {
  it('creates 12 rounds by default', () => {
    const g = createGameSync();
    expect(g.totalRounds).toBe(12);
    expect(g.rounds.length).toBe(12);
  });

  it('each round has 4 items', () => {
    const g = createGameSync();
    for (const r of g.rounds) expect(r.items.length).toBe(4);
  });

  it('oddIndex is within bounds', () => {
    const g = createGameSync();
    for (const r of g.rounds) {
      expect(r.oddIndex).toBeGreaterThanOrEqual(0);
      expect(r.oddIndex).toBeLessThan(4);
    }
  });

  it('selecting correct odd increments score', () => {
    const g = createGameSync();
    const oddIdx = g.rounds[0].oddIndex;
    const { state, correct } = selectItem(g, oddIdx);
    expect(correct).toBe(true);
    expect(state.score).toBe(1);
  });

  it('selecting wrong item does not increment score', () => {
    const g = createGameSync();
    const wrongIdx = (g.rounds[0].oddIndex + 1) % 4;
    const { state, correct } = selectItem(g, wrongIdx);
    expect(correct).toBe(false);
    expect(state.score).toBe(0);
  });

  it('advances to next round after selection', () => {
    const g = createGameSync();
    const { state } = selectItem(g, 0);
    expect(state.currentRound).toBe(1);
  });

  it('completes after all rounds', () => {
    let g = createGameSync(2);
    const { state: s1 } = selectItem(g, g.rounds[0].oddIndex);
    const { state: s2 } = selectItem(s1, s1.rounds[1].oddIndex);
    expect(s2.completed).toBe(true);
  });

  it('each round has a hint', () => {
    const g = createGameSync();
    for (const r of g.rounds) expect(r.hint.length).toBeGreaterThan(0);
  });
});
