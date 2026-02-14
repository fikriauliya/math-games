import { describe, it, expect } from 'bun:test';
import { PETS, ACTIONS, createPet, applyAction, getPetMood, getMoodText } from './logic';

describe('toddler-pets logic', () => {
  it('PETS has 5 entries', () => {
    expect(PETS.length).toBe(5);
  });

  it('ACTIONS has 3 entries', () => {
    expect(ACTIONS.length).toBe(3);
  });

  it('createPet returns valid state', () => {
    const pet = createPet();
    expect(pet.hunger).toBe(50);
    expect(pet.clean).toBe(50);
    expect(pet.happy).toBe(50);
    expect(pet.emoji).toBeTruthy();
    expect(pet.name).toBeTruthy();
  });

  it('applyAction feed increases hunger', () => {
    const pet = createPet();
    const fed = applyAction(pet, 'feed');
    expect(fed.hunger).toBe(75);
    expect(fed.clean).toBe(50);
  });

  it('applyAction caps at 100', () => {
    let pet = createPet();
    pet.hunger = 90;
    const fed = applyAction(pet, 'feed');
    expect(fed.hunger).toBe(100);
  });

  it('getPetMood returns correct mood', () => {
    expect(getPetMood({ hunger: 90, clean: 90, happy: 90, emoji: '🐶', name: 'D' })).toBe('😄');
    expect(getPetMood({ hunger: 60, clean: 60, happy: 60, emoji: '🐶', name: 'D' })).toBe('😊');
    expect(getPetMood({ hunger: 20, clean: 20, happy: 20, emoji: '🐶', name: 'D' })).toBe('😢');
  });

  it('getMoodText returns string', () => {
    const text = getMoodText(createPet());
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });
});
