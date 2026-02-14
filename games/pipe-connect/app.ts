import { createPuzzle, rotatePipe, GRID_SIZE, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'pipe-connect';
let _startTime = 0;
let state: GameState;
let moves = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = createPuzzle();
  moves = 0;
  show('game-screen');
  render();
}

function render() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const pipe = state.grid[r][c];
      const cell = document.createElement('div');
      cell.className = `cell pipe-${pipe.type}`;
      cell.style.transform = `rotate(${pipe.rotation * 90}deg)`;

      // Draw pipe symbol
      const symbols: Record<string, string> = {
        straight: '║', elbow: '╚', tee: '╠', cross: '╬', source: '💧', drain: '🚰', empty: ''
      };
      cell.textContent = symbols[pipe.type] || '';
      cell.onclick = () => handleRotate(r, c);
      board.appendChild(cell);
    }
  }
  document.getElementById('moves-label')!.textContent = `Moves: ${moves}`;
}

function handleRotate(r: number, c: number) {
  if (state.solved) return;
  const next = rotatePipe(state, r, c);
  if (next === state) return;
  state = next;
  moves++;
  playClick();
  render();

  if (state.solved) {
    playWin(); showConfetti(); setLastPlayed(GAME_ID);
    const elapsed = Date.now() - _startTime;
    const best = getHighScore(GAME_ID);
    if (!best || moves < best) setHighScore(GAME_ID, moves);
    trackGameEnd(GAME_ID, Math.max(0, 50 - moves), elapsed, true);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '🔧';
      document.getElementById('result-title')!.textContent = 'Pipes Connected!';
      document.getElementById('result-sub')!.textContent = `Done in ${moves} rotations!`;
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1500);
  }
}

initMuteButton();
(window as any).startGame = startGame;
