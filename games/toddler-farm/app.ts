import { ANIMALS, shuffle, type FarmAnimal } from './logic';
import { playPop, initMuteButton } from '../../lib/sounds';
import { trackGameStart } from '../../lib/analytics';

const GAME_ID = 'toddler-farm';

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.3; speechSynthesis.speak(u); } catch {}
}

function startGame() {
  trackGameStart(GAME_ID);
  show('farm-screen');
  renderFarm();
}

function renderFarm() {
  const grid = document.getElementById('farm-grid')!;
  grid.innerHTML = '';
  const animals = shuffle([...ANIMALS]);

  animals.forEach(animal => {
    const card = document.createElement('button');
    card.className = 'animal-card';
    card.innerHTML = `<span class="animal-big">${animal.emoji}</span>`;
    card.onclick = () => tapAnimal(animal, card);
    grid.appendChild(card);
  });
}

function tapAnimal(animal: FarmAnimal, card: HTMLElement) {
  playPop();
  
  // Show info popup
  const popup = document.getElementById('animal-popup')!;
  document.getElementById('popup-emoji')!.textContent = animal.emoji;
  document.getElementById('popup-name')!.textContent = animal.name;
  document.getElementById('popup-sound')!.textContent = animal.sound;
  document.getElementById('popup-fact')!.textContent = animal.fact;
  popup.classList.add('active');

  speak(`${animal.name}! ${animal.sound} ${animal.fact}`);

  // Animate card
  card.style.animation = 'none';
  requestAnimationFrame(() => card.style.animation = 'pop 0.4s ease');
}

function closePopup() {
  document.getElementById('animal-popup')!.classList.remove('active');
}

document.getElementById('popup-close')!.onclick = closePopup;
document.getElementById('animal-popup')!.onclick = (e) => {
  if ((e.target as HTMLElement).id === 'animal-popup') closePopup();
};

initMuteButton();
(window as any).startGame = startGame;
