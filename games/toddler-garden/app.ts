import { createPlant, waterPlant, getPlantEmoji, isFullyGrown, PLANT_TYPES, GRID_SIZE, type Plant } from './logic';
import { playPop, playToddlerCorrect, initMuteButton } from '../../lib/sounds';
import { trackGameStart } from '../../lib/analytics';

const GAME_ID = 'toddler-garden';
let plants: Plant[] = [];

function show(id: string) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id)!.classList.add('active'); }

function speak(text: string) {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'id-ID'; u.rate = 0.8; u.pitch = 1.3; speechSynthesis.speak(u); } catch {}
}

function startGame() {
  trackGameStart(GAME_ID);
  plants = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    plants.push(createPlant());
  }
  show('garden-screen');
  speak('Siram tanaman untuk membuatnya tumbuh!');
  renderGarden();
}

function renderGarden() {
  const grid = document.getElementById('garden-grid')!;
  grid.innerHTML = '';

  plants.forEach((plant, i) => {
    const pot = document.createElement('button');
    pot.className = 'plant-pot' + (isFullyGrown(plant) ? ' bloomed' : '');
    pot.innerHTML = `
      <span class="plant-emoji">${getPlantEmoji(plant)}</span>
      <span class="pot-emoji">🪴</span>
    `;
    pot.onclick = () => tapPlant(i);
    grid.appendChild(pot);
  });

  // Check if all bloomed
  const allBloomed = plants.every(p => isFullyGrown(p));
  if (allBloomed) {
    document.getElementById('garden-msg')!.textContent = '🎉 Semua bunga mekar! Ketuk untuk siram lagi!';
    speak('Wah! Semua bunga sudah mekar! Cantik sekali!');
    playToddlerCorrect();
  } else {
    const grown = plants.filter(p => isFullyGrown(p)).length;
    document.getElementById('garden-msg')!.textContent = `🌧️ Ketuk tanaman untuk menyiram! (${grown}/${GRID_SIZE} mekar)`;
  }
}

function tapPlant(index: number) {
  playPop();
  
  if (isFullyGrown(plants[index])) {
    // Reset this plant
    const plant = createPlant();
    plants[index] = plant;
    speak('Tanaman baru!');
  } else {
    plants[index] = waterPlant(plants[index]);
    const p = plants[index];

    // Show water animation
    showWaterDrop(index);

    if (p.stage === 'sprout') {
      speak('Tumbuh! Ayo siram lagi!');
    } else if (p.stage === 'flower') {
      const name = PLANT_TYPES[p.type].name;
      speak(`Wah! ${name} mekar!`);
      playToddlerCorrect();
    }
  }
  
  renderGarden();
}

function showWaterDrop(index: number) {
  const pots = document.querySelectorAll('.plant-pot');
  if (pots[index]) {
    const drop = document.createElement('span');
    drop.textContent = '💧';
    drop.style.cssText = 'position:absolute;top:-10px;font-size:1.5rem;animation:waterDrop 0.6s ease forwards;pointer-events:none;';
    (pots[index] as HTMLElement).style.position = 'relative';
    pots[index].appendChild(drop);
    setTimeout(() => drop.remove(), 600);
  }
}

initMuteButton();
(window as any).startGame = startGame;
