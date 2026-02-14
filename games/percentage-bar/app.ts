import { genQuestion, validateAnswer, getResultText, TOTAL, type Question } from './logic';
import { playCorrect, playWrong, playCombo, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';
import { Either } from 'effect';

const GAME_ID = 'percentage-bar';
let _analyticsStartTime = 0;
let score = 0, round = 0, streak = 0;
let current: Question;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0; streak = 0;
  show('game');
  nextQuestion();
}

function nextQuestion() {
  if (round >= TOTAL) return endGame();
  current = genQuestion(round);
  document.getElementById('round-num')!.textContent = `${round + 1}/${TOTAL}`;
  document.getElementById('q-text')!.textContent = current.text;

  const bar = document.getElementById('visual-bar')!;
  const fill = document.getElementById('bar-fill')!;
  if (current.type === 'visual') {
    bar.classList.remove('hidden');
    fill.style.width = `${current.barPercent}%`;
  } else {
    bar.classList.add('hidden');
  }

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = current.type === 'visual' ? `${c}%` : String(c);
    btn.onclick = () => pick(btn, c);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const result = validateAnswer(answer, current.answer);
  if (Either.isRight(result)) {
    btn.classList.add('correct');
    score++; streak++;
    streak >= 3 ? playCombo(streak) : playCorrect();
  } else {
    btn.classList.add('wrong');
    streak = 0;
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      const val = current.type === 'visual' ? `${current.answer}%` : String(current.answer);
      if (b.textContent === val) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextQuestion(); }, Either.isRight(result) ? 600 : 1200);
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
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
  document.querySelector('.big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
