import { Effect } from 'effect';

export type PetAction = 'feed' | 'wash' | 'play';

export interface PetState {
  hunger: number; // 0-100
  clean: number;
  happy: number;
  emoji: string;
  name: string;
}

export const PETS = [
  { emoji: '🐶', name: 'Dogi' },
  { emoji: '🐱', name: 'Mimi' },
  { emoji: '🐰', name: 'Bubu' },
  { emoji: '🐹', name: 'Hami' },
  { emoji: '🐻', name: 'Beri' },
];

export const ACTIONS: { action: PetAction; emoji: string; label: string }[] = [
  { action: 'feed', emoji: '🍎', label: 'Makan' },
  { action: 'wash', emoji: '🚿', label: 'Mandi' },
  { action: 'play', emoji: '⚽', label: 'Main' },
];

export const createPetEffect = (): Effect.Effect<PetState> =>
  Effect.sync(() => {
    const pet = PETS[Math.floor(Math.random() * PETS.length)];
    return { hunger: 50, clean: 50, happy: 50, emoji: pet.emoji, name: pet.name };
  });

export function createPet(): PetState {
  return Effect.runSync(createPetEffect());
}

export const applyActionEffect = (state: PetState, action: PetAction): Effect.Effect<PetState> =>
  Effect.succeed(applyAction(state, action));

export function applyAction(state: PetState, action: PetAction): PetState {
  const s = { ...state };
  switch (action) {
    case 'feed': s.hunger = Math.min(100, s.hunger + 25); break;
    case 'wash': s.clean = Math.min(100, s.clean + 25); break;
    case 'play': s.happy = Math.min(100, s.happy + 25); break;
  }
  return s;
}

export function getPetMood(state: PetState): string {
  const avg = (state.hunger + state.clean + state.happy) / 3;
  if (avg >= 80) return '😄';
  if (avg >= 50) return '😊';
  return '😢';
}

export function getMoodText(state: PetState): string {
  const avg = (state.hunger + state.clean + state.happy) / 3;
  if (avg >= 80) return 'Senang sekali!';
  if (avg >= 50) return 'Lumayan senang';
  return 'Butuh perhatian';
}
