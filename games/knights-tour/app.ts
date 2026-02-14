import { createGame, getValidMoves, makeMove, BOARD_SIZE, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'knights-tour';
let _startTime = 0;
let state: GameState;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  state = createGame(0, 0);
  show('game-screen');
  render();
}

function render() {
  const board = document.getElementById('board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  const valid = getValidMoves(state);
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const isValid = valid.some(([vr, vc]) => vr === r && vc === c);
      if (state.currentPos[0] === r && state.currentPos[1] === c) {
        cell.classList.add('current');
        cell.textContent = '♞';
      } else if (state.board[r][c] > 0) {
        cell.classList.add('visited');
        cell.textContent = String(state.board[r][c]);
      } else if (isValid) {
        cell.classList.add('valid');
        cell.onclick = () => handleMove(r, c);
      }
      board.appendChild(cell);
    }
  }
  document.getElementById('move-label')!.textContent = `Moves: ${state.moveCount} / ${state.totalCells}`;
}

function handleMove(r: number, c: number) {
  const next = makeMove(state, r, c);
  if (!next) { playWrong(); return; }
  state = next;
  playClick();
  render();

  if (state.won) {
    playWin(); showConfetti(); setLastPlayed(GAME_ID);
    const elapsed = Date.now() - _startTime;
    const best = getHighScore(GAME_ID);
    if (!best || state.moveCount > best) setHighScore(GAME_ID, state.moveCount);
    trackGameEnd(GAME_ID, state.moveCount, elapsed, true);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '♞';
      document.getElementById('result-title')!.textContent = 'Knight\'s Tour Complete!';
      document.getElementById('result-sub')!.textContent = `All ${state.totalCells} squares visited!`;
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1500);
  } else if (state.stuck) {
    playWrong();
    trackGameEnd(GAME_ID, state.moveCount, Date.now() - _startTime, false);
    setTimeout(() => {
      document.getElementById('result-emoji')!.textContent = '😅';
      document.getElementById('result-title')!.textContent = 'Stuck!';
      document.getElementById('result-sub')!.textContent = `Visited ${state.moveCount}/${state.totalCells}. Try again!`;
      show('result-screen');
      createRatingUI(GAME_ID, document.getElementById('result-screen')!);
    }, 1000);
  }
}

initMuteButton();
(window as any).startGame = startGame;
