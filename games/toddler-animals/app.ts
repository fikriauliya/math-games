interface Animal {
  emoji: string;
  name: string;
  sound: string;
  wrong: string[];
}

const ANIMALS: Animal[] = [
  { emoji: '🐄', name: 'Sapi', sound: 'Mooo!', wrong: ['Guk guk!', 'Meong!', 'Kukuruyuk!'] },
  { emoji: '🐔', name: 'Ayam', sound: 'Kukuruyuk!', wrong: ['Mooo!', 'Mbee!', 'Kwek kwek!'] },
  { emoji: '🐱', name: 'Kucing', sound: 'Meong!', wrong: ['Guk guk!', 'Cit cit!', 'Mooo!'] },
  { emoji: '🐶', name: 'Anjing', sound: 'Guk guk!', wrong: ['Meong!', 'Mooo!', 'Mbee!'] },
  { emoji: '🐸', name: 'Katak', sound: 'Koak koak!', wrong: ['Cit cit!', 'Guk guk!', 'Kukuruyuk!'] },
  { emoji: '🐑', name: 'Domba', sound: 'Mbee!', wrong: ['Mooo!', 'Guk guk!', 'Koak koak!'] },
  { emoji: '🦆', name: 'Bebek', sound: 'Kwek kwek!', wrong: ['Kukuruyuk!', 'Cit cit!', 'Meong!'] },
  { emoji: '🐦', name: 'Burung', sound: 'Cit cit!', wrong: ['Kwek kwek!', 'Koak koak!', 'Mbee!'] },
  { emoji: '🐷', name: 'Babi', sound: 'Oink oink!', wrong: ['Mooo!', 'Guk guk!', 'Mbee!'] },
  { emoji: '🦁', name: 'Singa', sound: 'Aum!', wrong: ['Guk guk!', 'Meong!', 'Mooo!'] },
];

const TOTAL = 6;
let queue: Animal[];
let current: Animal;
let score: number;
let round: number;

function shuffle<T>(a: T[]): T[] { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
  queue = shuffle([...ANIMALS]).slice(0, TOTAL);
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
  current = queue[round];
  const emojiEl = document.getElementById('animal-emoji')!;
  emojiEl.textContent = current.emoji;
  emojiEl.style.animation = 'none';
  requestAnimationFrame(() => emojiEl.style.animation = 'pop 0.4s ease');
  document.getElementById('animal-name')!.textContent = current.name;

  const wrongPick = shuffle([...current.wrong]).slice(0, 3);
  const options = shuffle([current.sound, ...wrongPick]);

  const container = document.getElementById('choices')!;
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="sound-text">${opt}</span>`;
    btn.onclick = () => pick(btn, opt);
    container.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, answer: string) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = answer === current.sound;
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++;
    renderStars();
    try {
      const u = new SpeechSynthesisUtterance(current.sound);
      u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.3;
      speechSynthesis.speak(u);
    } catch(e) {}
  } else {
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (b.textContent!.trim() === current.sound) b.classList.add('correct');
    });
  }

  setTimeout(() => { round++; nextRound(); }, correct ? 1200 : 2000);
}

function endGame() {
  const perfect = score === TOTAL;
  const good = score >= TOTAL * 0.6;
  document.getElementById('result-emoji')!.textContent = perfect ? '🏆' : good ? '🎉' : '💪';
  document.getElementById('result-title')!.textContent = perfect ? 'Hebat Sekali!' : good ? 'Bagus!' : 'Ayo Coba Lagi!';
  document.getElementById('result-sub')!.textContent = `${score} dari ${TOTAL} benar!`;
  show('result-screen');
}

(window as any).startGame = startGame;
