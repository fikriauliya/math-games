// Tug of War: Mathematics
import { genQuestion as _genQuestion, clampRopeOffset, calcRopeOffset, determineWinner, formatTime, type Question } from './logic';

const $ = (id: string) => document.getElementById(id)!;

interface GameState {
  score1: number;
  score2: number;
  answer1: string;
  answer2: string;
  question1: Question | null;
  question2: Question | null;
  timeLeft: number;
  timer: ReturnType<typeof setInterval> | null;
  ropeOffset: number;
  difficulty: string;
  operations: string;
  gameActive: boolean;
  negative1: boolean;
  negative2: boolean;
}

let state: GameState = {
  score1: 0, score2: 0,
  answer1: '', answer2: '',
  question1: null, question2: null,
  timeLeft: 90, timer: null,
  ropeOffset: 0, // -100 to 100, negative = team1 winning
  difficulty: 'medium',
  operations: 'mix',
  gameActive: false,
  negative1: false, negative2: false,
};

// Generate question
function genQuestion(): Question {
  return _genQuestion(state.difficulty, state.operations);
}

// Create numpad
function createNumpad(team: number) {
  const pad = $(`numpad${team}`);
  pad.innerHTML = '';
  
  const buttons = [
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' },
    { label: '✕', value: 'clear', cls: 'clear' },
    { label: '0', value: '0' },
    { label: '✓', value: 'submit', cls: 'submit' },
  ];
  
  buttons.forEach(b => {
    const btn = document.createElement('button');
    btn.className = `num-btn ${b.cls || ''}`;
    btn.textContent = b.label;
    btn.dataset.value = b.value;
    btn.dataset.team = team;
    
    // Use both touch and click
    const handler = (e) => {
      e.preventDefault();
      if (!state.gameActive) return;
      handleInput(team, b.value);
    };
    btn.addEventListener('touchstart', handler, { passive: false });
    btn.addEventListener('mousedown', handler);
    
    pad.appendChild(btn);
  });
}

function handleInput(team: number, value: string) {
  const answerKey = `answer${team}` as keyof GameState;
  const display = $(`answer${team}`) as HTMLInputElement;
  
  if (value === 'clear') {
    (state as any)[answerKey] = '';
    (state as any)[`negative${team}`] = false;
  } else if (value === 'submit') {
    checkAnswer(team);
    return;
  } else {
    if (((state as any)[answerKey] as string).length < 4) {
      (state as any)[answerKey] += value;
    }
  }
  
  display.value = ((state as any)[`negative${team}`] ? '-' : '') + (state as any)[answerKey];
}

function checkAnswer(team: number) {
  const answerKey = `answer${team}` as keyof GameState;
  const input = parseInt((state as any)[answerKey]) || 0;
  const question = (state as any)[`question${team}`] as Question;
  const display = $(`answer${team}`) as HTMLInputElement;
  const panel = display.closest('.panel') as HTMLElement;
  
  if ((state as any)[answerKey] === '') return;
  
  if (input === question.answer) {
    // Correct!
    (state as any)[`score${team}`]++;
    updateScores();
    
    // Visual feedback
    display.classList.add('correct');
    panel.classList.add('flash-correct');
    setTimeout(() => {
      display.classList.remove('correct');
      panel.classList.remove('flash-correct');
    }, 300);
    
    // Move rope
    state.ropeOffset = calcRopeOffset(state.ropeOffset, team);
    updateRope();
    
    // Animate pull
    const chars = $(`team${team}-chars`);
    chars.querySelectorAll('.character').forEach(c => {
      c.classList.add('pulling');
      setTimeout(() => c.classList.remove('pulling'), 300);
    });
    
    // New question
    newQuestion(team);
  } else {
    // Wrong!
    display.classList.add('wrong');
    panel.classList.add('flash-wrong');
    setTimeout(() => {
      display.classList.remove('wrong');
      panel.classList.remove('flash-wrong');
    }, 300);
  }
  
  (state as any)[answerKey] = '';
  display.value = '';
}

