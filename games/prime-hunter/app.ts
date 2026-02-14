import { isPrime, generateRound, calcRoundScore, getResultText, ROUNDS, type RoundConfig } from './logic';
import { playCorrect, playWrong, playWin, playPop, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'prime-hunter';
let _analyticsStartTime = 0;
let roundIdx = 0, totalScore = 0, wrongTaps = 0;
let found: number[] = [];
let currentRound: RoundConfig;
let timer: ReturnType<typeof setInterval> | null = null;
let timeLeft = 0;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  roundIdx = 0; totalScore = 0;
  show('game');
  startRound();
}

function startRound() {
  if (roundIdx >= ROUNDS.length) return endGame();
  found = []; wrongTaps = 0;
  currentRound = generateRound(roundIdx);
  timeLeft = currentRound.timeLimit;

  document.getElementById('round-label')!.textContent = `Round ${roundIdx + 1}/${ROUNDS.length}`;
  document.getElementById('timer')!.textContent = String(timeLeft);
  document.getElementById('found-count')!.textContent = `0/${currentRound.primes.length}`;

  const grid = document.getElementById('grid')!;
  grid.innerHTML = '';
  currentRound.numbers.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = String(n);
    btn.dataset.num = String(n);
    btn.onclick = () => tapNumber(btn, n);
    grid.appendChild(btn);
  });

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer')!.textContent = String(timeLeft);
    if (timeLeft <= 0) finishRound();
  }, 1000);
}

function tapNumber(btn: HTMLButtonElement, n: number) {
  if (btn.classList.contains('found') || btn.classList.contains('wrong-tap')) return;
  if (isPrime(n)) {
    btn.classList.add('found');
    found.push(n);
    playCorrect();
    document.getElementById('found-count')!.textContent = `${found.length}/${currentRound.primes.length}`;
    if (found.length === currentRound.primes.length) finishRound();
  } else {
    btn.classList.add('wrong-tap');
    wrongTaps++;
    playWrong();
    setTimeout(() => btn.classList.remove('wrong-tap'), 500);
  }
}

function finishRound() {
  if (timer) { clearInterval(timer); timer = null; }
  const missed = currentRound.primes.filter(p => !found.includes(p));
  // Highlight missed
  document.querySelectorAll<HTMLButtonElement>('.num-btn').forEach(btn => {
    const n = parseInt(btn.dataset.num!);
    if (isPrime(n) && !found.includes(n)) btn.classList.add('missed');
    btn.onclick = null;
  });
  const roundScore = calcRoundScore(found, missed, wrongTaps);
  totalScore += roundScore;

  setTimeout(() => { roundIdx++; startRound(); }, 2000);
}

function endGame() {
  const result = getResultText(totalScore);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, totalScore, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  const isNew = setHighScore(GAME_ID, totalScore);
  if (isNew && totalScore > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (totalScore >= 80) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.6);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
