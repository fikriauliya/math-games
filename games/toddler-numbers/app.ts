import { EMOJIS, TOTAL, shuffle, generateAnswer, pickEmoji, generateChoices, getResultText } from './logic';
let round: number;
let score: number;
let answer: number;

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
  answer = generateAnswer();
  const emoji = pickEmoji();

  const container = document.getElementById('objects')!;
  container.innerHTML = '';
  for (let i = 0; i < answer; i++) {
    const span = document.createElement('span');
    span.className = 'obj';
    span.textContent = emoji;
    span.style.animationDelay = (i * 0.1) + 's';
    container.appendChild(span);
  }

  const options = generateChoices(answer);

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
  const result = getResultText(score, TOTAL);
  document.getElementById('result-emoji')!.textContent = result.emoji;
  document.getElementById('result-title')!.textContent = result.title;
  document.getElementById('result-sub')!.textContent = result.sub;
  show('result-screen');
}

(window as any).startGame = startGame;
