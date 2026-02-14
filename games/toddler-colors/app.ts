import { COLORS, SHAPES, ANIMALS, shuffle, generateCountingAnswers, getEndResult, type ColorItem, type ShapeItem } from './logic';
import { playToddlerCorrect, playToddlerWrong, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-colors';
let _analyticsStartTime = 0;

interface ToddlerState {
  mode: string;
  round: number;
  total: number;
  correct: number;
  locked: boolean;
}

let s: ToddlerState = {} as ToddlerState;

function startGame(mode: string) {
  _analyticsStartTime = Date.now();
  trackGameStart(GAME_ID);
  s = { mode, round: 0, total: 10, correct: 0, locked: false };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  nextRound();
}

function nextRound() {
  if (s.round >= s.total) return endGame();
  s.round++;
  s.locked = false;
  
  document.getElementById('round-info')!.textContent = `${s.round}/${s.total}`;
  document.getElementById('stars')!.textContent = '⭐'.repeat(s.correct);
  
  const grid = document.getElementById('choices')!;
  grid.innerHTML = '';
  
  if (s.mode === 'colors') {
    grid.className = 'choices-grid cols-2';
    const picked = shuffle(COLORS).slice(0, 4);
    const target = picked[Math.floor(Math.random() * picked.length)];
    
    document.getElementById('prompt-text')!.textContent = 'Tap yang warna...';
    document.getElementById('prompt-target')!.textContent = target.name;
    document.getElementById('prompt-target')!.style.color = target.color;
    
    picked.forEach(c => {
      const div = document.createElement('div');
      div.className = 'choice';
      div.style.background = c.color;
      div.dataset.correct = c.name === target.name ? '1' : '0';
      div.addEventListener('click', () => handleTap(div));
      div.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(div); }, {passive:false});
      grid.appendChild(div);
    });
  }
  else if (s.mode === 'shapes') {
    grid.className = 'choices-grid cols-3';
    const picked = shuffle(SHAPES).slice(0, 6);
    const target = picked[Math.floor(Math.random() * picked.length)];
    
    document.getElementById('prompt-text')!.textContent = 'Tap yang bentuk...';
    document.getElementById('prompt-target')!.textContent = target.name;
    document.getElementById('prompt-target')!.style.color = '#333';
    
    picked.forEach(sh => {
      const div = document.createElement('div');
      div.className = 'choice';
      div.style.background = '#e3f2fd';
      div.textContent = sh.emoji;
      div.dataset.correct = sh.name === target.name ? '1' : '0';
      div.addEventListener('click', () => handleTap(div));
      div.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(div); }, {passive:false});
      grid.appendChild(div);
    });
  }
  else if (s.mode === 'count') {
    grid.className = 'choices-grid cols-2';
    const targetCount = Math.floor(Math.random() * 5) + 1;
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    
    document.getElementById('prompt-text')!.textContent = 'Ada berapa ' + animal + '?';
    const promptTarget = document.getElementById('prompt-target')!;
    promptTarget.textContent = (animal + ' ').repeat(targetCount);
    promptTarget.style.color = '#333';
    promptTarget.style.fontSize = '2rem';
    
    const answersList = generateCountingAnswers(targetCount);
    
    answersList.forEach(num => {
      const div = document.createElement('div');
      div.className = 'choice';
      div.style.background = ['#ffcdd2','#bbdefb','#c8e6c9','#fff9c4'][num % 4];
      div.textContent = String(num);
      div.style.fontSize = '4rem';
      div.style.fontWeight = '900';
      div.style.color = '#333';
      div.dataset.correct = num === targetCount ? '1' : '0';
      div.addEventListener('click', () => handleTap(div));
      div.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(div); }, {passive:false});
      grid.appendChild(div);
    });
  }
}

function handleTap(el: HTMLElement) {
  if (s.locked) return;
  s.locked = true;
  
  if (el.dataset.correct === '1') {
    el.classList.add('correct');
    s.correct++;
    celebrate();
    playToddlerCorrect();
    setTimeout(nextRound, 800);
  } else {
    el.classList.add('wrong');
    playToddlerWrong();
    setTimeout(() => { el.classList.remove('wrong'); s.locked = false; }, 500);
  }
}

function celebrate() {
  const cel = document.getElementById('celebration')!;
  cel.classList.remove('hidden');
  cel.innerHTML = '';
  const emojis = ['🌟','✨','🎉','⭐','💫','🥳'];
  for (let i = 0; i < 6; i++) {
    const span = document.createElement('span');
    span.className = 'emoji';
    span.textContent = emojis[i % emojis.length];
    span.style.left = (20 + Math.random() * 60) + '%';
    span.style.top = (30 + Math.random() * 40) + '%';
    span.style.animationDelay = (i * 0.1) + 's';
    cel.appendChild(span);
  }
  setTimeout(() => cel.classList.add('hidden'), 1200);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const result = getEndResult(s.correct, s.total);
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('big-stars')!.textContent = result.stars;
  
  playWin();
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, typeof score !== "undefined" && typeof score === "number" ? score : 0, Date.now() - _analyticsStartTime, true);
  createRatingUI(GAME_ID, document.getElementById("result") || document.getElementById("result-screen") || document.body);
  const isNew = setHighScore(GAME_ID, s.correct);
  if (isNew && s.correct > 0) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('result-title')!.after(el);
  }
  if (s.correct === s.total) showConfetti();
}

const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Skor terbaik: ${best}/10`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('.mode-btns')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
