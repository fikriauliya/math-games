import { TOTAL, genQuestion, checkAnswer, getResult, type Question } from './logic';
import { playCorrect, playWrong, playWin, playCombo, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'time-calculator';
let _start = 0, current: Question, score = 0, round = 0, streak = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _start = Date.now(); trackGameStart(GAME_ID);
  score = 0; round = 0; streak = 0;
  show('game-screen'); nextRound();
}

function updateUI() {
  document.getElementById('progress')!.textContent = `${round + 1}/${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${score}`;
}

function updateClock(timeStr: string) {
  const clock = document.getElementById('clock-display')!;
  // Extract time from question text
  const match = timeStr.match(/jam (\d+:\d+)/);
  clock.textContent = match ? match[1] : '⏰';
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = genQuestion(); updateUI();
  updateClock(current.text);
  document.getElementById('question-text')!.textContent = current.text;

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt;
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.answer);
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { score++; streak++; streak > 1 ? playCombo(streak) : playCorrect(); }
  else { streak = 0; playWrong(); document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (b.textContent === current.answer) b.classList.add('correct'); }); }
  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
}

function endGame() {
  const r = getResult(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = r.emoji;
  document.getElementById('result-title')!.textContent = r.title;
  document.getElementById('result-sub')!.textContent = r.sub;
  show('result-screen'); playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _start, true);
  createRatingUI(GAME_ID, document.getElementById('result-screen') || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;'; document.getElementById('result-title')!.after(el); }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}/${TOTAL}`; el.style.cssText = 'color:rgba(0,0,0,0.5);font-size:0.9rem;margin-top:0.5rem;'; document.querySelector('.btn-play')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;
