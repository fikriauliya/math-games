import { createGameState, dropDisc, COLS, ROWS, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'connect-four';
let _analyticsStartTime = 0;
let state: GameState;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  state = createGameState();
  show('game-screen');
  renderBoard();
  updateTurnLabel();
}

function updateTurnLabel() {
  const label = document.getElementById('turn-label')!;
  label.textContent = state.currentPlayer === 'red' ? '🔴 Red\'s Turn' : '🟡 Yellow\'s Turn';
}

function renderBoard() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (state.board[r][c] === 'red') cell.classList.add('red');
      if (state.board[r][c] === 'yellow') cell.classList.add('yellow');
      cell.onclick = () => handleDrop(c);
      board.appendChild(cell);
    }
  }
}

function handleDrop(col: number) {
  const next = dropDisc(state, col);
  if (!next) return;
  
  state = next;
  playClick();
  renderBoard();

  // Animate dropped disc
  let dropRow = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (state.board[r][col] && (r === ROWS - 1 || state.board[r + 1]?.[col])) {
      dropRow = r;
      break;
    }
  }
  if (dropRow >= 0) {
    const cells = document.querySelectorAll('.cell');
    const idx = dropRow * COLS + col;
    cells[idx]?.classList.add('drop');
  }

  if (state.winner) {
    document.getElementById('turn-label')!.textContent = state.winner === 'red' ? '🔴 Red Wins!' : '🟡 Yellow Wins!';
    // Disable clicks
    document.querySelectorAll<HTMLDivElement>('.cell').forEach(c => c.onclick = null);
    playWin();
    showConfetti();
    setLastPlayed(GAME_ID);
    trackGameEnd(GAME_ID, 1, Date.now() - _analyticsStartTime, true);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = state.winner === 'red' ? '🔴' : '🟡';
      document.getElementById('result-title')!.textContent = `${state.winner === 'red' ? 'Red' : 'Yellow'} Wins!`;
      document.getElementById('result-sub')!.textContent = 'Great game!';
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
    }, 2000);
  } else if (state.draw) {
    document.getElementById('turn-label')!.textContent = "It's a Draw!";
    document.querySelectorAll<HTMLDivElement>('.cell').forEach(c => c.onclick = null);
    setLastPlayed(GAME_ID);
    trackGameEnd(GAME_ID, 0, Date.now() - _analyticsStartTime, true);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '🤝';
      document.getElementById('result-title')!.textContent = "It's a Draw!";
      document.getElementById('result-sub')!.textContent = 'Well played by both!';
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
    }, 1500);
  } else {
    updateTurnLabel();
  }
}

initMuteButton();
(window as any).startGame = startGame;
