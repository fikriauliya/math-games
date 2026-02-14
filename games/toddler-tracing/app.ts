import { pickChar, checkTrace, getEndResult, type TracingChar } from './logic';
import { playToddlerCorrect, playToddlerWrong, playClick, initMuteButton } from '../../lib/sounds';
import { setLastPlayed } from '../../lib/storage';
import { showConfetti } from '../../lib/confetti';
import { trackGameStart, trackGameEnd, createRatingUI } from '../../lib/analytics';

const GAME_ID = 'toddler-tracing';
const THRESHOLD = 0.12;
let _startTime = 0;
let currentChar: TracingChar;
let traced: { x: number; y: number }[] = [];
let isDrawing = false;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const charName = document.getElementById('char-name')!;
const feedback = document.getElementById('feedback')!;

function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID'; u.rate = 0.8;
  speechSynthesis.speak(u);
}

function drawGuide() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const pts = currentChar.points;
  for (let i = 0; i < pts.length; i++) {
    const x = pts[i].x * canvas.width, y = pts[i].y * canvas.height;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  // Draw dots
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,67,54,0.5)';
    ctx.fill();
  }
}

function drawTraced() {
  if (traced.length < 2) return;
  ctx.strokeStyle = '#e91e63';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(traced[0].x * canvas.width, traced[0].y * canvas.height);
  for (let i = 1; i < traced.length; i++) {
    ctx.lineTo(traced[i].x * canvas.width, traced[i].y * canvas.height);
  }
  ctx.stroke();
}

function getPos(e: MouseEvent | Touch): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; traced.push(getPos(e)); });
canvas.addEventListener('mousemove', (e) => { if (!isDrawing) return; traced.push(getPos(e)); drawGuide(); drawTraced(); });
canvas.addEventListener('mouseup', () => { isDrawing = false; });

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; traced.push(getPos(e.touches[0])); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!isDrawing) return; traced.push(getPos(e.touches[0])); drawGuide(); drawTraced(); }, { passive: false });
canvas.addEventListener('touchend', () => { isDrawing = false; });

function loadChar() {
  currentChar = pickChar();
  traced = [];
  feedback.textContent = '';
  charName.textContent = currentChar.name;
  drawGuide();
  speak(`Jiplak ${currentChar.name}`);
}

document.getElementById('clear-btn')!.addEventListener('click', () => {
  playClick(); traced = []; drawGuide(); feedback.textContent = '';
});

document.getElementById('check-btn')!.addEventListener('click', () => {
  const accuracy = checkTrace(traced, currentChar, THRESHOLD);
  const result = getEndResult(accuracy);
  feedback.textContent = `${result.stars} ${result.title}`;
  if (accuracy >= 0.7) {
    playToddlerCorrect(); showConfetti();
    speak('Hebat sekali!');
  } else if (accuracy >= 0.4) {
    playToddlerCorrect();
    speak('Bagus!');
  } else {
    playToddlerWrong();
    speak('Coba lagi ya!');
  }
  setLastPlayed(GAME_ID);
  trackGameEnd(GAME_ID, Math.round(accuracy * 100), Date.now() - _startTime, accuracy >= 0.4);
});

document.getElementById('next-btn')!.addEventListener('click', () => {
  playClick(); loadChar();
});

function startGame() {
  _startTime = Date.now();
  trackGameStart(GAME_ID);
  loadChar();
  createRatingUI(GAME_ID, document.getElementById('rating-container')!);
}

initMuteButton();
startGame();
(window as any).startGame = startGame;
