import { EMOTIONS, TOTAL, shuffle, generateRound, checkAnswer, getResultText, type EmotionRound } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-emotions';
let _analyticsStartTime = 0;
let queue: typeof EMOTIONS;
let current: EmotionRound;
let score = 0, round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.7; u.pitch = 1.3;
    speechSynthesis.speak(u);
  } catch {}
}

function startGame() {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  queue = shuffle([...EMOTIONS, ...EMOTIONS]).slice(0, TOTAL); // repeat to get 8
  score = 0; round = 0;
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
  const target = queue[round];
  current = generateRound(target, EMOTIONS);

  speak(`Mana yang ${current.target.name}?`);
  document.getElementById('question-text')!.textContent = `Mana yang ${current.target.name}?`;

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  current.choices.forEach(emotion => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="emotion-emoji">${emotion.emoji}</span><span class="emotion-name">${emotion.name}</span>`;
    btn.onclick = () => pick(btn, emotion.name);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.target.name);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++; renderStars(); playToddlerCorrect(); speak('Benar!');
  } else {
    playToddlerWrong();
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.querySelector('.emotion-name')?.textContent === current.target.name) b.classList.add('correct');
    });
  }
  setTimeout(() => { round++; nextRound(); }, correct ? 1200 : 2000);
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
  el.style.cssText = 'color:rgba(0,0,0,0.4);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.btn-play')!.before(el);
}
initMuteButton();
(window as any).startGame = startGame;
