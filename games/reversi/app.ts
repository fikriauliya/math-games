import { createGame, makeMove, getValidMoves, getAIMove, getWinner, SIZE, type GameState } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed, getHighScore, setHighScore } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'reversi';
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
  board.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
  const valid = state.currentPlayer === 'black' ? getValidMoves(state.board, 'black') : [];
  const validSet = new Set(valid.map(([r, c]) => `${r},${c}`));

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (state.board[r][c] === 'black') { cell.innerHTML = '<div class="disc black-disc"></div>'; }
      else if (state.board[r][c] === 'white') { cell.innerHTML = '<div class="disc white-disc"></div>'; }
      else if (validSet.has(`${r},${c}`)) { cell.classList.add('valid'); }
      cell.onclick = () => handleClick(r, c);
      board.appendChild(cell);
    }
  }
  document.getElementById('score-label')!.textContent = `⚫ ${state.blackCount}  ⚪ ${state.whiteCount}`;
  document.getElementById('turn-label')!.textContent = state.currentPlayer === 'black' ? '⚫ Your Turn' : '⚪ AI Thinking...';
}

function handleClick(r: number, c: number) {
  if (state.currentPlayer !== 'black' || state.gameOver) return;
  const next = makeMove(state, r, c);
  if (!next) { playWrong(); return; }
  state = next;
  playClick();
  render();
  checkEnd();
  if (!state.gameOver && state.currentPlayer === 'white') setTimeout(aiTurn, 500);
}

function aiTurn() {
  if (state.gameOver || state.currentPlayer !== 'white') return;
  const move = getAIMove(state);
  if (!move) return;
  const next = makeMove(state, move[0], move[1]);
  if (next) { state = next; playClick(); render(); checkEnd(); }
  if (!state.gameOver && state.currentPlayer === 'white') setTimeout(aiTurn, 500);
}

function checkEnd() {
  if (!state.gameOver) return;
  const winner = getWinner(state);
  const elapsed = Date.now() - _startTime;
  setLastPlayed(GAME_ID);
  const isWin = winner === 'black';
  if (isWin) { playWin(); showConfetti(); } else playCorrect();
  const best = getHighScore(GAME_ID);
  if (isWin && (!best || state.blackCount > best)) setHighScore(GAME_ID, state.blackCount);
  trackGameEnd(GAME_ID, state.blackCount, elapsed, isWin);
  setTimeout(() => {
    document.getElementById('result-emoji')!.textContent = isWin ? '🏆' : winner === 'draw' ? '🤝' : '😅';
    document.getElementById('result-title')!.textContent = isWin ? 'You Win!' : winner === 'draw' ? 'Draw!' : 'AI Wins!';
    document.getElementById('result-sub')!.textContent = `⚫ ${state.blackCount} — ⚪ ${state.whiteCount}`;
    show('result-screen');
    createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  }, 1500);
}

initMuteButton();
(window as any).startGame = startGame;
