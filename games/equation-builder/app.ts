import { generatePuzzle, checkEquation, calcScore, getGrade, TOTAL_ROUNDS, type Puzzle } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'equation-builder';

let puzzle: Puzzle;
let round = 0;
let correct = 0;
let selectedNum: number | null = null;
let selectedOp: string | null = null;
let slotA: number | null = null;
let slotOp: string | null = null;
let slotB: number | null = null;

function startGame() {
  round = 0;
  correct = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  puzzle = generatePuzzle(round);
  slotA = null; slotOp = null; slotB = null;
  selectedNum = null; selectedOp = null;

  document.getElementById('target')!.textContent = String(puzzle.target);
  document.getElementById('round-num')!.textContent = `${round + 1}/${TOTAL_ROUNDS}`;
  renderSlots();
  renderParts();
}

function renderSlots() {
  document.getElementById('slot-a')!.textContent = slotA !== null ? String(slotA) : '?';
  document.getElementById('slot-a')!.className = 'slot' + (slotA !== null ? ' filled' : '');
  document.getElementById('slot-op')!.textContent = slotOp || '○';
  document.getElementById('slot-op')!.className = 'slot op-slot' + (slotOp ? ' filled' : '');
  document.getElementById('slot-b')!.textContent = slotB !== null ? String(slotB) : '?';
  document.getElementById('slot-b')!.className = 'slot' + (slotB !== null ? ' filled' : '');
}

function renderParts() {
  const numsDiv = document.getElementById('numbers')!;
  numsDiv.innerHTML = '';
  puzzle.numbers.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'part-btn num-btn';
    btn.textContent = String(n);
    btn.onclick = () => placeNumber(n);
    numsDiv.appendChild(btn);
  });

  const opsDiv = document.getElementById('operators')!;
  opsDiv.innerHTML = '';
  puzzle.operators.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'part-btn op-btn';
    btn.textContent = op;
    btn.onclick = () => placeOp(op);
    opsDiv.appendChild(btn);
  });
}

function placeNumber(n: number) {
  if (slotA === null) { slotA = n; }
  else if (slotB === null) { slotB = n; }
  else { slotA = n; slotB = null; }
  renderSlots();
  tryCheck();
}

function placeOp(op: string) {
  slotOp = op;
  renderSlots();
  tryCheck();
}

function tryCheck() {
  if (slotA === null || slotOp === null || slotB === null) return;

  const isCorrect = checkEquation(slotA, slotOp, slotB, puzzle.target);
  const slotsEl = document.getElementById('equation')!;

  if (isCorrect) {
    slotsEl.classList.add('correct-eq');
    correct++;
    playCorrect();
  } else {
    slotsEl.classList.add('wrong-eq');
    playWrong();
  }

  document.getElementById('score')!.textContent = String(calcScore(correct, round + 1));

  setTimeout(() => {
    slotsEl.classList.remove('correct-eq', 'wrong-eq');
    round++;
    nextRound();
  }, isCorrect ? 800 : 1200);
}

function clearSlots() {
  slotA = null; slotOp = null; slotB = null;
  renderSlots();
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const score = calcScore(correct, TOTAL_ROUNDS);
  const { grade, message } = getGrade(correct, TOTAL_ROUNDS);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(correct);
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (correct === TOTAL_ROUNDS) showConfetti();
}

// Clear button
document.getElementById('clear-btn')?.addEventListener('click', clearSlots);

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
