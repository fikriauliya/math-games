import { Effect } from 'effect';

export interface Round {
  items: string[];
  oddIndex: number;
  category: string;
  hint: string;
}

export interface GameState {
  rounds: Round[];
  currentRound: number;
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

interface Category {
  name: string;
  hint: string;
  normals: string[];
  odds: string[];
}

const CATEGORIES: Category[] = [
  { name: 'shapes', hint: 'One shape is different!', normals: ['🔵', '🔵', '🔵'], odds: ['🟥'] },
  { name: 'shapes2', hint: 'Find the different shape!', normals: ['⭐', '⭐', '⭐'], odds: ['🔷'] },
  { name: 'shapes3', hint: 'One is not like the others!', normals: ['🔺', '🔺', '🔺'], odds: ['⬛'] },
  { name: 'fruits', hint: 'One is not a fruit!', normals: ['🍎', '🍊', '🍇'], odds: ['🥕'] },
  { name: 'fruits2', hint: 'Find the veggie!', normals: ['🍌', '🍓', '🍑'], odds: ['🥦'] },
  { name: 'animals-land', hint: 'One lives in water!', normals: ['🐕', '🐈', '🐎'], odds: ['🐟'] },
  { name: 'animals-water', hint: 'One lives on land!', normals: ['🐟', '🐋', '🐠'], odds: ['🐕'] },
  { name: 'even', hint: 'One number is odd!', normals: ['2', '4', '6'], odds: ['3'] },
  { name: 'odd', hint: 'One number is even!', normals: ['1', '3', '5'], odds: ['8'] },
  { name: 'big', hint: 'One is much smaller!', normals: ['🐘', '🦒', '🐎'], odds: ['🐜'] },
  { name: 'letters', hint: 'One is a number!', normals: ['A', 'B', 'C'], odds: ['7'] },
  { name: 'vehicles', hint: 'One doesn\'t fly!', normals: ['✈️', '🚁', '🪁'], odds: ['🚗'] },
  { name: 'cold', hint: 'One is hot!', normals: ['🧊', '❄️', '⛄'], odds: ['🔥'] },
  { name: 'music', hint: 'One is not an instrument!', normals: ['🎸', '🎹', '🎺'], odds: ['📚'] },
  { name: 'weather', hint: 'One is not weather!', normals: ['☀️', '🌧️', '⛈️'], odds: ['🎂'] },
];

export const generateRounds = (total: number = 12): Effect.Effect<Round[]> =>
  Effect.sync(() => {
    const cats = shuffle(CATEGORIES).slice(0, Math.min(total, CATEGORIES.length));
    // If we need more rounds than categories, cycle
    while (cats.length < total) cats.push(...shuffle(CATEGORIES).slice(0, total - cats.length));

    return cats.slice(0, total).map(cat => {
      const items = [...cat.normals, cat.odds[0]];
      const shuffled = shuffle(items.map((item, i) => ({ item, isOdd: i >= cat.normals.length })));
      const oddIndex = shuffled.findIndex(s => s.isOdd);
      return {
        items: shuffled.map(s => s.item),
        oddIndex,
        category: cat.name,
        hint: cat.hint,
      };
    });
  });

export function createGame(rounds: Round[]): GameState {
  return { rounds, currentRound: 0, score: 0, totalRounds: rounds.length, completed: false };
}

export function selectItem(state: GameState, index: number): { state: GameState; correct: boolean } {
  if (state.completed) return { state, correct: false };
  const round = state.rounds[state.currentRound];
  const correct = index === round.oddIndex;
  const nextRound = state.currentRound + 1;
  const completed = nextRound >= state.totalRounds;

  return {
    state: {
      ...state,
      score: correct ? state.score + 1 : state.score,
      currentRound: completed ? state.currentRound : nextRound,
      completed,
    },
    correct,
  };
}

export function createGameSync(total?: number): GameState {
  return createGame(Effect.runSync(generateRounds(total)));
}
