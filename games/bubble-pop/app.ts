import { COLORS, generateTarget, checkSingleMatch, checkPairMatch, calcPopScore, getResultTitle } from './logic';

interface BubbleState {
  score: number;
  popped: number;
  missed: number;
  combo: number;
  bestCombo: number;
  time: number;
  mode: string;
  target: number;
  selected: { el: HTMLElement; num: number } | null;
  spawnInterval: ReturnType<typeof setInterval> | null;
  timerInterval: ReturnType<typeof setInterval> | null;
}

let s: BubbleState = {} as BubbleState;

function startGame() {
  s = { score: 0, popped: 0, missed: 0, combo: 0, bestCombo: 0, time: 60,
    mode: (document.getElementById('mode') as HTMLSelectElement).value, target: 0, selected: null,
    spawnInterval: null, timerInterval: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  newTarget();
  s.spawnInterval = setInterval(spawnBubble, 800);
  s.timerInterval = setInterval(() => {
    s.time--;
    document.getElementById('timer')!.textContent = String(s.time);
    if (s.time <= 0) endGame();
  }, 1000);
  for (let i = 0; i < 6; i++) setTimeout(() => spawnBubble(), i * 200);
}

function newTarget() {
  s.target = generateTarget(s.mode);
  document.getElementById('target')!.textContent = String(s.target);
  s.selected = null;
}

function spawnBubble() {
  if (s.time <= 0) return;
  const area = document.getElementById('game-area')!;
  const div = document.createElement('div');
  
  let num: number;
  if (Math.random() < 0.3) {
    if (s.mode === 'single') num = s.target;
    else num = Math.floor(Math.random() * (s.target - 1)) + 1;
  } else {
    num = Math.floor(Math.random() * 20) + 1;
  }
  
  const size = 55 + Math.random() * 25;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const x = Math.random() * (window.innerWidth - size);
  const duration = 6 + Math.random() * 4;
  
  div.className = 'bubble';
  div.textContent = String(num);
  div.dataset.num = String(num);
  div.style.cssText = `width:${size}px;height:${size}px;left:${x}px;font-size:${size*0.35}px;background:${color};animation-duration:${duration}s;`;
  
  div.addEventListener('click', () => popBubble(div, num));
  div.addEventListener('touchstart', (e) => { e.preventDefault(); popBubble(div, num); }, {passive: false});
  
  area.appendChild(div);
  setTimeout(() => { if (div.parentNode) div.remove(); }, duration * 1000);
}

function popBubble(el: HTMLElement, num: number) {
  if (s.mode === 'single') {
    if (checkSingleMatch(num, s.target)) {
      el.classList.add('popped');
      s.popped++; s.combo++; s.score += calcPopScore(s.combo, 'single');
      if (s.combo > s.bestCombo) s.bestCombo = s.combo;
      showFloat(el, '+' + calcPopScore(s.combo, 'single'), '#4caf50');
      setTimeout(() => { el.remove(); newTarget(); }, 300);
    } else {
      el.classList.add('wrong-pop');
      s.missed++; s.combo = 0;
      showFloat(el, '✕', '#f44336');
      setTimeout(() => el.remove(), 300);
    }
  } else {
    if (!s.selected) {
      s.selected = { el, num };
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
    } else {
      if (checkPairMatch(s.selected.num, num, s.target)) {
        s.selected.el.classList.add('popped');
        el.classList.add('popped');
        s.popped += 2; s.combo++; s.score += calcPopScore(s.combo, 'pair');
        if (s.combo > s.bestCombo) s.bestCombo = s.combo;
        showFloat(el, '+' + calcPopScore(s.combo, 'pair'), '#4caf50');
        setTimeout(() => { s.selected!.el.remove(); el.remove(); newTarget(); }, 300);
      } else {
        s.selected.el.style.border = 'none';
        s.selected.el.style.boxShadow = '';
        s.missed++; s.combo = 0;
        showFloat(el, s.selected.num + '+' + num + '≠' + s.target, '#f44336');
        s.selected = null;
      }
    }
  }
  updateHUD();
}

function showFloat(el: HTMLElement, text: string, color: string) {
  const f = document.createElement('div');
  f.className = 'floating-text';
  f.textContent = text;
  f.style.color = color;
  f.style.left = el.style.left;
  f.style.top = el.getBoundingClientRect().top + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1000);
}

function updateHUD() {
  document.getElementById('score')!.textContent = String(s.score);
  document.getElementById('combo')!.textContent = s.combo + 'x';
}

function endGame() {
  clearInterval(s.spawnInterval!);
  clearInterval(s.timerInterval!);
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  document.getElementById('r-score')!.textContent = String(s.score);
  document.getElementById('r-popped')!.textContent = String(s.popped);
  document.getElementById('r-missed')!.textContent = String(s.missed);
  document.getElementById('r-combo')!.textContent = String(s.bestCombo);
  document.getElementById('result-title')!.textContent = getResultTitle(s.score);
}

(window as any).startGame = startGame;
