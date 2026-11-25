// Rush Kitchen — entry point. Wires canvas, input and the game loop.
// The game also runs headless for screenshots: ?shot=start|play|assembly|serve
// and ?seed=N stage a deterministic scene; window.__game exposes the state.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const seedParam = Number(params.get('seed'));
const seed = Number.isFinite(seedParam) ? seedParam : (Date.now() % 2147483647);

let game = createGame(seed);
let mouse = { x: CANVAS_W / 2, y: 360 };
window.__game = game;

const shot = params.get('shot');
if (shot) {
  mouse = applyShot(game, shot) || mouse;
} else {
  game.screen = 'title';
}

function canvasPos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) * (CANVAS_W / rect.width),
    y: (evt.clientY - rect.top) * (CANVAS_H / rect.height),
  };
}

canvas.addEventListener('mousemove', (evt) => { mouse = canvasPos(evt); });
canvas.addEventListener('click', (evt) => {
  const p = canvasPos(evt);
  mouse = p;
  handleClick(game, p.x, p.y);
});
window.addEventListener('keydown', (evt) => {
  if (['1', '2', '3', '4', '5', '6', '7', 's', 'S', 't', 'T', 'r', 'R', 'Enter', ' '].indexOf(evt.key) !== -1) {
    evt.preventDefault();
    handleKey(game, evt.key);
  }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateGame(game, dt);
  drawGame(ctx, game, mouse);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
