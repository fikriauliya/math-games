import { generatePuzzle, isDifference, getResultText, DIFF_COUNT, GRID_SIZE, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'spot-difference';
let _start = 0;
let puzzle: Puzzle;
let found: Set<string>;
let level = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  level = 0;
  found = new Set();
  puzzle = generatePuzzle();
  show('game-screen');
  renderGrids();
  updateStatus();
}

function renderGrids() {
  const gridAEl = document.getElementById('grid-a')!;
  const gridBEl = document.getElementById('grid-b')!;
  gridAEl.innerHTML = '';
  gridBEl.innerHTML = '';
  gridAEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  gridBEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cellA = document.createElement('div');
      cellA.className = 'cell';
      cellA.textContent = puzzle.gridA[r][c];
      gridAEl.appendChild(cellA);

      const cellB = document.createElement('div');
      cellB.className = 'cell';
      cellB.textContent = puzzle.gridB[r][c];
      cellB.onclick = () => tapCell(cellB, r, c);
      gridBEl.appendChild(cellB);
    }
  }
}

function tapCell(el: HTMLElement, r: number, c: number) {
  const key = `${r},${c}`;
  if (found.has(key)) return;
  
  if (isDifference(r, c, puzzle.differences)) {
    found.add(key);
    el.classList.add('found');
    playCorrect();
    updateStatus();
    if (found.size === DIFF_COUNT) {
      level++;
      if (level >= 5) {
        endGame();
      } else {
        setTimeout(() => {
          puzzle = generatePuzzle();
          found = new Set();
          renderGrids();
          updateStatus();
        }, 1000);
      }
    }
  } else {
    el.classList.add('miss');
    playWrong();
    setTimeout(() => el.classList.remove('miss'), 500);
  }
}

function updateStatus() {
  document.getElementById('status')!.textContent = `Level ${level + 1}/5 — Found: ${found.size}/${DIFF_COUNT}`;
}

function endGame() {
  const score = level * DIFF_COUNT;
  const result = getResultText(score, 5 * DIFF_COUNT);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = `Completed ${level} puzzles!`;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (level === 5) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;
