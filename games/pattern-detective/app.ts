import { generatePattern, checkAnswer, calcScore, getGrade, TOTAL_ROUNDS, type PatternQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'pattern-detective';
let _analyticsStartTime = 0;
let question: PatternQuestion;
let round = 0;
let correct = 0;

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; correct = 0;
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) return endGame();
  question = generatePattern(round);
  document.getElementById('round-num')!.textContent = `${round + 1}/${TOTAL_ROUNDS}`;
  document.getElementById('score')!.textContent = String(calcScore(correct));

  const seqEl = document.getElementById('sequence')!;
  seqEl.innerHTML = '';
  question.sequence.forEach((n, i) => {
    const card = document.createElement('div');
    card.className = 'evidence-card';
    card.textContent = String(n);
    card.style.animationDelay = `${i * 0.1}s`;
    seqEl.appendChild(card);
  });
  const mystery = document.createElement('div');
  mystery.className = 'evidence-card mystery';
  mystery.textContent = '?';
  seqEl.appendChild(mystery);

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  question.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => answer(c, btn);
    choicesEl.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const isCorrect = checkAnswer(val, question.answer);

  if (isCorrect) {
    btn.classList.add('correct');
    correct++;
    playCorrect();
    document.querySelector('.mystery')!.textContent = String(question.answer);
    document.querySelector('.mystery')!.classList.add('revealed');
  } else {
    btn.classList.add('wrong');
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (parseInt(b.textContent!) === question.answer) b.classList.add('correct');
    });
  }

  document.getElementById('score')!.textContent = String(calcScore(correct));
  setTimeout(() => { round++; nextRound(); }, isCorrect ? 800 : 1500);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const score = calcScore(correct);
  const { grade, message } = getGrade(correct, TOTAL_ROUNDS);

  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = `${correct}/${TOTAL_ROUNDS}`;
  document.getElementById('r-score')!.textContent = String(score);

  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (correct === TOTAL_ROUNDS) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
