import { ANIMALS, TOTAL, shuffle, checkAnswer, getOptions, getResultText, type Animal } from './logic';
let queue: Animal[];
let current: Animal;
let score: number;
let round: number;

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

  const options = getOptions(current);

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
  const correct = checkAnswer(answer, current.sound);
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
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
}

(window as any).startGame = startGame;
