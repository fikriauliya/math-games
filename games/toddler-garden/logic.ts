import { Effect } from 'effect';

export type PlantStage = 'seed' | 'sprout' | 'flower';

export interface Plant {
  id: number;
  stage: PlantStage;
  type: number;
  waterCount: number;
}

export const PLANT_TYPES = [
  { seed: '🟤', sprout: '🌱', flower: '🌻', name: 'Bunga Matahari' },
  { seed: '🟤', sprout: '🌱', flower: '🌹', name: 'Mawar' },
  { seed: '🟤', sprout: '🌱', flower: '🌷', name: 'Tulip' },
  { seed: '🟤', sprout: '🌱', flower: '🌺', name: 'Kembang Sepatu' },
  { seed: '🟤', sprout: '🌱', flower: '💐', name: 'Buket Bunga' },
  { seed: '🟤', sprout: '🌱', flower: '🌸', name: 'Sakura' },
];

export const WATER_TO_SPROUT = 2;
export const WATER_TO_FLOWER = 4;
export const GRID_SIZE = 6;

let nextPlantId = 0;

export function createPlant(): Plant {
  return {
    id: nextPlantId++,
    stage: 'seed',
    type: Math.floor(Math.random() * PLANT_TYPES.length),
    waterCount: 0,
  };
}

export const createPlantEffect = (): Effect.Effect<Plant> =>
  Effect.sync(() => createPlant());

export function waterPlant(plant: Plant): Plant {
  const wc = plant.waterCount + 1;
  let stage: PlantStage = 'seed';
  if (wc >= WATER_TO_FLOWER) stage = 'flower';
  else if (wc >= WATER_TO_SPROUT) stage = 'sprout';
  return { ...plant, waterCount: wc, stage };
}

export const waterPlantEffect = (plant: Plant): Effect.Effect<Plant> =>
  Effect.sync(() => waterPlant(plant));

export function getPlantEmoji(plant: Plant): string {
  const type = PLANT_TYPES[plant.type];
  return type[plant.stage];
}

export function isFullyGrown(plant: Plant): boolean {
  return plant.stage === 'flower';
}

export function resetId() { nextPlantId = 0; }
