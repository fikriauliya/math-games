import { createMaze, createMazeState, move, formatTime, type MazeState, type Difficulty } from './logic';
import { playClick, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'maze-runner';
let _analyticsStartTime = 0;
let state: MazeState;
let timerInterval: number;

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  const diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  const maze = createMaze(diff);
  state = createMazeState(maze);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderMaze();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!state.completed)
      document.getElementById('timer')!.textContent = formatTime(Date.now() - state.startTime);
  }, 1000) as any;
}

function renderMaze() {
  const grid = document.getElementById('maze')!;
  const m = state.maze;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${m.width}, 1fr)`;

  for (let r = 0; r < m.height; r++) {
    for (let c = 0; c < m.width; c++) {
      const cell = document.createElement('div');
      cell.className = 'maze-cell';
      const w = m.walls[r][c];
      if (w[0]) cell.classList.add('wall-top');
      if (w[1]) cell.classList.add('wall-right');
      if (w[2]) cell.classList.add('wall-bottom');
      if (w[3]) cell.classList.add('wall-left');
      if (r === state.pos[0] && c === state.pos[1]) {
        cell.classList.add('player');
        cell.textContent = '🏃';
      }
      if (r === m.end[0] && c === m.end[1]) {
        cell.classList.add('exit');
        if (!(r === state.pos[0] && c === state.pos[1])) cell.textContent = '🏁';
      }
      if (r === m.start[0] && c === m.start[1] && !(r === state.pos[0] && c === state.pos[1])) {
        cell.textContent = '🚪';
      }
      grid.appendChild(cell);
    }
  }
  document.getElementById('moves')!.textContent = String(state.moves);
}

function doMove(dir: 'up' | 'down' | 'left' | 'right') {
  if (state.completed) return;
  const prev = state;
  state = move(state, dir);
  if (state.moves > prev.moves) {
    playClick();
    renderMaze();
    if (state.completed) onWin();
  } else {
    playWrong();
  }
}

function onWin() {
  clearInterval(timerInterval);
  const elapsed = Date.now() - state.startTime;
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-time')!.textContent = formatTime(elapsed);
  document.getElementById('r-moves')!.textContent = String(state.moves);
}

// Keyboard + touch controls
document.addEventListener('keydown', (e) => {
  const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
  };
  if (map[e.key]) { e.preventDefault(); doMove(map[e.key]); }
});

// Swipe detection
let touchStart: { x: number; y: number } | null = null;
document.addEventListener('touchstart', (e) => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; });
document.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left');
  else doMove(dy > 0 ? 'down' : 'up');
});

// D-pad buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-up')?.addEventListener('click', () => doMove('up'));
  document.getElementById('btn-down')?.addEventListener('click', () => doMove('down'));
  document.getElementById('btn-left')?.addEventListener('click', () => doMove('left'));
  document.getElementById('btn-right')?.addEventListener('click', () => doMove('right'));
});

(window as any).startGame = startGame;
initMuteButton();
