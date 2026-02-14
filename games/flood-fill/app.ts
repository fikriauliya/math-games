import { createGame, flood, isGameOver, COLORS, BOARD_SIZE, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'flood-fill';
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
  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.background = COLORS[state.board[r][c]];
      board.appendChild(cell);
    }
  }
  document.getElementById('moves-label')!.textContent = `Moves: ${state.moves} / ${state.maxMoves}`;

  const palette = document.getElementById('palette')!;
  palette.innerHTML = '';
  COLORS.forEach((color, i) => {
    const btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.style.background = color;
    btn.onclick = () => pickColor(i);
    palette.appendChild(btn);
  });
}

function pickColor(colorIndex: number) {
  if (isGameOver(state)) return;
  if (state.board[0][0] === colorIndex) return;
  playClick();
  state = flood(state, colorIndex);
  render();

  if (state.won) {
    playWin();
    showConfetti();
    setLastPlayed(GAME_ID);
    const best = getHighScore(GAME_ID);
    if (!best || state.moves < best) setHighScore(GAME_ID, state.moves);
    trackGameEnd(GAME_ID, state.maxMoves - state.moves, Date.now() - _startTime, true);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '🎨';
      document.getElementById('result-title')!.textContent = 'Board Filled!';
      document.getElementById('result-sub')!.textContent = `Done in ${state.moves} moves!`;
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1000);
  } else if (state.moves >= state.maxMoves) {
    playWrong();
    trackGameEnd(GAME_ID, 0, Date.now() - _startTime, false);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '😅';
      document.getElementById('result-title')!.textContent = 'Out of Moves!';
      document.getElementById('result-sub')!.textContent = 'Try again!';
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1000);
  }
}

initMuteButton();
(window as any).startGame = startGame;
