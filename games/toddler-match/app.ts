import { generateRound, checkMatch, getResultText, TOTAL_ROUNDS, PAIRS_PER_ROUND, type MatchRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'toddler-match';
let currentRound: MatchRound;
let roundIdx = 0;
let score = 0;
let totalMatches = 0;
let selectedLeft: number | null = null;
let matched: Set<number> = new Set();

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2;
    speechSynthesis.speak(u);
  } catch {}
}

function startGame() {
  roundIdx = 0; score = 0; totalMatches = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (roundIdx >= TOTAL_ROUNDS) return endGame();
  currentRound = generateRound(roundIdx);
  matched = new Set();
  selectedLeft = null;

  document.getElementById('theme-name')!.textContent = currentRound.theme;
  document.getElementById('round-label')!.textContent = `${roundIdx + 1}/${TOTAL_ROUNDS}`;
  speak(`Cocokkan! ${currentRound.theme}`);

  renderBoard();
}

function renderBoard() {
  const leftCol = document.getElementById('left-col')!;
  const rightCol = document.getElementById('right-col')!;
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

  currentRound.pairs.forEach((pair, i) => {
    const btn = document.createElement('button');
    btn.className = 'match-card left-card' + (matched.has(i) ? ' matched' : '') + (selectedLeft === i ? ' selected' : '');
    btn.textContent = pair.left;
    btn.disabled = matched.has(i);
    btn.onclick = () => selectLeft(i);
    leftCol.appendChild(btn);
  });

  currentRound.shuffledRight.forEach((val, i) => {
    const btn = document.createElement('button');
    const isMatched = [...matched].some(mi => currentRound.pairs[mi].right === val);
    btn.className = 'match-card right-card' + (isMatched ? ' matched' : '');
    btn.textContent = val;
    btn.disabled = isMatched;
    btn.onclick = () => selectRight(val, btn);
    rightCol.appendChild(btn);
  });

  // Draw lines for matched pairs
  drawLines();
}

function selectLeft(idx: number) {
  if (matched.has(idx)) return;
  selectedLeft = idx;
  playClick();
  renderBoard();
}

function selectRight(val: string, btn: HTMLButtonElement) {
  if (selectedLeft === null) return;

  const isCorrect = checkMatch(selectedLeft, val, currentRound.pairs);
  totalMatches++;

  if (isCorrect) {
    matched.add(selectedLeft);
    score++;
    playToddlerCorrect();
    btn.classList.add('correct');
    speak('Benar!');
  } else {
    playToddlerWrong();
    btn.classList.add('wrong');
  }

  selectedLeft = null;

  setTimeout(() => {
    renderBoard();
    if (matched.size >= PAIRS_PER_ROUND) {
      setTimeout(() => { roundIdx++; nextRound(); }, 800);
    }
  }, 600);
}

function drawLines() {
  const svg = document.getElementById('lines-svg')!;
  svg.innerHTML = '';
  const container = document.getElementById('board')!;
  const rect = container.getBoundingClientRect();

  matched.forEach(leftIdx => {
    const rightVal = currentRound.pairs[leftIdx].right;
    const leftEl = document.querySelectorAll('.left-card')[leftIdx] as HTMLElement;
    const rightEls = document.querySelectorAll('.right-card');
    let rightEl: HTMLElement | null = null;
    rightEls.forEach(el => { if (el.textContent === rightVal) rightEl = el as HTMLElement; });

    if (leftEl && rightEl) {
      const lr = leftEl.getBoundingClientRect();
      const rr = rightEl.getBoundingClientRect();
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(lr.right - rect.left));
      line.setAttribute('y1', String(lr.top + lr.height / 2 - rect.top));
      line.setAttribute('x2', String(rr.left - rect.left));
      line.setAttribute('y2', String(rr.top + rr.height / 2 - rect.top));
      line.setAttribute('stroke', '#7c4dff');
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    }
  });
}

function endGame() {
  const total = TOTAL_ROUNDS * PAIRS_PER_ROUND;
  const result = getResultText(score, total);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');

  playWin();
  setLastPlayed(GAME_ID);
  setHighScore(GAME_ID, score);
  if (score === total) showConfetti();
}

initMuteButton();
(window as any).startGame = startGame;
