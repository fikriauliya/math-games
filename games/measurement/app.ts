import { genQuestion, isCorrect, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'measurement';
const TOTAL_Q = 10;
let score = 0, correct = 0, qIdx = 0, currentQ: Question, _startTime = 0, answering = false;

function renderQuestion() {
  currentQ = genQuestion();
  answering = true;
  document.getElementById('question')!.textContent = currentQ.text;
  document.getElementById('qnum')!.textContent = String(qIdx + 1);
  document.getElementById('feedback')!.textContent = '';
  const el = document.getElementById('choices')!;
  el.innerHTML = '';
  for (const c of currentQ.choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => answer(c, btn);
    el.appendChild(btn);
  }
}

function answer(val: number, btn: HTMLButtonElement) {
  if (!answering) return;
  answering = false;
  const btns = document.querySelectorAll('.choice-btn');
  if (isCorrect(val, currentQ.answer)) {
    correct++; score += 10; playCorrect();
    btn.classList.add('correct');
    document.getElementById('feedback')!.textContent = '✅ Correct!';
  } else {
    playWrong();
    btn.classList.add('wrong');
    btns.forEach(b => { if (b.textContent === String(currentQ.answer)) b.classList.add('correct'); });
    document.getElementById('feedback')!.textContent = `❌ Answer: ${currentQ.answer}`;
  }
  document.getElementById('score')!.textContent = String(score);
  qIdx++;
  if (qIdx >= TOTAL_Q) { setTimeout(endGame, 1200); return; }
  setTimeout(renderQuestion, 1200);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const { grade, message } = getGrade(correct, TOTAL_Q);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('result-title')!.textContent = message;
  document.getElementById('r-correct')!.textContent = `${correct}/${TOTAL_Q}`;
  document.getElementById('r-score')!.textContent = String(score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _startTime, correct >= TOTAL_Q / 2);
  if (setHighScore(GAME_ID, score)) {
    const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.3rem;font-weight:900;color:#ffd700;';
    document.getElementById('r-score')!.after(el);
  }
  if (correct === TOTAL_Q) showConfetti();
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
}

function startGame() {
  _startTime = Date.now(); trackGameStart(GAME_ID);
  score = 0; correct = 0; qIdx = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  document.getElementById('result')!.classList.add('hidden');
  renderQuestion();
}

initMuteButton();
(window as any).startGame = startGame;
