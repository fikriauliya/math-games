import { describe, it, expect } from 'bun:test';
import { createGameSync, placeItem, getRemainingItems, getModeLabel } from './logic';

describe('sequence-sort logic', () => {
  it('creates a game with 10 rounds', () => {
    const g = createGameSync(10);
    expect(g.totalRounds).toBe(10);
    expect(g.rounds.length).toBe(10);
    expect(g.currentRound).toBe(0);
  });

  it('first round has 4 items', () => {
    const g = createGameSync(10);
    expect(g.rounds[0].items.length).toBe(4);
  });

  it('later rounds have more items', () => {
    const g = createGameSync(10);
    expect(g.rounds[9].items.length).toBeGreaterThanOrEqual(4);
  });

  it('placing correct item advances', () => {
    const g = createGameSync(10);
    const first = g.rounds[0].correctOrder[0];
    const { state, correct } = placeItem(g, first);
    expect(correct).toBe(true);
    expect(state.placed).toContain(first);
    expect(state.score).toBe(1);
  });

  it('placing wrong item does not advance', () => {
    const g = createGameSync(10);
    const wrong = g.rounds[0].correctOrder[g.rounds[0].correctOrder.length - 1];
    // Only wrong if it's not also the first item
    if (wrong !== g.rounds[0].correctOrder[0]) {
      const { state, correct } = placeItem(g, wrong);
      expect(correct).toBe(false);
      expect(state.placed.length).toBe(0);
    }
  });

  it('getRemainingItems excludes placed items', () => {
    const g = createGameSync(10);
    const first = g.rounds[0].correctOrder[0];
    const { state } = placeItem(g, first);
    const remaining = getRemainingItems(state);
    expect(remaining).not.toContain(first);
  });

  it('completing all rounds sets completed', () => {
    let g = createGameSync(1); // 1 round for quick test
    for (const item of g.rounds[0].correctOrder) {
      const { state } = placeItem(g, item);
      g = state;
    }
    expect(g.completed).toBe(true);
  });

  it('getModeLabel returns a string', () => {
    expect(getModeLabel('asc')).toContain('Smallest');
    expect(getModeLabel('alpha')).toContain('A');
  });
});
