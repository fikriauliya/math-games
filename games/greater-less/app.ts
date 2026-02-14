import { generateRound, checkAnswer, getResultText, GAME_DURATION, type GLRound, type Difficulty } from './logic';
import { playCorrect, playWrong, playWin, playTick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'greater-less';
let _analyticsStartTime = 0;
let score: number, timeLeft: number, timer: any, current: GLRound, diff: Difficulty;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  diff = (document.getElementById('diff') as HTMLSelectElement).value as Difficulty;
  score = 0; timeLeft = GAME_DURATION;
  show('game-screen');
  updateHUD();
  nextRound();
  timer = setInterval(() => {
    timeLeft--;
    updateHUD();
    if (timeLeft <= 10) playTick();
    if (timeLeft <= 0) { clearInterval(timer); endGame(); }
  }, 1000);
}

function updateHUD() {
  document.getElementById('timer')!.textContent = `⏱️ ${timeLeft}s`;
  document.getElementById('score-display')!.textContent = `Score: ${score}`;
}

function nextRound() {
  current = generateRound(diff);
  document.getElementById('num-a')!.textContent = String(current.a);
  document.getElementById('num-b')!.textContent = String(current.b);
  document.querySelectorAll<HTMLButtonElement>('.answer-btn').forEach(b => {
    b.disabled = false;
    b.classList.remove('correct', 'wrong');
  });
}

function pick(answer: string) {
  const correct = checkAnswer(answer, current.answer);
  if (correct) { score++; playCorrect(); }
  else { playWrong(); }

  document.querySelectorAll<HTMLButtonElement>('.answer-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.answer === current.answer) b.classList.add('correct');
    if (b.dataset.answer === answer && !correct) b.classList.add('wrong');
  });

  updateHUD();
  setTimeout(nextRound, 400);
}

function endGame() {
  const result = getResultText(score);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (score >= 30) showConfetti();
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
(window as any).pick = pick;
