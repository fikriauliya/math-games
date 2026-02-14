import { createGameState, makeMove, getAIMove, getWinLine, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'tic-tac-toe';
let _analyticsStartTime = 0;
let state: GameState;
let aiThinking = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame(mode: '1p' | '2p') {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  state = createGameState(mode);
  aiThinking = false;
  show('game-screen');
  renderBoard();
  updateTurnLabel();
}

function updateTurnLabel() {
  document.getElementById('turn-label')!.textContent = state.currentPlayer === 'X' ? '❌ X\'s Turn' : '⭕ O\'s Turn';
}

function renderBoard() {
  const board = document.getElementById('ttt-board')!;
  board.innerHTML = '';
  state.board.forEach((mark, i) => {
    const cell = document.createElement('div');
    cell.className = 'ttt-cell';
    if (mark) { cell.classList.add(mark, 'placed'); cell.textContent = mark; }
    cell.onclick = () => handleClick(i);
    board.appendChild(cell);
  });
}

function handleClick(index: number) {
  if (aiThinking) return;
  const next = makeMove(state, index);
  if (!next) return;
  state = next;
  playClick();
  renderBoard();

  if (state.winner || state.draw) return endRound();

  if (state.mode === '1p' && state.currentPlayer === 'O') {
    aiThinking = true;
    updateTurnLabel();
    setTimeout(() => {
      const aiIdx = getAIMove(state.board);
      const next = makeMove(state, aiIdx);
      if (next) { state = next; renderBoard(); }
      aiThinking = false;
      if (state.winner || state.draw) endRound();
      else updateTurnLabel();
    }, 500);
  } else {
    updateTurnLabel();
  }
}

function endRound() {
  const winLine = getWinLine(state.board);
  if (winLine) {
    const cells = document.querySelectorAll('.ttt-cell');
    winLine.forEach(i => cells[i].classList.add('win-cell'));
  }

  playWin();
  setLastPlayed(GAME_ID);

  const won = state.winner === 'X' ? 1 : 0;
  trackGameEnd(GAME_ID, won, Date.now() - _analyticsStartTime, true);

  setTimeout(() => {
    if (state.winner) {
      document.getElementById('result-emoji')!.textContent = state.winner === 'X' ? '❌' : '⭕';
      document.getElementById('result-title')!.textContent = `${state.winner} Wins!`;
      showConfetti();
    } else {
      document.getElementById('result-emoji')!.textContent = '🤝';
      document.getElementById('result-title')!.textContent = "It's a Draw!";
    }
    document.getElementById('result-sub')!.textContent = 'Great game!';
    show('result-screen');
    createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);

    if (state.winner === 'X') {
      const isNew = setHighScore(GAME_ID, (getHighScore(GAME_ID) || 0) + 1);
    }
  }, 1500);
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Wins: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.mode-select')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
