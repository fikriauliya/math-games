import { describe, it, expect } from 'bun:test';
import { createBubble, updateBubble, isBubbleOffScreen, isTapOnBubble, COLORS, resetId } from './logic';

describe('toddler-bubbles logic', () => {
  it('createBubble returns valid bubble', () => {
    resetId();
    const b = createBubble(400, 800);
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x).toBeLessThanOrEqual(400);
    expect(b.y).toBe(830);
    expect(b.size).toBeGreaterThanOrEqual(40);
    expect(COLORS).toContain(b.color);
  });

  it('updateBubble moves bubble upward', () => {
    const b = createBubble(400, 800);
    const updated = updateBubble(b, 1);
    expect(updated.y).toBeLessThan(b.y);
  });

  it('isBubbleOffScreen detects off-screen', () => {
    const b = { id: 0, x: 100, y: -100, size: 40, color: '#ff0000', speed: 1, wobble: 0 };
    expect(isBubbleOffScreen(b)).toBe(true);
    const b2 = { ...b, y: 100 };
    expect(isBubbleOffScreen(b2)).toBe(false);
  });

  it('isTapOnBubble detects tap correctly', () => {
    const b = { id: 0, x: 100, y: 100, size: 50, color: '#ff0000', speed: 1, wobble: 0 };
    expect(isTapOnBubble(100, 100, b)).toBe(true);
    expect(isTapOnBubble(200, 200, b)).toBe(false);
  });

  it('COLORS has enough variety', () => {
    expect(COLORS.length).toBeGreaterThanOrEqual(6);
  });
});
