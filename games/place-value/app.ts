import { generateQuestion, checkAnswer, getResultText, TOTAL, placeLabel, type PVQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'place-value';
let _analyticsStartTime = 0;
let current: PVQuestion;
let score = 0, round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  score = 0; round = 0;
  show('game-screen');
  nextRound();
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  current = generateQuestion(round);
  document.getElementById('round-info')!.textContent = `${round + 1} / ${TOTAL}`;
  document.getElementById('score-display')!.textContent = `⭐ ${score}`;

  const numStr = current.number.toLocaleString();
  document.getElementById('big-number')!.textContent = numStr;

  const q = current.type === 'digit'
    ? `What digit is in the <b>${placeLabel(current.place)}</b> place?`
    : `What is the <b>value</b> of the digit in the <b>${placeLabel(current.place)}</b> place?`;
  document.getElementById('question-text')!.innerHTML = q;

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt.toLocaleString();
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.answer);
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { score++; playCorrect(); }
  else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent === current.answer.toLocaleString()) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 800 : 1500);
}

function endGame() {
  const result = getResultText(score, TOTAL);
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
