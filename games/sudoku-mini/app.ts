import { createPuzzle, placeNumber, clearCell, getConflicts, formatTime, type SudokuState, type Difficulty } from './logic';
import { playCorrect, playWrong, playClick, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'sudoku-mini';
let state: SudokuState;
let timerInterval: number;
let selected: [number, number] | null = null;

function startGame() {
  const diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  state = createPuzzle(diff);
  selected = null;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderBoard();
  renderNumPad();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!state.completed) {
      document.getElementById('timer')!.textContent = formatTime(Date.now() - state.startTime);
    }
  }, 1000) as any;
}

function renderBoard() {
  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
  const conflicts = getConflicts(state.board, state.size, state.boxW, state.boxH);

  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (state.fixed[r][c]) cell.classList.add('fixed');
      if (conflicts.has(`${r},${c}`)) cell.classList.add('conflict');
      if (selected && selected[0] === r && selected[1] === c) cell.classList.add('selected');
      if (state.board[r][c] !== 0) cell.textContent = String(state.board[r][c]);
      // Box borders
      if (c % state.boxW === 0 && c > 0) cell.classList.add('box-left');
      if (r % state.boxH === 0 && r > 0) cell.classList.add('box-top');
      cell.onclick = () => { selected = [r, c]; playClick(); renderBoard(); };
      grid.appendChild(cell);
    }
  }
}

function renderNumPad() {
  const pad = document.getElementById('numpad')!;
  pad.innerHTML = '';
  for (let n = 1; n <= state.size; n++) {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = String(n);
    btn.onclick = () => {
      if (!selected) return;
      state = placeNumber(state, selected[0], selected[1], n);
      playClick();
      renderBoard();
      if (state.completed) onWin();
    };
    pad.appendChild(btn);
  }
  const clr = document.createElement('button');
  clr.className = 'num-btn clear-btn';
  clr.textContent = '✕';
  clr.onclick = () => {
    if (!selected) return;
    state = clearCell(state, selected[0], selected[1]);
    playClick();
    renderBoard();
  };
  pad.appendChild(clr);
}

function onWin() {
  clearInterval(timerInterval);
  const elapsed = Date.now() - state.startTime;
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);

  const bestKey = `${GAME_ID}-${(document.getElementById('diff') as HTMLSelectElement).value}`;
  const prevBest = parseInt(localStorage.getItem(`mathgames-${bestKey}-besttime`) || '0') || 0;
  const isNewRecord = prevBest === 0 || elapsed < prevBest;
  if (isNewRecord) localStorage.setItem(`mathgames-${bestKey}-besttime`, String(elapsed));

  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-time')!.textContent = formatTime(elapsed);
  document.getElementById('r-best')!.textContent = isNewRecord ? '🏆 NEW RECORD!' : `Best: ${formatTime(prevBest)}`;
}

(window as any).startGame = startGame;
initMuteButton();
