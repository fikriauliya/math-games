import { initLevel, move, isSolved, getGrade, getLevelCount, type GameState } from './logic';
import { playCorrect, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'sokoban';
let state: GameState;
let currentLevel = 0;
let _startTime = 0;
let gameActive = false;

const canvas = document.getElementById('board') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const EMOJI: Record<string, string> = {
  '#': '🧱', '$': '📦', '*': '✅', '.': '🎯', '@': '🧑', '+': '🧑', ' ': '',
};

function cellSize(): number {
  const rows = state.grid.length, cols = Math.max(...state.grid.map(r => r.length));
  return Math.min(canvas.width / cols, canvas.height / rows);
}

function draw() {
  const cs = cellSize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const rows = state.grid.length, cols = Math.max(...state.grid.map(r => r.length));
  const ox = (canvas.width - cols * cs) / 2, oy = (canvas.height - rows * cs) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < state.grid[r].length; c++) {
      const ch = state.grid[r][c];
      if (ch === '#') {
        ctx.fillStyle = '#6d4c41'; ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs);
        ctx.strokeStyle = '#4e342e'; ctx.strokeRect(ox + c * cs, oy + r * cs, cs, cs);
      } else if (ch === '.') {
        ctx.fillStyle = 'rgba(255,138,101,0.3)';
        ctx.beginPath(); ctx.arc(ox + c * cs + cs / 2, oy + r * cs + cs / 2, cs * 0.2, 0, Math.PI * 2); ctx.fill();
      }
      if (ch === '$' || ch === '*') {
        ctx.fillStyle = ch === '*' ? '#4caf50' : '#ff8a65';
        ctx.fillRect(ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4);
        ctx.font = `${cs * 0.5}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white'; ctx.fillText(ch === '*' ? '✓' : '📦', ox + c * cs + cs / 2, oy + r * cs + cs / 2);
      }
      if (ch === '@' || ch === '+') {
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath(); ctx.arc(ox + c * cs + cs / 2, oy + r * cs + cs / 2, cs * 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.font = `${cs * 0.4}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#3e2723'; ctx.fillText('🧑', ox + c * cs + cs / 2, oy + r * cs + cs / 2);
      }
    }
  }
  document.getElementById('moves')!.textContent = String(state.moves);
}

function handleMove(dr: number, dc: number) {
  if (!gameActive) return;
  const prev = state.moves;
  state = move(state, dr, dc);
  if (state.moves > prev) { playClick(); draw(); }
  if (isSolved(state)) {
    gameActive = false; playWin(); showConfetti();
    const { grade, message } = getGrade(state.moves);
    setTimeout(() => {
      document.getElementById('game')!.classList.add('hidden');
      document.getElementById('result')!.classList.remove('hidden');
      document.getElementById('grade')!.textContent = grade;
      document.getElementById('result-title')!.textContent = message;
      document.getElementById('result-msg')!.textContent = `Solved in ${state.moves} moves`;
      setLastPlayed(GAME_ID);
      trackGameEnd(GAME_ID, Math.max(0, 100 - state.moves), Date.now() - _startTime, true);
      if (currentLevel >= getLevelCount() - 1) {
        document.getElementById('next-level-btn')!.textContent = 'PLAY AGAIN';
      }
      createRatingUI(GAME_ID, document.getElementById('rating-container')!);
    }, 600);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') handleMove(-1, 0);
  else if (e.key === 'ArrowDown') handleMove(1, 0);
  else if (e.key === 'ArrowLeft') handleMove(0, -1);
  else if (e.key === 'ArrowRight') handleMove(0, 1);
});

let tx = 0, ty = 0;
document.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) + Math.abs(dy) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) handleMove(0, dx > 0 ? 1 : -1);
  else handleMove(dy > 0 ? 1 : -1, 0);
});

function loadLevel() {
  state = initLevel(currentLevel);
  gameActive = true;
  document.getElementById('level')!.textContent = String(currentLevel + 1);
  draw();
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  currentLevel = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  loadLevel();
}

(window as any).resetLevel = () => { loadLevel(); };
(window as any).nextLevel = () => {
  currentLevel = (currentLevel + 1) % getLevelCount();
  document.getElementById('result')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('next-level-btn')!.textContent = 'NEXT LEVEL';
  loadLevel();
};

initMuteButton();
(window as any).startGame = startGame;
