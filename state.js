// Rush Kitchen — game state and rules. No DOM, no canvas here: pure logic,
// so it can be driven by input, by the screenshot stager, or by a test.

// Seeded RNG (mulberry32) so a ?seed= run is deterministic.
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function unlockedRecipes(day) {
  return RECIPES.filter((r) => r.unlockDay <= day);
}

function createGame(seed) {
  const g = {
    screen: 'title', // title | playing | over
    seed: seed,
    rng: makeRng(seed),
    time: 0,
    day: 1,
    score: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    strikes: 0,
    orders: [], // {id, recipeId, timeLeft, timeMax}
    nextOrderId: 1,
    spawnTimer: 2.5,
    hand: null, // {id, prep:'raw'|'ready', chopLeft, cook, cookMax, burned}
    board: [null, null], // chopping board slots
    grill: [null, null],
    pot: [null],
    plate: [], // ingredient ids, ready only
    toast: null, // {text, t, good}
    shake: 0,
    flashServe: 0,
  };
  return g;
}

function showToast(g, text, good) {
  g.toast = { text: text, t: 2.2, good: !!good };
}

function takeIngredient(g, id) {
  if (g.screen !== 'playing') return false;
  if (g.hand) { showToast(g, 'Hands full — place it first', false); return false; }
  const def = INGREDIENTS[id];
  g.hand = {
    id: id,
    prep: def.chop > 0 || def.grill > 0 || def.boil > 0 ? 'raw' : 'ready',
    chopLeft: def.chop,
    cook: 0,
    cookMax: Math.max(def.grill, def.boil),
    burned: false,
  };
  return true;
}

// --- stations ---------------------------------------------------------------

function placeOnBoard(g, slot) {
  if (!g.hand || g.board[slot]) return false;
  const def = INGREDIENTS[g.hand.id];
  if (def.chop <= 0) { showToast(g, def.name + ' needs no chopping', false); return false; }
  g.board[slot] = g.hand;
  g.hand = null;
  return true;
}

function chopBoard(g, slot) {
  const item = g.board[slot];
  if (!item) return false;
  item.chopLeft -= 1;
  if (item.chopLeft <= 0) item.prep = 'ready';
  return true;
}

function takeFromBoard(g, slot) {
  const item = g.board[slot];
  if (!item || g.hand) return false;
  g.board[slot] = null;
  g.hand = item;
  return true;
}

function placeOnGrill(g, slot) {
  if (!g.hand || g.grill[slot]) return false;
  if (INGREDIENTS[g.hand.id].grill <= 0) { showToast(g, INGREDIENTS[g.hand.id].name + ' does not grill', false); return false; }
  g.grill[slot] = g.hand;
  g.hand = null;
  return true;
}

function takeFromGrill(g, slot) {
  const item = g.grill[slot];
  if (!item || g.hand) return false;
  if (item.prep !== 'ready') { showToast(g, 'Still cooking…', false); return false; }
  g.grill[slot] = null;
  g.hand = item;
  return true;
}

function placeOnPot(g) {
  if (!g.hand || g.pot[0]) return false;
  if (INGREDIENTS[g.hand.id].boil <= 0) { showToast(g, INGREDIENTS[g.hand.id].name + ' does not boil', false); return false; }
  g.pot[0] = g.hand;
  g.hand = null;
  return true;
}

function takeFromPot(g) {
  const item = g.pot[0];
  if (!item || g.hand) return false;
  if (item.prep !== 'ready') { showToast(g, 'Still boiling…', false); return false; }
  g.pot[0] = null;
  g.hand = item;
  return true;
}

function trashHeld(g) {
  if (!g.hand) return false;
  g.hand = null;
  return true;
}

function clearPlate(g) {
  if (g.plate.length === 0) return false;
  g.plate = [];
  return true;
}

// --- plate and serving ------------------------------------------------------

function addToPlate(g) {
  if (!g.hand) return false;
  if (g.hand.prep !== 'ready') {
    const def = INGREDIENTS[g.hand.id];
    showToast(g, def.name + ' is not ready yet', false);
    return false;
  }
  if (g.plate.indexOf(g.hand.id) !== -1) { showToast(g, 'Already on the plate', false); return false; }
  g.plate.push(g.hand.id);
  g.hand = null;
  return true;
}

