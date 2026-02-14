import { generateQuestion, checkAnswer, getResultText, TOTAL, type GeoQuestion } from './logic';
import { playCorrect, playWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'geometry-shapes';
let _analyticsStartTime = 0;
let round = 0, score = 0;
let current: GeoQuestion;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

const SHAPE_EMOJIS: Record<string, string> = {
  triangle: '△', square: '◻', pentagon: '⬠', hexagon: '⬡', heptagon: '⬡', octagon: '🛑',
  rectangle: '',
};

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
  document.getElementById('question-text')!.textContent = current.text;

  const area = document.getElementById('shape-area')!;
  area.innerHTML = '';

  if (current.shape === 'rectangle' || current.shape === 'square') {
    const w = current.dimensions?.width || current.dimensions?.side || 5;
    const h = current.dimensions?.height || current.dimensions?.side || 5;
    const el = document.createElement('div');
    el.className = 'shape-rect';
    el.style.width = `${Math.min(w * 12, 160)}px`;
    el.style.height = `${Math.min(h * 12, 120)}px`;
    el.innerHTML = `<span class="dim-w">${w}</span><span class="dim-h">${h}</span>`;
    area.appendChild(el);
  } else {
    const el = document.createElement('div');
    el.className = 'shape-polygon';
    el.textContent = SHAPE_EMOJIS[current.shape] || '⬡';
    area.appendChild(el);
    const label = document.createElement('div');
    label.className = 'shape-label';
    label.textContent = current.shape;
    area.appendChild(label);
  }

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
  if (correct) { score++; playCorrect(); } else {
    playWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (Number(b.textContent) === current.answer) b.classList.add('correct');
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
