import { generateBond, checkPair, calcScore, isPerfect, getGrade, type Bond } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'number-bond';
let bond: Bond;
let selected: number | null = null;
let selectedBtn: HTMLButtonElement | null = null;
let found = 0;
let startTime = 0;
let timeLeft = 60;
let timer: ReturnType<typeof setInterval>;

function startGame() {
  const diff = (document.getElementById('diff') as HTMLSelectElement).value;
  bond = generateBond(diff);
  found = 0;
  selected = null;
  selectedBtn = null;
  startTime = Date.now();
  timeLeft = 60;
  trackGameStart(GAME_ID, diff);

  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('target')!.textContent = String(bond.target);
  document.getElementById('found')!.textContent = '0';
  document.getElementById('total')!.textContent = String(bond.pairs.length);

  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  bond.numbers.forEach((n, i) => {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = String(n);
    btn.dataset.index = String(i);
    btn.onclick = () => pick(n, btn);
    grid.appendChild(btn);
  });

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('time')!.textContent = String(timeLeft);
    if (timeLeft <= 0) endGame();
  }, 1000);
  document.getElementById('time')!.textContent = '60';
}

function pick(n: number, btn: HTMLButtonElement) {
  if (btn.disabled) return;
  if (selected === null) {
    selected = n;
    selectedBtn = btn;
    btn.classList.add('selected');
  } else {
    if (btn === selectedBtn) {
      btn.classList.remove('selected');
      selected = null;
      selectedBtn = null;
      return;
    }
    if (checkPair(selected, n, bond.target)) {
      playCorrect();
      btn.classList.add('matched');
      selectedBtn!.classList.add('matched');
      btn.disabled = true;
      selectedBtn!.disabled = true;
      found++;
      document.getElementById('found')!.textContent = String(found);
      if (found >= bond.pairs.length) endGame();
    } else {
      playWrong();
      btn.classList.add('shake');
      selectedBtn!.classList.add('shake');
      setTimeout(() => {
        btn.classList.remove('shake');
        selectedBtn?.classList.remove('shake');
      }, 400);
    }
    selectedBtn?.classList.remove('selected');
    selected = null;
    selectedBtn = null;
  }
}

function endGame() {
  clearInterval(timer);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');

  const score = calcScore(found, bond.pairs.length, Math.max(0, timeLeft));
  const { grade, message } = getGrade(found, bond.pairs.length);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-found')!.textContent = `${found}/${bond.pairs.length}`;
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, found >= bond.pairs.length);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (isPerfect(found, bond.pairs.length)) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}`;
  el.style.cssText = 'font-size:1.1rem;opacity:0.7;';
  document.querySelector('.big-btn')?.before(el);
}
initMuteButton();
(window as any).startGame = startGame;
