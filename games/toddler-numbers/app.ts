import { EMOJIS, TOTAL, shuffle, generateAnswer, pickEmoji, generateChoices, getResultText } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-numbers';
let _analyticsStartTime = 0;
let round: number;
let score: number;
let answer: number;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  round = 0; score = 0;
  show('game-screen');
  renderStars();
  nextRound();
}

function renderStars() {
  const bar = document.getElementById('score-bar')!;
  bar.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (i < score ? ' earned' : '');
    s.textContent = '⭐';
    bar.appendChild(s);
  }
}

function nextRound() {
  if (round >= TOTAL) return endGame();
  answer = generateAnswer();
  const emoji = pickEmoji();

  const container = document.getElementById('objects')!;
  container.innerHTML = '';
  for (let i = 0; i < answer; i++) {
    const span = document.createElement('span');
    span.className = 'obj';
    span.textContent = emoji;
    span.style.animationDelay = (i * 0.1) + 's';
    container.appendChild(span);
  }

  const options = generateChoices(answer);

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  options.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(n);
    btn.onclick = () => pick(btn, n);
    choicesEl.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, val: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = val === answer;
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++;
    renderStars();
    playToddlerCorrect();
    try {
      const u = new SpeechSynthesisUtterance(String(answer));
      u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2;
      speechSynthesis.speak(u);
    } catch(e) {}
  } else {
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (Number(b.textContent) === answer) b.classList.add('correct');
    });
  }

  setTimeout(() => { round++; nextRound(); }, correct ? 1000 : 1800);
}

function endGame() {
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
  
  playWin();
  setLastPlayed(GAME_ID);
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
  el.textContent = `Skor terbaik: ${best}/${TOTAL}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
