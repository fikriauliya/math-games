import { genPairs, shuffle, makeCards, isMatch, getStars, formatTime as fmtTime, type Pair, type Card } from './logic';

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
      updateHUD();
      if (s.matched === s.total) endGame();
    } else {
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
  
  setTimeout(() => {
    document.getElementById('game')!.classList.add('hidden');
    document.getElementById('result')!.classList.remove('hidden');
    document.getElementById('r-moves')!.textContent = String(s.moves);
    document.getElementById('r-time')!.textContent = `${min}:${String(sec).padStart(2, '0')}`;
    
    document.getElementById('r-stars')!.textContent = getStars(s.total, s.moves);
  }, 500);
}

(window as any).startGame = startGame;
