import { shufflePuzzles, checkMove, getResultText, PIECE_DISPLAY, TOTAL, type ChessPuzzle } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'chess-puzzle';
let _start = 0;
let puzzles: ChessPuzzle[];
let round = 0;
let score = 0;
let current: ChessPuzzle;
let selected = false;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  puzzles = shufflePuzzles();
  round = 0; score = 0;
  show('game-screen');
  nextPuzzle();
}

function nextPuzzle() {
  if (round >= TOTAL) return endGame();
  current = puzzles[round];
  selected = false;
  document.getElementById('puzzle-info')!.textContent = `Puzzle ${round + 1}/${TOTAL}`;
  document.getElementById('description')!.textContent = current.description;
  document.getElementById('feedback')!.textContent = '';
  renderBoard();
}

function renderBoard() {
  const boardEl = document.getElementById('board')!;
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement('div');
      const isDark = (r + c) % 2 === 1;
      cell.className = 'cell ' + (isDark ? 'dark' : 'light');
      const piece = current.board[r][c];
      if (piece) {
        cell.textContent = PIECE_DISPLAY[piece] || '';
        if (r === current.attackerPos[0] && c === current.attackerPos[1]) {
          cell.classList.add('attacker');
        }
      }
      cell.onclick = () => tapSquare(r, c, cell);
      boardEl.appendChild(cell);
    }
  }
}

function tapSquare(r: number, c: number, el: HTMLElement) {
  if (selected) return;
  const correct = checkMove(r, c, current);
  const fb = document.getElementById('feedback')!;

  if (correct) {
    selected = true;
    score++;
    el.classList.add('correct-sq');
    fb.textContent = '✅ Checkmate!';
    fb.style.color = '#4caf50';
    playCorrect();
    setTimeout(() => { round++; nextPuzzle(); }, 1500);
  } else {
    el.classList.add('wrong-sq');
    fb.textContent = '❌ Try again...';
    fb.style.color = '#f44336';
    playWrong();
    setTimeout(() => {
      el.classList.remove('wrong-sq');
      fb.textContent = current.description;
      fb.style.color = '';
    }, 800);
  }
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  if (setHighScore(GAME_ID, score) && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;
