import { genPairs, shuffle, makeCards, isMatch, getStars, formatTime as fmtTime, type Pair, type Card } from './logic';
import { playCorrect, playWrong, playWin, playClick, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'memory-math';

interface MemoryState {
  cards: Card[];
  moves: number;
  matched: number;
  total: number;
  flipped: { el: HTMLElement; idx: number }[];
  locked: boolean;
  startTime: number;
  timerInterval: ReturnType<typeof setInterval> | null;
}

let s: MemoryState = {} as MemoryState;

function startGame() {
  const size = parseInt((document.getElementById('size') as HTMLSelectElement).value);
  const pairCount = size === 4 ? 8 : 10;
  const pairs = genPairs(pairCount);
  const cards = shuffle(makeCards(pairs));
  
  s = { cards, moves: 0, matched: 0, total: pairCount, flipped: [], locked: false, startTime: Date.now(), timerInterval: null };
  
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  
  const grid = document.getElementById('grid')!;
  grid.className = `grid size-${size}`;
  grid.innerHTML = '';
  
  cards.forEach((_card, i) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.index = String(i);
    div.addEventListener('click', () => flipCard(div, i));
    grid.appendChild(div);
  });
  
  updateHUD();
  s.timerInterval = setInterval(updateTimer, 1000);
}

function flipCard(el: HTMLElement, idx: number) {
  if (s.locked || el.classList.contains('flipped') || el.classList.contains('matched')) return;
  
  playClick();
  el.classList.add('flipped');
  el.textContent = s.cards[idx].text;
  s.flipped.push({ el, idx });
  
  if (s.flipped.length === 2) {
    s.moves++;
    s.locked = true;
    const [a, b] = s.flipped;
    
    if (a.idx !== b.idx && isMatch(s.cards[a.idx], s.cards[b.idx])) {
      a.el.classList.add('matched');
      b.el.classList.add('matched');
      s.matched++;
      s.flipped = [];
      s.locked = false;
      playCorrect();
      updateHUD();
      if (s.matched === s.total) endGame();
    } else {
      playWrong();
      setTimeout(() => {
        a.el.classList.remove('flipped');
        a.el.textContent = '';
        b.el.classList.remove('flipped');
        b.el.textContent = '';
        s.flipped = [];
        s.locked = false;
      }, 800);
    }
    updateHUD();
  }
}

function updateHUD() {
  document.getElementById('moves')!.textContent = String(s.moves);
  document.getElementById('pairs')!.textContent = `${s.matched}/${s.total}`;
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - s.startTime) / 1000);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  document.getElementById('timer')!.textContent = `${min}:${String(sec).padStart(2, '0')}`;
}

function endGame() {
  clearInterval(s.timerInterval!);
  const elapsed = Math.floor((Date.now() - s.startTime) / 1000);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  
  // For memory, score = total pairs * 100 - moves * 5 (higher is better, fewer moves)
  const memScore = Math.max(0, s.total * 100 - s.moves * 5);
  
  setTimeout(() => {
    document.getElementById('game')!.classList.add('hidden');
    document.getElementById('result')!.classList.remove('hidden');
    document.getElementById('r-moves')!.textContent = String(s.moves);
    document.getElementById('r-time')!.textContent = `${min}:${String(sec).padStart(2, '0')}`;
    document.getElementById('r-stars')!.textContent = getStars(s.total, s.moves);
    
    playWin();
    setLastPlayed(GAME_ID);
    const isNew = setHighScore(GAME_ID, memScore);
    if (isNew) {
      const el = document.createElement('div');
      el.textContent = '🎉 NEW RECORD!';
      el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
      document.getElementById('r-stars')!.after(el);
    }
    // Perfect = matched all pairs with minimal moves
    if (s.moves <= s.total + 2) showConfetti();
  }, 500);
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
