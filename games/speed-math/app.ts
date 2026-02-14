interface Question {
  text: string;
  answer: number;
  choices: number[];
}

interface GameState {
  score: number;
  correct: number;
  wrong: number;
  streak: number;
  bestStreak: number;
  qIdx: number;
  diff: string;
  total: number;
  currentQ: Question | null;
}

let state: GameState = { score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, qIdx: 0, diff: 'medium', total: 20, currentQ: null };

function genQ(diff: string): Question {
  const max: Record<string, number> = { easy: 10, medium: 20, hard: 50 };
  const ops = diff === 'easy' ? ['+'] : diff === 'medium' ? ['+', '−'] : ['+', '−', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, ans: number;
  if (op === '×') { a = Math.floor(Math.random()*12)+1; b = Math.floor(Math.random()*12)+1; ans = a*b; }
  else if (op === '−') { a = Math.floor(Math.random()*max[diff])+1; b = Math.floor(Math.random()*a)+1; ans = a-b; }
  else { a = Math.floor(Math.random()*max[diff])+1; b = Math.floor(Math.random()*max[diff])+1; ans = a+b; }
  
  const choices = new Set([ans]);
  while (choices.size < 4) {
    const wrong = ans + Math.floor(Math.random()*10) - 5;
    if (wrong !== ans && wrong >= 0) choices.add(wrong);
  }
  return { text: `${a} ${op} ${b} = ?`, answer: ans, choices: [...choices].sort((a,b) => a-b) };
}

function startGame() {
  state = { score: 0, correct: 0, wrong: 0, streak: 0, bestStreak: 0, qIdx: 0,
    diff: (document.getElementById('diff') as HTMLSelectElement).value,
    total: parseInt((document.getElementById('qcount') as HTMLSelectElement).value),
    currentQ: null };
  document.getElementById('start')!.classList.add('hidden');
  document.getElementById('game')!.classList.remove('hidden');
  const lanes = document.getElementById('lanes')!;
  lanes.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'lane-line';
    line.style.top = (i * 60) + 'px';
    line.style.animationDelay = (i * -0.15) + 's';
    lanes.appendChild(line);
  }
  nextQ();
}

function nextQ() {
  if (state.qIdx >= state.total) return endGame();
  const q = genQ(state.diff);
  state.currentQ = q;
  document.getElementById('q-text')!.textContent = q.text;
  document.getElementById('left')!.textContent = String(state.total - state.qIdx);
  
  const div = document.getElementById('choices')!;
  div.innerHTML = '';
  q.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = String(c);
    btn.onclick = () => answer(c, btn);
    div.appendChild(btn);
  });
}

function answer(val: number, btn: HTMLButtonElement) {
  const correct = val === state.currentQ!.answer;
  document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => b.onclick = null);
  
  if (correct) {
    btn.classList.add('correct');
    state.correct++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    const bonus = Math.min(state.streak, 5);
    state.score += 10 * bonus;
    if (state.streak >= 3) showCombo(state.streak);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (parseInt(b.textContent!) === state.currentQ!.answer) b.classList.add('correct'); });
    state.wrong++;
    state.streak = 0;
  }
  
  document.getElementById('score')!.textContent = String(state.score);
  document.getElementById('streak')!.textContent = state.streak + '🔥';
  document.getElementById('streak-fill')!.style.width = Math.min(state.streak / 10 * 100, 100) + '%';
  
  const car = document.getElementById('car')!;
  car.style.left = correct ? (30 + Math.random() * 40) + '%' : '50%';
  
  state.qIdx++;
  setTimeout(nextQ, correct ? 400 : 1000);
}

function showCombo(n: number) {
  const el = document.getElementById('combo')!;
  el.textContent = `${n}x COMBO! 🔥`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 800);
}

function endGame() {
  document.getElementById('game')!.classList.add('hidden');
  document.getElementById('result')!.classList.remove('hidden');
  const pct = state.correct / state.total * 100;
  const grade = pct >= 95 ? 'S' : pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = pct >= 90 ? '🏆 AMAZING!' : pct >= 70 ? '⭐ Great Job!' : '💪 Keep Practicing!';
  document.getElementById('r-correct')!.textContent = String(state.correct);
  document.getElementById('r-wrong')!.textContent = String(state.wrong);
  document.getElementById('r-streak')!.textContent = String(state.bestStreak);
  document.getElementById('r-score')!.textContent = String(state.score);
}

// Expose to global for onclick handlers
(window as any).startGame = startGame;
