interface Pair {
  equation: string;
  answer: string;
  id: number;
}

interface Card {
  text: string;
  pairId: number;
  type: string;
}

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

function genPairs(count: number): Pair[] {
  const pairs: Pair[] = [];
  const used = new Set<string>();
  while (pairs.length < count) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const ops = ['+', '−', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans: number;
    if (op === '+') ans = a + b;
    else if (op === '−') { if (a < b) continue; ans = a - b; }
    else ans = a * b;
    
    const eq = `${a} ${op} ${b}`;
    const key = eq + '=' + ans!;
    if (used.has(key)) continue;
    used.add(key);
    pairs.push({ equation: eq, answer: String(ans!), id: pairs.length });
  }
  return pairs;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  const size = parseInt((document.getElementById('size') as HTMLSelectElement).value);
  const pairCount = size === 4 ? 8 : 10;
  const pairs = genPairs(pairCount);
  
  const cards: Card[] = [];
  pairs.forEach(p => {
    cards.push({ text: p.equation, pairId: p.id, type: 'eq' });
    cards.push({ text: p.answer, pairId: p.id, type: 'ans' });
  });
  shuffle(cards);
  
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
    
    if (a.idx !== b.idx && s.cards[a.idx].pairId === s.cards[b.idx].pairId) {
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
    
    const efficiency = s.total / s.moves;
    const stars = efficiency >= 0.8 ? '⭐⭐⭐' : efficiency >= 0.5 ? '⭐⭐' : '⭐';
    document.getElementById('r-stars')!.textContent = stars;
  }, 500);
}

(window as any).startGame = startGame;
