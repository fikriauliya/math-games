import { Effect } from 'effect';

export interface TrainCar {
  number: number;
  color: string;
}

export const CAR_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];

export const createTrainEffect = (): Effect.Effect<TrainCar[]> =>
  Effect.sync(() => {
    const cars: TrainCar[] = [];
    for (let i = 1; i <= 5; i++) {
      cars.push({ number: i, color: CAR_COLORS[i - 1] });
    }
    return cars.sort(() => Math.random() - 0.5);
  });

export function createTrain(): TrainCar[] {
  return Effect.runSync(createTrainEffect());
}

export function swapCars(cars: TrainCar[], a: number, b: number): TrainCar[] {
  const result = [...cars];
  [result[a], result[b]] = [result[b], result[a]];
  return result;
}

export function isCorrectOrder(cars: TrainCar[]): boolean {
  return cars.every((c, i) => c.number === i + 1);
}

export function getEndResult(moves: number): { title: string; stars: string } {
  if (moves <= 6) return { title: '🎉 Hebat Sekali!', stars: '⭐⭐⭐' };
  if (moves <= 12) return { title: '⭐ Bagus!', stars: '⭐⭐' };
  return { title: '💪 Selesai!', stars: '⭐' };
}
