import { getHighScore, getLastPlayed } from './lib/storage';

const GAMES = [
  { id: 'tug-of-war', path: 'games/tug-of-war/' },
  { id: 'speed-math', path: 'games/speed-math/' },
  { id: 'bubble-pop', path: 'games/bubble-pop/' },
  { id: 'memory-math', path: 'games/memory-math/' },
  { id: 'number-ninja', path: 'games/number-ninja/' },
  { id: 'toddler-colors', path: 'games/toddler-colors/' },
  { id: 'toddler-animals', path: 'games/toddler-animals/' },
  { id: 'toddler-numbers', path: 'games/toddler-numbers/' },
  { id: 'multiplication-war', path: 'games/multiplication-war/' },
  { id: 'mean-median', path: 'games/mean-median/' },
  { id: 'geometry-shapes', path: 'games/geometry-shapes/' },
  { id: 'factor-finder', path: 'games/factor-finder/' },
  { id: 'math-maze', path: 'games/math-maze/' },
  { id: 'connect-four', path: 'games/connect-four/' },
  { id: 'tic-tac-toe', path: 'games/tic-tac-toe/' },
  { id: 'simon-says', path: 'games/simon-says/' },
  { id: 'toddler-weather', path: 'games/toddler-weather/' },
  { id: 'toddler-fingers', path: 'games/toddler-fingers/' },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll<HTMLAnchorElement>('.game-card');
  cards.forEach(card => {
    const href = card.getAttribute('href') || '';
    const game = GAMES.find(g => href.includes(g.path));
    if (!game) return;
    
    const best = getHighScore(game.id);
    const lastPlayed = getLastPlayed(game.id);
    
    if (best > 0 || lastPlayed) {
      const info = document.createElement('div');
      info.className = 'game-stats';
      info.style.cssText = 'font-size:0.75rem;color:rgba(255,255,255,0.6);margin-top:0.3rem;display:flex;gap:0.8rem;';
      if (best > 0) info.innerHTML += `<span>🏆 Best: ${best}</span>`;
      if (lastPlayed) info.innerHTML += `<span>🕐 ${timeAgo(lastPlayed)}</span>`;
      card.querySelector('.game-tags')!.after(info);
    }
  });
});
