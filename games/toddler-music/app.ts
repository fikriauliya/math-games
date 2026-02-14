import { INSTRUMENTS, TOTAL, shuffle, generateRound, checkAnswer, getResultText, type Instrument, type RoundData } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-music';
let _analyticsStartTime = 0;
let queue: Instrument[];
let round = 0, score = 0;
let currentRound: RoundData;

function show(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
}

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2;
    speechSynthesis.speak(u);
  } catch {}
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  queue = shuffle([...INSTRUMENTS]);
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
  const available = round < queue.length
    ? [queue[round], ...queue.filter((_, i) => i !== round)]
    : shuffle([...INSTRUMENTS]);
  currentRound = generateRound(available);

  document.getElementById('question')!.textContent = `Mana ${currentRound.target.name.toUpperCase()}?`;
  speak(`Mana ${currentRound.target.name}?`);

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  currentRound.choices.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'item-btn';
    btn.innerHTML = `<span class="item-emoji">${item.emoji}</span><span class="item-name">${item.name}</span>`;
    btn.onclick = () => pick(btn, item);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, item: Instrument) {
  document.querySelectorAll<HTMLButtonElement>('.item-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(item.name, currentRound.target.name);
  if (correct) {
    btn.classList.add('correct');
    score++;
    renderStars();
    playToddlerCorrect();
    speak(`Benar! Ini ${currentRound.target.name}!`);
  } else {
    btn.classList.add('wrong');
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.item-btn').forEach(b => {
      if (b.querySelector('.item-name')!.textContent === currentRound.target.name) b.classList.add('correct');
    });
    speak(`Ini ${currentRound.target.name}`);
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 1500 : 2500);
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
  createRatingUI(GAME_ID, document.getElementById('result-screen')!);
  const isNew = setHighScore(GAME_ID, score);
  if (isNew && score > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 REKOR BARU!';
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
