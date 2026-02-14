import { Effect } from 'effect';

export type SortMode = 'asc' | 'desc' | 'alpha' | 'size';

export interface Round {
  items: string[];
  correctOrder: string[];
  mode: SortMode;
}

export interface GameState {
  rounds: Round[];
  currentRound: number;
  placed: string[];
  score: number;
  totalRounds: number;
  completed: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SIZES = ['🐜', '🐁', '🐇', '🐕', '🐎', '🐘', '🐋', '🦕'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const generateRounds = (totalRounds: number = 10): Effect.Effect<Round[]> =>
  Effect.sync(() => {
    const modes: SortMode[] = ['asc', 'desc', 'alpha', 'size'];
    const rounds: Round[] = [];

    for (let i = 0; i < totalRounds; i++) {
      const count = Math.min(4 + Math.floor(i / 2), 8);
      const mode = modes[Math.floor(Math.random() * modes.length)];
      let correctOrder: string[];

      if (mode === 'alpha') {
        correctOrder = shuffle(LETTERS).slice(0, count).sort();
      } else if (mode === 'size') {
        correctOrder = SIZES.slice(0, count);
      } else {
        const nums = new Set<number>();
        while (nums.size < count) nums.add(Math.floor(Math.random() * 50) + 1);
        const sorted = [...nums].sort((a, b) => a - b);
        correctOrder = (mode === 'desc' ? sorted.reverse() : sorted).map(String);
      }

      const items = shuffle([...correctOrder]);
      rounds.push({ items, correctOrder, mode });
    }
    return rounds;
  });

export function createGame(rounds: Round[]): GameState {
  return { rounds, currentRound: 0, placed: [], score: 0, totalRounds: rounds.length, completed: false };
}

export function placeItem(state: GameState, item: string): { state: GameState; correct: boolean } {
  if (state.completed) return { state, correct: false };
  const round = state.rounds[state.currentRound];
  const expectedIdx = state.placed.length;
  const correct = round.correctOrder[expectedIdx] === item;

  if (correct) {
    const placed = [...state.placed, item];
    let newState = { ...state, placed, score: state.score + 1 };
    if (placed.length === round.correctOrder.length) {
      // Round complete
      if (state.currentRound + 1 >= state.totalRounds) {
        newState = { ...newState, completed: true };
      } else {
        newState = { ...newState, currentRound: state.currentRound + 1, placed: [] };
      }
    }
    return { state: newState, correct: true };
  }
  return { state, correct: false };
}

export function getRemainingItems(state: GameState): string[] {
  const round = state.rounds[state.currentRound];
  return round.items.filter(i => !state.placed.includes(i));
}

export function getModeLabel(mode: SortMode): string {
  switch (mode) {
    case 'asc': return 'Sort: Smallest → Biggest';
    case 'desc': return 'Sort: Biggest → Smallest';
    case 'alpha': return 'Sort: A → Z';
    case 'size': return 'Sort: Smallest → Biggest';
  }
}

export function createGameSync(totalRounds?: number): GameState {
  return createGame(Effect.runSync(generateRounds(totalRounds)));
}
