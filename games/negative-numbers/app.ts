import { TOTAL, genQuestion, checkAnswer, getResult, type Question } from './logic';
import { playCorrect, playWrong, playWin, playCombo, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'negative-numbers';
let _start = 0;
let current: Question;
let score = 0;
let round = 0;
let streak = 0;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function startGame() {
  _start = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0; streak = 0;
  updateProgress();
  show('game-screen');
  nextRound();
}

function updateProgress() {
  document.getElementById('progress')!.textContent = `${round + 1}/${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${score}`;
}

function updateNumberLine(answer: number | string) {
  const line = document.getElementById('number-line')!;
  line.innerHTML = '';
  for (let i = -20; i <= 20; i++) {
    const tick = document.createElement('span');
    tick.className = 'tick' + (i === 0 ? ' zero' : '') + (i < 0 ? ' negative' : '') + (i === answer ? ' highlight' : '');
    tick.textContent = i % 5 === 0 ? String(i) : '·';
    line.appendChild(tick);
  }
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = genQuestion();
  document.getElementById('question-text')!.textContent = current.text;
  if (typeof current.answer === 'number') updateNumberLine(current.answer);
  updateProgress();

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(opt);
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number | string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.answer);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++; streak++;
    streak > 1 ? playCombo(streak) : playCorrect();
  } else {
    streak = 0;
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (String(b.textContent) === String(current.answer)) b.classList.add('correct');
    });
  }

  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
}

function endGame() {
  const result = getResult(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}/${TOTAL}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')?.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
