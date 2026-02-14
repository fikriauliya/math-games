import { generateQuestion, checkAnswer, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playWin, playCombo, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'unit-converter';
let currentQ: Question;
let score = 0, correct = 0, wrong = 0, streak = 0, qIdx = 0, total = 15;
let diff = 'medium', startTime = 0;

function startGame() {
  diff = (document.getElementById('diff') as HTMLSelectElement).value;
  total = parseInt((document.getElementById('qcount') as HTMLSelectElement).value);
  score = correct = wrong = streak = qIdx = 0;
  startTime = Date.now();
  trackGameStart(GAME_ID, diff);
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextQ();
}

function nextQ() {
  if (qIdx >= total) return endGame();
  currentQ = generateQuestion(diff);
  document.getElementById('category')!.textContent = currentQ.category;
  document.getElementById('conversion')!.textContent = `${currentQ.value} ${currentQ.fromUnit} = ? ${currentQ.toUnit}`;
  document.getElementById('score')!.textContent = String(score);
  document.getElementById('progress')!.textContent = `${qIdx + 1}/${total}`;
  const div = document.getElementById('choices')!;
  div.innerHTML = '';
  currentQ.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${c} ${currentQ.toUnit}`;
    btn.onclick = () => answer(c, btn);
    div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  if (checkAnswer(val, currentQ.answer)) {
    btn.classList.add('correct'); correct++; streak++;
    score += 10 * Math.min(streak, 5);
    streak >= 3 ? playCombo(streak) : playCorrect();
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (b.textContent!.startsWith(String(currentQ.answer))) b.classList.add('correct'); });
    wrong++; streak = 0; playWrong();
  }
  qIdx++;
  setTimeout(nextQ, val === currentQ.answer ? 400 : 1000);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const { grade, message } = getGrade(correct, total);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(correct);
  document.getElementById('r-wrong')!.textContent = String(wrong);
  document.getElementById('r-score')!.textContent = String(score);
  playWin(); setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - startTime, true);
  createRatingUI(GAME_ID, document.getElementById('result')!);
  if (setHighScore(GAME_ID, score)) { const el = document.createElement('div'); el.textContent = '🎉 NEW RECORD!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;margin:0.5rem 0;'; document.getElementById('r-score')!.after(el); }
  if (correct === total) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `🏆 Best: ${best}`; el.style.cssText = 'font-size:1.1rem;opacity:0.7;'; document.querySelector('.big-btn')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;