function plateMatches(g, recipeId) {
  const need = RECIPE_BY_ID[recipeId].needs.slice().sort();
  const have = g.plate.slice().sort();
  if (need.length !== have.length) return false;
  for (let i = 0; i < need.length; i++) if (need[i] !== have[i]) return false;
  return true;
}

function servePlate(g) {
  if (g.screen !== 'playing' || g.plate.length === 0) return false;
  for (let i = 0; i < g.orders.length; i++) {
    const order = g.orders[i];
    if (plateMatches(g, order.recipeId)) {
      const recipe = RECIPE_BY_ID[order.recipeId];
      const timeBonus = Math.round(50 * (order.timeLeft / order.timeMax));
      const comboBonus = Math.round(recipe.value * 0.1 * g.combo);
      const gained = recipe.value + timeBonus + comboBonus;
      g.score += gained;
      g.combo += 1;
      if (g.combo > g.bestCombo) g.bestCombo = g.combo;
      g.served += 1;
      g.orders.splice(i, 1);
      g.plate = [];
      g.flashServe = 0.4;
      showToast(g, 'Served ' + recipe.name + '! +' + gained, true);
      return true;
    }
  }
  g.shake = 0.35;
  showToast(g, 'No order matches this plate', false);
  return false;
}

// --- orders, days, update ---------------------------------------------------

function spawnOrder(g, recipeId, timeLeft) {
  const tune = dayTuning(g.day);
  const pool = unlockedRecipes(g.day);
  const recipe = recipeId
    ? RECIPE_BY_ID[recipeId]
    : pool[Math.floor(g.rng() * pool.length)];
  const timeMax = timeLeft !== undefined ? timeLeft : tune.orderTime;
  g.orders.push({ id: g.nextOrderId++, recipeId: recipe.id, timeLeft: timeMax, timeMax: timeMax });
}

function updateGame(g, dt) {
  if (g.screen !== 'playing') return;
  g.time += dt;
  if (g.toast) { g.toast.t -= dt; if (g.toast.t <= 0) g.toast = null; }
  if (g.shake > 0) g.shake -= dt;
  if (g.flashServe > 0) g.flashServe -= dt;

  const tune = dayTuning(g.day);
  g.spawnTimer -= dt;
  if (g.spawnTimer <= 0 && g.orders.length < tune.maxOrders) {
    spawnOrder(g);
    g.spawnTimer = tune.spawnInterval;
  }

  // Cook timers. Time on the grill keeps running after the patty is done,
  // so leaving it too long burns it.
  for (const item of g.grill) {
    if (!item) continue;
    const def = INGREDIENTS[item.id];
    item.cook += dt;
    if (item.prep === 'raw' && item.cook >= def.grill) item.prep = 'ready';
    if (!item.burned && item.prep === 'ready' && item.cook >= def.grill + def.burnAfter) {
      item.burned = true;
      showToast(g, 'Patty burned! Trash it', false);
    }
  }
  for (const item of g.pot) {
    if (!item) continue;
    const def = INGREDIENTS[item.id];
    if (item.prep === 'raw') {
      item.cook += dt;
      if (item.cook >= def.boil) item.prep = 'ready';
    }
  }

  // Order timers.
  for (let i = g.orders.length - 1; i >= 0; i--) {
    const order = g.orders[i];
    order.timeLeft -= dt;
    if (order.timeLeft <= 0) {
      g.orders.splice(i, 1);
      g.strikes += 1;
      g.combo = 0;
      showToast(g, 'Order expired! Strike ' + g.strikes + '/' + MAX_STRIKES, false);
      if (g.strikes >= MAX_STRIKES) {
        g.screen = 'over';
        return;
      }
    }
  }

  // Day up: every dishesPerDay served dishes.
  const newDay = 1 + Math.floor(g.served / tune.dishesPerDay);
  if (newDay !== g.day) {
    g.day = newDay;
    showToast(g, 'Day ' + g.day + ' — orders come faster!', true);
  }
}

function startGame(g) {
  g.screen = 'playing';
  g.spawnTimer = 1.2;
}

function resetGame(g) {
  const fresh = createGame(g.seed);
  fresh.screen = 'playing';
  fresh.spawnTimer = 1.2;
  return fresh;
}
