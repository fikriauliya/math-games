import { ROOMS, TOTAL, shuffle, genRound, checkAnswer, getResult, type Room } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-rooms';
let _start = 0, queue: Room[], current: Room, score = 0, round = 0;

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(`Mana ${text}?`); u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2; speechSynthesis.speak(u); } catch {}
}

function startGame() {
  _start = Date.now(); trackGameStart(GAME_ID);
  queue = shuffle([...ROOMS]).slice(0, TOTAL);
  score = 0; round = 0;
  show('game-screen'); renderStars(); nextRound();
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
  current = queue[round];
  document.getElementById('question')!.textContent = `Mana ${current.name.toUpperCase()}?`;
  speak(current.name);

  const choices = genRound(current, ROOMS);
  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  choices.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="emoji">${r.emoji}</span><span class="label">${r.name}</span>`;
    btn.onclick = () => pick(btn, r.name);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = checkAnswer(answer, current.name);
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { score++; renderStars(); playToddlerCorrect(); }
  else { playToddlerWrong(); document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (b.querySelector('.label')?.textContent === current.name) b.classList.add('correct'); }); }
  setTimeout(() => { round++; nextRound(); }, correct ? 1200 : 2000);
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
  if (isNew && score > 0) { const el = document.createElement('div'); el.textContent = '🎉 REKOR BARU!'; el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;'; document.getElementById('result-title')!.after(el); }
  if (score === TOTAL) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) { const el = document.createElement('div'); el.textContent = `Skor terbaik: ${best}/${TOTAL}`; el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;'; document.querySelector('.btn-play')?.before(el); }
initMuteButton();
(window as any).startGame = startGame;
