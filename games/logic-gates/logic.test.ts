import { describe, it, expect } from 'bun:test';
import { generatePuzzle, checkAnswer, evalGateExport } from './logic';

describe('logic-gates logic', () => {
  it('generates a puzzle with description', () => {
    const p = generatePuzzle();
    expect(p.description).toContain('=');
    expect(typeof p.answer).toBe('boolean');
  });

  it('AND gate works', () => {
    expect(evalGateExport('AND', [true, true])).toBe(true);
    expect(evalGateExport('AND', [true, false])).toBe(false);
    expect(evalGateExport('AND', [false, false])).toBe(false);
  });

  it('OR gate works', () => {
    expect(evalGateExport('OR', [false, false])).toBe(false);
    expect(evalGateExport('OR', [true, false])).toBe(true);
  });

  it('NOT gate works', () => {
    expect(evalGateExport('NOT', [true])).toBe(false);
    expect(evalGateExport('NOT', [false])).toBe(true);
  });

  it('XOR gate works', () => {
    expect(evalGateExport('XOR', [true, true])).toBe(false);
    expect(evalGateExport('XOR', [true, false])).toBe(true);
  });

  it('checkAnswer validates correctly', () => {
    const p = generatePuzzle();
    expect(checkAnswer(p, p.answer)).toBe(true);
    expect(checkAnswer(p, !p.answer)).toBe(false);
  });
});
