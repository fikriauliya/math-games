interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; rotation: number; rotSpeed: number;
  life: number;
}

const COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6eb4','#a855f7','#f97316'];

export function showConfetti(duration = 2500) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const c = canvas.getContext('2d')!;
  
  const particles: Particle[] = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width * Math.random(),
      y: canvas.height * 0.3 * Math.random() - canvas.height * 0.1,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -8 + 2,
      size: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }

  const start = performance.now();
  function frame(now: number) {
    const elapsed = now - start;
    if (elapsed > duration) { canvas.remove(); return; }
    const progress = elapsed / duration;
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.vy += 0.15; // gravity
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life = Math.max(0, 1 - progress);

      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.life;
      c.fillStyle = p.color;
      c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      c.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
