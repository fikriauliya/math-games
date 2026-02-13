// Tug of War: Mathematics
const $ = id => document.getElementById(id);

let state = {
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
function genQuestion() {
  const ranges = { easy: 10, medium: 20, hard: 50 };
  const max = ranges[state.difficulty];
  const ops = state.operations;
  
  let op;
  if (ops === 'add') op = '+';
  else if (ops === 'sub') op = '−';
  else if (ops === 'mul') op = '×';
  else if (ops === 'mix') op = Math.random() < 0.5 ? '+' : '−';
  else op = ['+', '−', '×'][Math.floor(Math.random() * 3)];
  
  let a, b, answer;
  if (op === '×') {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  } else if (op === '−') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1; // ensure non-negative for easy
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  }
  
  return { text: `${a} ${op} ${b} = ?`, answer };
}

// Create numpad
function createNumpad(team) {
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

function handleInput(team, value) {
  const answerKey = `answer${team}`;
  const display = $(`answer${team}`);
  
  if (value === 'clear') {
    state[answerKey] = '';
    state[`negative${team}`] = false;
  } else if (value === 'submit') {
    checkAnswer(team);
    return;
  } else {
    if (state[answerKey].length < 4) {
      state[answerKey] += value;
    }
  }
  
  display.value = (state[`negative${team}`] ? '-' : '') + state[answerKey];
}

function checkAnswer(team) {
  const answerKey = `answer${team}`;
  const input = parseInt(state[answerKey]) || 0;
  const question = state[`question${team}`];
  const display = $(`answer${team}`);
  const panel = display.closest('.panel');
  
  if (state[answerKey] === '') return;
  
  if (input === question.answer) {
    // Correct!
    state[`score${team}`]++;
    updateScores();
    
    // Visual feedback
    display.classList.add('correct');
    panel.classList.add('flash-correct');
    setTimeout(() => {
      display.classList.remove('correct');
      panel.classList.remove('flash-correct');
    }, 300);
    
    // Move rope
    state.ropeOffset += (team === 1 ? -8 : 8);
    state.ropeOffset = Math.max(-100, Math.min(100, state.ropeOffset));
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
  
  state[answerKey] = '';
  display.value = '';
}

function newQuestion(team) {
  const q = genQuestion();
  state[`question${team}`] = q;
  $(`question${team}`).textContent = q.text;
  state[`answer${team}`] = '';
  $(`answer${team}`).value = '';
}

function updateScores() {
  $('score1').textContent = state.score1;
  $('score2').textContent = state.score2;
  $('panel-score1').textContent = state.score1;
  $('panel-score2').textContent = state.score2;
}

function updateRope() {
  const container = document.querySelector('.rope-container');
  container.style.transform = `translateX(${-state.ropeOffset * 0.5}px)`;
  
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
  state.difficulty = $('difficulty').value;
  state.operations = $('operations').value;
  state.timeLeft = parseInt($('game-time').value);
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
  
  if (state.score1 > state.score2) {
    $('winner-text').textContent = '🏆 Team 1 Wins!';
  } else if (state.score2 > state.score1) {
    $('winner-text').textContent = '🏆 Team 2 Wins!';
  } else {
    $('winner-text').textContent = "🤝 It's a Tie!";
  }
}

// Keyboard support (for testing on desktop)
document.addEventListener('keydown', (e) => {
  if (!state.gameActive) return;
  
  // Team 1: keys Q-W-E / A-S-D / Z-X-C or numpad area
  const team1Map = { 'q': '1', 'w': '2', 'e': '3', 'a': '4', 's': '5', 'd': '6', 'z': '7', 'x': '8', 'c': '9', 'v': '0' };
  const team2Map = { 'u': '1', 'i': '2', 'o': '3', 'j': '4', 'k': '5', 'l': '6', 'm': '7', ',': '8', '.': '9', 'n': '0' };
  
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
