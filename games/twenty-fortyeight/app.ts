import { createGrid, move, canMove, hasWon, addRandomTile, TILE_COLORS, type Grid, type Direction } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'twenty-fortyeight';
let _analyticsStartTime = 0;
let grid: Grid;
let score = 0;
let gameOver = false;
let won = false;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  grid = createGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  score = 0; gameOver = false; won = false;
  show('game');
  render();
}

function render() {
  document.getElementById('score')!.textContent = String(score);
  const container = document.getElementById('grid')!;
  container.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('div');
      const val = grid[r][c];
      cell.className = 'tile' + (val ? ` tile-${val}` : '');
      cell.textContent = val ? String(val) : '';
      if (val) {
        cell.style.background = TILE_COLORS[val] || '#3c3a32';
        cell.style.color = val <= 4 ? '#776e65' : '#f9f6f2';
      }
      container.appendChild(cell);
    }
  }
}

function handleMove(dir: Direction) {
  if (gameOver) return;
  const result = move(grid, dir);
  if (!result.moved) return;
  grid = result.grid;
  score += result.score;
  playClick();
  grid = addRandomTile(grid);
  render();

  if (hasWon(grid) && !won) {
    won = true;
    playWin();
    showConfetti();
  }

  if (!canMove(grid)) {
    gameOver = true;
    setTimeout(() => endGame(), 500);
  }
}

function endGame() {
  document.getElementById('final-score')!.textContent = String(score);
  show('result');
  playWrong();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW HIGH SCORE!';
    el.style.cssText = 'font-size:1.3rem;font-weight:900;color:#edc22e;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('final-score')!.after(el);
  }
}

// Keyboard
document.addEventListener('keydown', (e) => {
  const map: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
});

// Touch swipe
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 30) return;
  if (absDx > absDy) handleMove(dx > 0 ? 'right' : 'left');
  else handleMove(dy > 0 ? 'down' : 'up');
});

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}`;
  el.style.cssText = 'color:rgba(119,110,101,0.6);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
