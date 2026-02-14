import { toggle, isSolved, PUZZLES, generateRandomPuzzle, countLightsOn, type LightsGrid } from './logic';
import { playCorrect, playClick, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'lights-out';
let _analyticsStartTime = 0;
let grid: LightsGrid;
let moves = 0;
let puzzleIdx = -1; // -1 = random

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame(mode: string) {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID, mode);
  moves = 0;
  if (mode === 'random') {
    puzzleIdx = -1;
    grid = generateRandomPuzzle();
  } else {
    puzzleIdx = parseInt(mode);
    grid = PUZZLES[puzzleIdx].map(r => [...r]);
  }
  show('game');
  document.getElementById('moves')!.textContent = '0';
  document.getElementById('puzzle-label')!.textContent = puzzleIdx >= 0 ? `Puzzle ${puzzleIdx + 1}` : 'Random';
  render();
}

function render() {
  const container = document.getElementById('grid')!;
  container.innerHTML = '';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const btn = document.createElement('button');
      btn.className = 'light' + (grid[r][c] ? ' on' : '');
      btn.onclick = () => handleClick(r, c);
      container.appendChild(btn);
    }
  }
}

function handleClick(r: number, c: number) {
  grid = toggle(grid, r, c);
  moves++;
  document.getElementById('moves')!.textContent = String(moves);
  playClick();
  render();

  if (isSolved(grid)) {
    setTimeout(() => endGame(), 300);
  }
}

function endGame() {
  document.getElementById('result-moves')!.textContent = String(moves);
  show('result');
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, moves, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  // Lower moves = better, so store inverse for high score
  const scoreVal = Math.max(0, 100 - moves);
  const isNew = setHighScore(GAME_ID, scoreVal);
  if (isNew && scoreVal > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW BEST!';
    el.style.cssText = 'font-size:1.3rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-moves')!.after(el);
  }
}

initMuteButton();
(window as any).startGame = startGame;
