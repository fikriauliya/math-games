import { Effect } from 'effect';

export interface FarmAnimal {
  emoji: string;
  name: string;
  sound: string;
  fact: string;
}

export const ANIMALS: FarmAnimal[] = [
  { emoji: '🐄', name: 'Sapi', sound: 'Mooo!', fact: 'Sapi memberi kita susu' },
  { emoji: '🐔', name: 'Ayam', sound: 'Kukuruyuk!', fact: 'Ayam bertelur setiap hari' },
  { emoji: '🐷', name: 'Babi', sound: 'Oink oink!', fact: 'Babi suka bermain lumpur' },
  { emoji: '🐑', name: 'Domba', sound: 'Mbee!', fact: 'Bulu domba jadi wol' },
  { emoji: '🐴', name: 'Kuda', sound: 'Hiiii!', fact: 'Kuda bisa berlari cepat' },
  { emoji: '🦆', name: 'Bebek', sound: 'Kwek kwek!', fact: 'Bebek suka berenang' },
  { emoji: '🐶', name: 'Anjing', sound: 'Guk guk!', fact: 'Anjing menjaga peternakan' },
  { emoji: '🐱', name: 'Kucing', sound: 'Meong!', fact: 'Kucing menangkap tikus' },
  { emoji: '🐐', name: 'Kambing', sound: 'Mbee!', fact: 'Kambing makan rumput' },
  { emoji: '🐇', name: 'Kelinci', sound: 'Sniff sniff!', fact: 'Kelinci suka wortel' },
  { emoji: '🦃', name: 'Kalkun', sound: 'Gobble!', fact: 'Kalkun punya bulu indah' },
  { emoji: '🐸', name: 'Katak', sound: 'Koak koak!', fact: 'Katak tinggal di kolam' },
];

export function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.sync(() => shuffle(a));

export function getAnimalById(index: number): FarmAnimal {
  return ANIMALS[index % ANIMALS.length];
}

export const getAnimalByIdEffect = (index: number): Effect.Effect<FarmAnimal> =>
  Effect.sync(() => getAnimalById(index));
