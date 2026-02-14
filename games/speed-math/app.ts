import { genQ, calcScore, getGrade, type Question } from './logic';
import { playCorrect, playWrong, playCombo, playWin, initMuteButton } from '../../lib/sounds';
import { getHighScore, setHighScore, setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';

const GAME_ID = 'speed-math';

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
    state.score += calcScore(state.streak);
    if (state.streak >= 3) {
      showCombo(state.streak);
      playCombo(state.streak);
    } else {
      playCorrect();
    }
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll<HTMLButtonElement>('.choice-btn').forEach(b => { if (parseInt(b.textContent!) === state.currentQ!.answer) b.classList.add('correct'); });
    state.wrong++;
    state.streak = 0;
    playWrong();
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
  const { grade, message } = getGrade(state.correct, state.total);
  document.getElementById('grade')!.textContent = grade;
  document.getElementById('grade-text')!.textContent = message;
  document.getElementById('r-correct')!.textContent = String(state.correct);
  document.getElementById('r-wrong')!.textContent = String(state.wrong);
  document.getElementById('r-streak')!.textContent = String(state.bestStreak);
  document.getElementById('r-score')!.textContent = String(state.score);
  
  playWin();
  setLastPlayed(GAME_ID);
  const isNew = setHighScore(GAME_ID, state.score);
  if (isNew) {
    const el = document.createElement('div');
    el.textContent = '🎉 NEW RECORD!';
    el.style.cssText = 'font-size:1.5rem;font-weight:900;color:#ffd700;animation:pulse 0.5s infinite alternate;margin:0.5rem 0;';
    document.getElementById('r-score')!.after(el);
  }
  if (state.correct === state.total) showConfetti();
}

// Show high score on start screen
const best = getHighScore(GAME_ID);
if (best > 0) {
  const el = document.createElement('div');
  el.textContent = `Your best: ${best}`;
  el.style.cssText = 'color:rgba(255,255,255,0.7);font-size:0.9rem;margin-top:0.5rem;';
  document.querySelector('#start .big-btn')!.before(el);
}

initMuteButton();
(window as any).startGame = startGame;
