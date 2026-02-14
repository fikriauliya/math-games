import { generateQuestion, checkAnswer, getResultText, TOTAL, type StatQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'mean-median';
let _analyticsStartTime = 0;
let round = 0, score = 0;
let current: StatQuestion;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = generateQuestion(round);
  document.getElementById('round-num')!.textContent = String(round + 1);
  document.getElementById('score')!.textContent = String(score);
  document.getElementById('question-label')!.textContent = `What is the ${current.label}?`;
  document.getElementById('numbers-display')!.textContent = current.numbers.join(', ');

  // Bar chart
  const chart = document.getElementById('bar-chart')!;
  chart.innerHTML = '';
  const maxVal = Math.max(...current.numbers);
  current.numbers.forEach(n => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(n / maxVal) * 100}px`;
    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = String(n);
    bar.appendChild(label);
    chart.appendChild(bar);
  });

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(val);
    btn.onclick = () => pick(btn, val);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.answer);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++;
    playCorrect();
  } else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (Number(b.textContent) === current.answer) b.classList.add('correct');
    });
    // Highlight answer bar
    const bars = document.querySelectorAll('.bar');
    bars.forEach(b => b.classList.add('highlight'));
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, score, Date.now() - _analyticsStartTime, true);
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
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
