// Rush Kitchen — input. Turns mouse clicks and keys into state actions.
// Shares LAYOUT with render.js so hit areas match what is drawn.

function pointIn(r, x, y) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

function binRect(i) {
  return {
    x: LAYOUT.bins.x + i * (LAYOUT.bins.w + LAYOUT.bins.gap),
    y: LAYOUT.bins.y,
    w: LAYOUT.bins.w,
    h: LAYOUT.bins.h,
  };
}

function boardSlotRect(i) {
  return { x: LAYOUT.boardSlot.x + 16 + i * 185, y: LAYOUT.stations.y + 34, w: 168, h: 68 };
}

function grillSlotRect(i) {
  return { x: LAYOUT.grillSlot.x + 16 + i * 185, y: LAYOUT.stations.y + 34, w: 168, h: 68 };
}

function potSlotRect() {
  return { x: LAYOUT.potSlot.x + 16, y: LAYOUT.stations.y + 34, w: 168, h: 68 };
}

function plateRect() {
  return { x: LAYOUT.plate.x, y: LAYOUT.plate.y, w: LAYOUT.plate.w, h: LAYOUT.plate.h };
}

// Handle one click at canvas coordinates. Returns true if it did something.
function handleClick(g, x, y) {
  if (g.screen === 'title') {
    if (pointIn(LAYOUT.startButton, x, y)) { startGame(g); return true; }
    return false;
  }
  if (g.screen === 'over') {
    if (pointIn(LAYOUT.restartButton, x, y)) {
      const fresh = resetGame(g);
      copyGameInto(g, fresh);
      return true;
    }
    return false;
  }

  // Serve / trash buttons.
  if (pointIn(LAYOUT.serve, x, y)) return servePlate(g);
  if (pointIn(LAYOUT.trash, x, y)) {
    if (g.hand) return trashHeld(g);
    return clearPlate(g);
  }

  // Ingredient bins.
  for (let i = 0; i < INGREDIENT_ORDER.length; i++) {
    if (pointIn(binRect(i), x, y)) return takeIngredient(g, INGREDIENT_ORDER[i]);
  }

  // Chopping board slots.
  for (let i = 0; i < 2; i++) {
    if (pointIn(boardSlotRect(i), x, y)) {
      if (g.board[i]) {
        if (g.board[i].prep === 'ready') return takeFromBoard(g, i);
        return chopBoard(g, i);
      }
      return placeOnBoard(g, i);
    }
  }

  // Grill slots.
  for (let i = 0; i < 2; i++) {
    if (pointIn(grillSlotRect(i), x, y)) {
      if (g.grill[i]) return takeFromGrill(g, i);
      return placeOnGrill(g, i);
    }
  }

  // Pot slot.
  if (pointIn(potSlotRect(), x, y)) {
    if (g.pot[0]) return takeFromPot(g);
    return placeOnPot(g);
  }

  // Plate: add held ready ingredient.
  if (pointIn(plateRect(), x, y)) return addToPlate(g);

  return false;
}

// Keyboard shortcuts: 1-7 take ingredients, S serve, T trash, Enter start.
function handleKey(g, key) {
  if (g.screen === 'title' && (key === 'Enter' || key === ' ')) { startGame(g); return true; }
  if (g.screen === 'over' && (key === 'Enter' || key === 'r' || key === 'R')) {
    const fresh = resetGame(g);
    copyGameInto(g, fresh);
    return true;
  }
  if (g.screen !== 'playing') return false;
  if (key >= '1' && key <= '7') return takeIngredient(g, INGREDIENT_ORDER[Number(key) - 1]);
  if (key === 's' || key === 'S') return servePlate(g);
  if (key === 't' || key === 'T') {
    if (g.hand) return trashHeld(g);
    return clearPlate(g);
  }
  return false;
}

// Replace a game's fields with a fresh game's (keeps the same object identity
// so the render loop's reference never goes stale).
function copyGameInto(g, fresh) {
  const keys = Object.keys(fresh);
  for (const k of keys) g[k] = fresh[k];
}
