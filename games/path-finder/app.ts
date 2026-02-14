import { createGame, addToPath, isOptimal, GRID_SIZE, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'path-finder';
let _startTime = 0;
let state: GameState;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = createGame();
  show('game-screen');
  render();
}

function render() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  const pathSet = new Set(state.userPath.map(([r, c]) => `${r},${c}`));
  const last = state.userPath[state.userPath.length - 1];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const type = state.grid.cells[r][c];
      if (type === 'wall') cell.classList.add('wall');
      else if (type === 'start') { cell.classList.add('start'); cell.textContent = '🏁'; }
      else if (type === 'end') { cell.classList.add('end'); cell.textContent = '⭐'; }

      if (pathSet.has(`${r},${c}`) && type !== 'start') cell.classList.add('path');
      if (r === last[0] && c === last[1]) cell.classList.add('current');

      cell.onclick = () => handleClick(r, c);
      board.appendChild(cell);
    }
  }
  document.getElementById('steps-label')!.textContent = `Steps: ${state.userPath.length - 1} | Shortest: ${state.shortestLength}`;
}

function handleClick(r: number, c: number) {
  const next = addToPath(state, r, c);
  if (!next) { playWrong(); return; }
  state = next;
  playClick();
  render();

  if (state.won) {
    const optimal = isOptimal(state);
    if (optimal) { playWin(); showConfetti(); } else playCorrect();
    setLastPlayed(GAME_ID);
    const elapsed = Date.now() - _startTime;
    const score = state.shortestLength - (state.userPath.length - 1) + state.shortestLength; // better=higher
    const best = getHighScore(GAME_ID);
    if (!best || score > best) setHighScore(GAME_ID, score);
    trackGameEnd(GAME_ID, score, elapsed, optimal);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = optimal ? '🌟' : '✅';
      document.getElementById('result-title')!.textContent = optimal ? 'Shortest Path!' : 'Path Found!';
      document.getElementById('result-sub')!.textContent = `${state.userPath.length - 1} steps (shortest: ${state.shortestLength})`;
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1500);
  }
}

initMuteButton();
(window as any).startGame = startGame;
