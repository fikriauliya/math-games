const EMOJIS = ['🍎','🍌','🌟','🐟','🦋','🌸','🎈','🍪','🐣','🍓','🧁','🐞','🌈','🎀','🍩'];
const TOTAL = 8;
let round: number;
let score: number;
let answer: number;

function shuffle<T>(a: T[]): T[] { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function startGame() {
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
  answer = Math.floor(Math.random() * 5) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const container = document.getElementById('objects')!;
  container.innerHTML = '';
  for (let i = 0; i < answer; i++) {
    const span = document.createElement('span');
    span.className = 'obj';
    span.textContent = emoji;
    span.style.animationDelay = (i * 0.1) + 's';
    container.appendChild(span);
  }

  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const n = Math.floor(Math.random() * 5) + 1;
    if (n !== answer) wrong.add(n);
  }
  const options = shuffle([answer, ...wrong]);

  const choicesEl = document.getElementById('choices')!;
  choicesEl.innerHTML = '';
  options.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(n);
    btn.onclick = () => pick(btn, n);
    choicesEl.appendChild(btn);
  });
}

function pick(btn: HTMLButtonElement, val: number) {
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  const correct = val === answer;
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    score++;
    renderStars();
    try {
      const u = new SpeechSynthesisUtterance(String(answer));
      u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.2;
      speechSynthesis.speak(u);
    } catch(e) {}
  } else {
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => {
      if (Number(b.textContent) === answer) b.classList.add('correct');
    });
  }

  setTimeout(() => { round++; nextRound(); }, correct ? 1000 : 1800);
}

function endGame() {
  const perfect = score === TOTAL;
  const good = score >= TOTAL * 0.6;
  document.getElementById('result-emoji')!.textContent = perfect ? '🏆' : good ? '🎉' : '💪';
  document.getElementById('result-title')!.textContent = perfect ? 'Pintar Sekali!' : good ? 'Bagus!' : 'Ayo Lagi!';
  document.getElementById('result-sub')!.textContent = `${score} dari ${TOTAL} benar!`;
  show('result-screen');
}

(window as any).startGame = startGame;
