import { Effect } from 'effect';

// Cell types: ' '=empty, '#'=wall, '.'=target, '$'=box, '@'=player, '+'=player on target, '*'=box on target
export interface GameState { grid: string[][]; playerR: number; playerC: number; moves: number; }

const LEVELS: string[][] = [
  [ // Level 1
    '#####',
    '#. @#',
    '# $ #',
    '#.$ #',
    '#####',
  ],
  [ // Level 2
    '######',
    '#    #',
    '# $@ #',
    '# $. #',
    '#  . #',
    '######',
  ],
  [ // Level 3
    '#######',
    '#     #',
    '# $$. #',
    '# @.  #',
    '#  .$ #',
    '#     #',
    '#######',
  ],
  [ // Level 4
    '########',
    '#      #',
    '# $.@. #',
    '#  $$  #',
    '#  ..  #',
    '#      #',
    '########',
  ],
  [ // Level 5
    '########',
    '# @    #',
    '# $$.  #',
    '#  $.  #',
    '#   .  #',
    '#  $   #',
    '#  .   #',
    '########',
  ],
];

export const getLevelCountEffect = (): Effect.Effect<number> => Effect.succeed(LEVELS.length);
export function getLevelCount(): number { return LEVELS.length; }

export const initLevelEffect = (level: number): Effect.Effect<GameState> =>
  Effect.sync(() => {
    const raw = LEVELS[Math.min(level, LEVELS.length - 1)];
    const grid = raw.map(r => r.split(''));
    let playerR = 0, playerC = 0;
    for (let r = 0; r < grid.length; r++)
      for (let c = 0; c < grid[r].length; c++)
        if (grid[r][c] === '@' || grid[r][c] === '+') { playerR = r; playerC = c; }
    return { grid, playerR, playerC, moves: 0 };
  });

export function initLevel(level: number): GameState { return Effect.runSync(initLevelEffect(level)); }

export const moveEffect = (state: GameState, dr: number, dc: number): Effect.Effect<GameState> =>
  Effect.sync(() => {
    const { grid, playerR, playerC, moves } = state;
    const g = grid.map(r => [...r]);
    const nr = playerR + dr, nc = playerC + dc;
    if (nr < 0 || nr >= g.length || nc < 0 || nc >= g[0].length) return state;
    const target = g[nr][nc];
    if (target === '#') return state;
    // Box push
    if (target === '$' || target === '*') {
      const br = nr + dr, bc = nc + dc;
      if (br < 0 || br >= g.length || bc < 0 || bc >= g[0].length) return state;
      const behind = g[br][bc];
      if (behind === '#' || behind === '$' || behind === '*') return state;
      g[br][bc] = behind === '.' ? '*' : '$';
      g[nr][nc] = (target === '*') ? '.' : ' ';
    }
    // Move player
    const curCell = g[playerR][playerC];
    g[playerR][playerC] = (curCell === '+') ? '.' : ' ';
    const destCell = g[nr][nc];
    g[nr][nc] = (destCell === '.' || destCell === '*') ? '+' : '@';
    return { grid: g, playerR: nr, playerC: nc, moves: moves + 1 };
  });

export function move(state: GameState, dr: number, dc: number): GameState { return Effect.runSync(moveEffect(state, dr, dc)); }

export const isSolvedEffect = (state: GameState): Effect.Effect<boolean> =>
  Effect.succeed(!state.grid.some(row => row.some(c => c === '$')));

export function isSolved(state: GameState): boolean { return Effect.runSync(isSolvedEffect(state)); }

export function getGrade(moves: number): { grade: string; message: string } {
  if (moves <= 15) return { grade: 'S', message: '🏆 Perfect!' };
  if (moves <= 30) return { grade: 'A', message: '⭐ Excellent!' };
  if (moves <= 50) return { grade: 'B', message: '👍 Good!' };
  return { grade: 'C', message: '💪 Solved!' };
}
