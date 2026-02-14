import { genQuestion, validateAnswer, calcScore, getGrade, type Difficulty, type Question } from './logic';
import { playCorrect, playWrong, playCombo, playWin, playTick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';
import { Either } from 'effect';

const GAME_ID = 'division-dash';
const GAME_TIME = 60;
let _analyticsStartTime = 0;
let diff: Difficulty = 'medium';
let score = 0, streak = 0, bestStreak = 0, correct = 0, wrong = 0, timeLeft = GAME_TIME;
let timer: ReturnType<typeof setInterval> | null = null;
let current: Question;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)!.classList.remove('hidden');
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID, diff);
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  score = 0; streak = 0; bestStreak = 0; correct = 0; wrong = 0; timeLeft = GAME_TIME;
  show('game');
  updateHUD();
  nextQuestion();
  timer = setInterval(() => {
    timeLeft--;
    playTick();
    updateHUD();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function updateHUD() {
  document.getElementById('score')!.textContent = String(score);
  document.getElementById('streak')!.textContent = `${streak}🔥`;
  document.getElementById('timer')!.textContent = String(timeLeft);
  const fill = document.getElementById('speedo-fill')!;
  fill.style.width = `${Math.min(streak / 10 * 100, 100)}%`;
}

function nextQuestion() {
  current = genQuestion(diff);
  document.getElementById('q-text')!.textContent = current.text;
  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => pick(btn, c);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const result = validateAnswer(answer, current.answer);
  if (Either.isRight(result)) {
    btn.classList.add('correct');
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    correct++;
    score += calcScore(streak, timeLeft);
    streak >= 3 ? playCombo(streak) : playCorrect();
  } else {
    btn.classList.add('wrong');
    streak = 0;
    wrong++;
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent === String(current.answer)) b.classList.add('correct');
    });
  }
  updateHUD();
  setTimeout(nextQuestion, Either.isRight(result) ? 400 : 800);
}

function endGame() {
  if (timer) { clearInterval(timer); timer = null; }
  const grade = getGrade(score, correct + wrong || 1);
  document.getElementById('grade')!.textContent = grade.grade;
  document.getElementById('grade-text')!.textContent = grade.message;
  document.getElementById('r-correct')!.textContent = String(correct);
  document.getElementById('r-wrong')!.textContent = String(wrong);
  document.getElementById('r-streak')!.textContent = String(bestStreak);
  document.getElementById('r-score')!.textContent = String(score);
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
    document.getElementById('grade-text')!.after(el);
  }
  if (correct >= 15) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `🏆 Best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
