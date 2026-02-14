import { createPuzzleSync, createGrid, toggleMark, formatTime, type GridState, type Difficulty } from './logic';
import { playCorrect, playWrong, playClick, playWin, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'logic-grid';
let state: GridState;
let timerInterval: number;

function startGame() {
  const diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  const puzzle = createPuzzleSync(diff);
  state = createGrid(puzzle);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderClues();
  renderGrid();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!state.completed)
      document.getElementById('timer')!.textContent = formatTime(Date.now() - state.startTime);
  }, 1000) as any;
}

function renderClues() {
  const el = document.getElementById('clues')!;
  el.innerHTML = state.puzzle.clues.map(c => `<div class="clue">🔎 ${c}</div>`).join('');
}

function renderGrid() {
  const table = document.getElementById('grid-table')!;
  const p = state.puzzle;
  let html = '<table><tr><th></th>';
  for (const item of p.categories[1]) html += `<th>${item}</th>`;
  html += '</tr>';
  for (let r = 0; r < p.size; r++) {
    html += `<tr><th>${p.categories[0][r]}</th>`;
    for (let c = 0; c < p.size; c++) {
      const v = state.marks[r][c];
      const symbol = v === 1 ? '✓' : v === -1 ? '✗' : '';
      const cls = v === 1 ? 'yes' : v === -1 ? 'no' : '';
      html += `<td class="mark-cell ${cls}" data-r="${r}" data-c="${c}">${symbol}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  table.innerHTML = html;
  table.querySelectorAll('.mark-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const r = parseInt(cell.getAttribute('data-r')!);
      const c = parseInt(cell.getAttribute('data-c')!);
      state = toggleMark(state, r, c);
      playClick();
      renderGrid();
      if (state.completed) onWin();
    });
  });
}

function onWin() {
  clearInterval(timerInterval);
  const elapsed = Date.now() - state.startTime;
  playWin();
  showConfetti();
  setLastPlayed(GAME_ID);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-time')!.textContent = formatTime(elapsed);
}

(window as any).startGame = startGame;
initMuteButton();