function newQuestion(team: number) {
  const q = genQuestion();
  (state as any)[`question${team}`] = q;
  $(`question${team}`).textContent = q.text;
  (state as any)[`answer${team}`] = '';
  ($(`answer${team}`) as HTMLInputElement).value = '';
}

function updateScores() {
  $('score1').textContent = state.score1;
  $('score2').textContent = state.score2;
  $('panel-score1').textContent = state.score1;
  $('panel-score2').textContent = state.score2;
}

function updateRope() {
  const container = document.querySelector('.rope-container');
  (container as HTMLElement).style.transform = `translateX(${-state.ropeOffset * 0.5}px)`;
  
  // Move flag
  const flag = $('flag');
  flag.style.left = `${50 + state.ropeOffset * 0.3}%`;
}

function updateTimer() {
  state.timeLeft--;
  const min = Math.floor(state.timeLeft / 60);
  const sec = state.timeLeft % 60;
  $('timer').textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  
  if (state.timeLeft <= 10) {
    $('timer').parentElement.style.animation = 'pulse 0.5s infinite alternate';
  }
  
  if (state.timeLeft <= 0) {
    endGame();
  }
}

function startGame() {
  state.difficulty = ($('difficulty') as HTMLSelectElement).value;
  state.operations = ($('operations') as HTMLSelectElement).value;
  state.timeLeft = parseInt(($('game-time') as HTMLSelectElement).value);
  state.score1 = 0;
  state.score2 = 0;
  state.answer1 = '';
  state.answer2 = '';
  state.ropeOffset = 0;
  state.gameActive = true;
  
  $('start-screen').classList.add('hidden');
  $('result-screen').classList.add('hidden');
  $('game-screen').classList.remove('hidden');
  
  createNumpad(1);
  createNumpad(2);
  newQuestion(1);
  newQuestion(2);
  updateScores();
  updateRope();
  
  const min = Math.floor(state.timeLeft / 60);
  const sec = state.timeLeft % 60;
  $('timer').textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  $('timer').parentElement.style.animation = '';
  
  state.timer = setInterval(updateTimer, 1000);
}

function endGame() {
  state.gameActive = false;
  clearInterval(state.timer);
  
  $('game-screen').classList.add('hidden');
  $('result-screen').classList.remove('hidden');
  
  $('final-score1').textContent = state.score1;
  $('final-score2').textContent = state.score2;
  
  $('winner-text').textContent = determineWinner(state.score1, state.score2);
}

// Keyboard support (for testing on desktop)
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!state.gameActive) return;
  
  // Team 1: keys Q-W-E / A-S-D / Z-X-C or numpad area
  const team1Map: Record<string, string> = { 'q': '1', 'w': '2', 'e': '3', 'a': '4', 's': '5', 'd': '6', 'z': '7', 'x': '8', 'c': '9', 'v': '0' };
  const team2Map: Record<string, string> = { 'u': '1', 'i': '2', 'o': '3', 'j': '4', 'k': '5', 'l': '6', 'm': '7', ',': '8', '.': '9', 'n': '0' };
  
  const key = e.key.toLowerCase();
  
  if (team1Map[key]) handleInput(1, team1Map[key]);
  else if (key === 'r') handleInput(1, 'clear');
  else if (key === 'f' || key === 'g') handleInput(1, 'submit');
  
  else if (team2Map[key]) handleInput(2, team2Map[key]);
  else if (key === 'p') handleInput(2, 'clear');
  else if (key === ';' || key === "'") handleInput(2, 'submit');
});

// Event listeners
$('start-btn').addEventListener('click', startGame);
$('replay-btn').addEventListener('click', () => {
  $('result-screen').classList.add('hidden');
  $('start-screen').classList.remove('hidden');
});
