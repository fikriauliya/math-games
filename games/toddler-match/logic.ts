import { Effect } from 'effect';

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchRound {
  theme: string;
  pairs: MatchPair[];
  shuffledRight: string[];
}

const THEMES: { name: string; pairs: MatchPair[] }[] = [
  {
    name: 'Hewan & Suara',
    pairs: [
      { left: '🐄', right: 'Mooo' },
      { left: '🐱', right: 'Meong' },
      { left: '🐶', right: 'Guk guk' },
      { left: '🐔', right: 'Kukuruyuk' },
      { left: '🐸', right: 'Koak koak' },
    ],
  },
  {
    name: 'Warna',
    pairs: [
      { left: '🔴', right: 'Merah' },
      { left: '🔵', right: 'Biru' },
      { left: '🟢', right: 'Hijau' },
      { left: '🟡', right: 'Kuning' },
      { left: '🟣', right: 'Ungu' },
    ],
  },
  {
    name: 'Buah',
    pairs: [
      { left: '🍎', right: 'Apel' },
      { left: '🍌', right: 'Pisang' },
      { left: '🍊', right: 'Jeruk' },
      { left: '🍇', right: 'Anggur' },
      { left: '🍉', right: 'Semangka' },
    ],
  },
];

export const TOTAL_ROUNDS = 3;
export const PAIRS_PER_ROUND = 3;

const randomInt = (max: number) => Effect.sync(() => Math.floor(Math.random() * max));

const shuffleEffect = <T>(a: T[]): Effect.Effect<T[]> =>
  Effect.gen(function* () {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = yield* randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

export const generateRoundEffect = (roundIdx: number): Effect.Effect<MatchRound> =>
  Effect.gen(function* () {
    const theme = THEMES[roundIdx % THEMES.length];
    const shuffledPairs = yield* shuffleEffect([...theme.pairs]);
    const pairs = shuffledPairs.slice(0, PAIRS_PER_ROUND);
    const shuffledRight = yield* shuffleEffect(pairs.map(p => p.right));
    return { theme: theme.name, pairs, shuffledRight };
  });

export const checkMatch = (leftIdx: number, rightValue: string, pairs: MatchPair[]): boolean =>
  pairs[leftIdx].right === rightValue;

export const getResultText = (score: number, total: number): { emoji: string; title: string; sub: string } => {
  const perfect = score === total;
  const good = score >= total * 0.6;
  return {
    emoji: perfect ? '🏆' : good ? '🎉' : '💪',
    title: perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!',
    sub: `${score} dari ${total} benar!`,
  };
};

// ── Plain wrappers ─────────────────────────────────────────────
export function generateRound(roundIdx: number): MatchRound {
  return Effect.runSync(generateRoundEffect(roundIdx));
}

export function shuffle<T>(a: T[]): T[] {
  return Effect.runSync(shuffleEffect(a));
}
