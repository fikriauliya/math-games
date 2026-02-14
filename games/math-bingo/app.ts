import { generateCard, generateQuestion, checkBingo, getAllCardNumbers, shuffle, type BingoCard, type BingoQuestion, type Difficulty } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'math-bingo';
let _analyticsStartTime = 0;
let card: BingoCard;
let marked: boolean[][];
let numberQueue: number[];
let queueIdx: number;
let currentQ: BingoQuestion;
let score: number;
let diff: Difficulty;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  card = generateCard(diff);
  marked = Array.from({ length: 5 }, () => Array(5).fill(false));
  marked[2][2] = true; // FREE
  score = 0;
  numberQueue = shuffle(getAllCardNumbers(card));
  queueIdx = 0;
  show('game-screen');
  renderCard();
  nextQuestion();
}

function renderCard() {
  const grid = document.getElementById('bingo-grid')!;
  grid.innerHTML = '';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('button');
      cell.className = 'bingo-cell';
      if (r === 2 && c === 2) {
        cell.textContent = '⭐';
        cell.classList.add('free', 'marked');
      } else {
        cell.textContent = String(card.cells[r][c]);
        if (marked[r][c]) cell.classList.add('marked');
      }
      cell.onclick = () => cellClick(r, c);
      grid.appendChild(cell);
    }
  }
}

function nextQuestion() {
  if (queueIdx >= numberQueue.length) {
    endGame();
    return;
  }
  const answer = numberQueue[queueIdx];
  currentQ = generateQuestion(answer, diff);
  document.getElementById('question-text')!.textContent = currentQ.text + ' = ?';
  document.getElementById('q-count')!.textContent = `Question ${queueIdx + 1}`;
}

function cellClick(r: number, c: number) {
  if (marked[r][c]) return;
  const val = card.cells[r][c];
  if (val === currentQ.answer) {
    marked[r][c] = true;
    score++;
    playCorrect();
    renderCard();
    if (checkBingo(marked)) {
      endGame();
      return;
    }
    queueIdx++;
    nextQuestion();
  } else {
    playWrong();
    const cells = document.querySelectorAll('.bingo-cell');
    const idx = r * 5 + c;
    cells[idx].classList.add('wrong-shake');
    setTimeout(() => cells[idx].classList.remove('wrong-shake'), 500);
  }
}

function endGame() {
  const won = checkBingo(marked);
  document.getElementById('result-emoji')!.textContent = won ? '🎉' : '💪';
  document.getElementById('result-title')!.textContent = won ? 'BINGO!' : 'Game Over!';
  document.getElementById('result-sub')!.textContent = won ? `You got BINGO in ${score} correct answers!` : `${score} correct answers`;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (won) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
