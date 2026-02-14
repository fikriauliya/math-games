import { Effect } from 'effect';

export interface EstimationRound {
  actual: number;
  dotPositions: { x: number; y: number; color: string }[];
}

const randomInt = (min: number, max: number) => Effect.sync(() => min + Math.floor(Math.random() * (max - min + 1)));

const COLORS = ['#f44336','#2196F3','#4CAF50','#FF9800','#9C27B0','#00BCD4','#E91E63','#8BC34A'];

export const generateRoundEffect = (roundNum: number): Effect.Effect<EstimationRound> =>
  Effect.gen(function* () {
    const minQ = 10 + roundNum * 10;
    const maxQ = Math.min(20 + roundNum * 15, 100);
    const actual = yield* randomInt(minQ, maxQ);
    const dots: EstimationRound['dotPositions'] = [];
    for (let i = 0; i < actual; i++) {
      dots.push({
        x: yield* randomInt(5, 90),
        y: yield* randomInt(5, 90),
        color: COLORS[yield* Effect.sync(() => Math.floor(Math.random() * COLORS.length))],
      });
    }
    return { actual, dotPositions: dots };
  });

export function scoreEstimation(guess: number, actual: number): number {
  if (guess === actual) return 10;
  const ratio = Math.abs(guess - actual) / actual;
  if (ratio <= 0.1) return 7;
  if (ratio <= 0.25) return 4;
  if (ratio <= 0.5) return 2;
  return 0;
}

export function scoreLabel(points: number): string {
  if (points === 10) return 'Perfect! 🎯';
  if (points === 7) return 'Very close! 👏';
  if (points === 4) return 'Good guess! 👍';
  if (points === 2) return 'Not bad! 🤔';
  return 'Way off! 😅';
}

export const TOTAL = 8;

export function generateRound(roundNum: number): EstimationRound {
  return Effect.runSync(generateRoundEffect(roundNum));
}

export function getResultText(score: number, maxScore: number): { emoji: string; title: string; sub: string } {
  const ratio = score / maxScore;
  return {
    emoji: ratio >= 0.9 ? '🏆' : ratio >= 0.6 ? '🔬' : '💪',
    title: ratio >= 0.9 ? 'Expert Estimator!' : ratio >= 0.6 ? 'Good Eye!' : 'Keep Estimating!',
    sub: `${score} / ${maxScore} points`,
  };
}
