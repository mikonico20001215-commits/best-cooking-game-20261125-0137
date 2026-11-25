// Rush Kitchen — screenshot staging. Builds each ?shot= state through the
// same state functions normal play uses, so every staged scene is a state
// a real player can reach by clicking. Deterministic per ?seed=.

function readyItem(id) {
  const def = INGREDIENTS[id];
  return { id: id, prep: 'ready', chopLeft: 0, cook: def.grill || def.boil || 0, cookMax: Math.max(def.grill, def.boil), burned: false };
}

function rawItem(id) {
  const def = INGREDIENTS[id];
  return { id: id, prep: def.chop > 0 || def.grill > 0 || def.boil > 0 ? 'raw' : 'ready', chopLeft: def.chop, cook: 0, cookMax: Math.max(def.grill, def.boil), burned: false };
}

// Apply a ?shot= name to a fresh game. Returns the mouse position to render
// the held item at (or null).
function applyShot(g, shot) {
  if (!shot || shot === 'start') {
    g.screen = 'title';
    return null;
  }
  g.screen = 'playing';
  if (shot === 'play') {
    // Mid-game: two live orders, a tomato mid-chop, a patty on the grill,
    // cheese in hand.
    spawnOrder(g, 'salad', 42);
    spawnOrder(g, 'soup', 55);
    const tomato = rawItem('tomato');
    tomato.chopLeft = 1;
    g.board[0] = tomato;
    const patty = rawItem('patty');
    patty.cook = 3.2;
    g.grill[0] = patty;
    g.hand = readyItem('cheese');
    g.score = 120;
    return { x: 700, y: 580 };
  }
  if (shot === 'counter') {
    // Fresh order in, hand just took a tomato off the counter.
    spawnOrder(g, 'salad', 58);
    g.hand = rawItem('tomato');
    g.score = 0;
    return { x: 300, y: 250 };
  }
  if (shot === 'assembly') {
    // A burger mid-assembly: bun + cheese on the plate, lettuce in hand.
    spawnOrder(g, 'burger', 48);
    g.plate = ['bun', 'cheese'];
    g.hand = readyItem('lettuce');
    const tomato = rawItem('tomato');
    tomato.chopLeft = 0;
    tomato.prep = 'ready';
    g.board[0] = tomato;
    g.score = 260;
    g.combo = 1;
    return { x: 700, y: 580 };
  }
  if (shot === 'serve') {
    // A salad complete on the plate, matching the open order — serve glows.
    spawnOrder(g, 'salad', 31);
    g.plate = ['lettuce', 'tomato'];
    g.score = 320;
    g.combo = 2;
    g.bestCombo = 2;
    g.served = 3;
    g.flashServe = 999;
    return null;
  }
  g.screen = 'title';
  return null;
}
