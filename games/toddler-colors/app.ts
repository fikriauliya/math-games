interface ColorItem { name: string; color: string; emoji: string; }
interface ShapeItem { name: string; emoji: string; svg: string; }

const COLORS: ColorItem[] = [
  { name: 'MERAH', color: '#f44336', emoji: '🔴' },
  { name: 'BIRU', color: '#2196F3', emoji: '🔵' },
  { name: 'KUNING', color: '#FFEB3B', emoji: '🟡' },
  { name: 'HIJAU', color: '#4CAF50', emoji: '🟢' },
  { name: 'ORANGE', color: '#FF9800', emoji: '🟠' },
  { name: 'UNGU', color: '#9C27B0', emoji: '🟣' },
  { name: 'PINK', color: '#E91E63', emoji: '💗' },
  { name: 'COKLAT', color: '#795548', emoji: '🟤' },
];

const SHAPES: ShapeItem[] = [
  { name: 'LINGKARAN', emoji: '⚫', svg: 'circle' },
  { name: 'BINTANG', emoji: '⭐', svg: 'star' },
  { name: 'HATI', emoji: '❤️', svg: 'heart' },
  { name: 'SEGITIGA', emoji: '🔺', svg: 'triangle' },
  { name: 'KOTAK', emoji: '⬛', svg: 'square' },
  { name: 'BULAN', emoji: '🌙', svg: 'moon' },
];

const ANIMALS = ['🐶','🐱','🐰','🐸','🐣','🐷','🐮','🦊','🐻','🐼','🐨','🦁','🐯','🐵','🐔'];

interface ToddlerState {
  mode: string;
  round: number;
  total: number;
  correct: number;
  locked: boolean;
}

let s: ToddlerState = {} as ToddlerState;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}

function startGame(mode: string) {
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
    
    const answers = new Set([targetCount]);
    while (answers.size < 4) {
      const wrong = Math.max(1, targetCount + Math.floor(Math.random() * 5) - 2);
      answers.add(wrong);
    }
    
    [...answers].sort((a,b) => a-b).forEach(num => {
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
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start(); osc.stop(ctx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc2.frequency.value = 659; osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start(); osc2.stop(ctx.currentTime + 0.2);
      }, 150);
    } catch(e) {}
    setTimeout(nextRound, 800);
  } else {
    el.classList.add('wrong');
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.value = 0.2;
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
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
  const pct = s.correct / s.total;
  document.getElementById('result-title')!.textContent = pct >= 0.8 ? '🎉 Hebat Sekali!' : pct >= 0.5 ? '⭐ Bagus!' : '💪 Coba Lagi!';
  document.getElementById('big-stars')!.textContent = pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : '⭐';
}

(window as any).startGame = startGame;
