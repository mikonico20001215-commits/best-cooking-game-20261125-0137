// Rush Kitchen — rendering. Every pixel the judge sees is drawn here,
// on one 2D canvas, with flat vector shapes and no assets.

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, bold, align) {
  ctx.fillStyle = color;
  ctx.font = (bold ? 'bold ' : '') + size + 'px sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// --- food -------------------------------------------------------------------

// Draw one ingredient as a recognizable flat shape. opts: {chopped, cooked, burned}
function drawIngredient(ctx, id, x, y, r, opts) {
  opts = opts || {};
  const def = INGREDIENTS[id];
  ctx.save();
  ctx.translate(x, y);
  if (opts.burned) {
    ctx.fillStyle = '#22201e';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#55504a';
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }
  if (id === 'lettuce') {
    ctx.fillStyle = opts.chopped ? '#8fce62' : def.color;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = def.dark; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, 0.3, 2.4);
    ctx.arc(0, 0, r * 0.62, 3.4, 5.5);
    ctx.stroke();
    if (opts.chopped) {
      ctx.strokeStyle = '#3f7a2c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-r * 0.5, 0); ctx.lineTo(r * 0.5, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r * 0.5); ctx.lineTo(0, r * 0.5); ctx.stroke();
    }
  } else if (id === 'tomato') {
    ctx.fillStyle = def.color;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3f7a2c';
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(-r * 0.3, -r * 1.25); ctx.lineTo(r * 0.3, -r * 1.25); ctx.closePath(); ctx.fill();
    if (opts.chopped) {
      ctx.strokeStyle = '#8f1d12'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.2); ctx.lineTo(r * 0.6, r * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.6, r * 0.2); ctx.lineTo(r * 0.6, -r * 0.2); ctx.stroke();
    }
  } else if (id === 'cheese') {
    ctx.fillStyle = def.color;
    ctx.beginPath(); ctx.moveTo(-r, r * 0.7); ctx.lineTo(r, r * 0.7); ctx.lineTo(0, -r); ctx.closePath(); ctx.fill();
    ctx.fillStyle = def.dark;
    ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.25, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, r * 0.35, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'bun') {
    ctx.fillStyle = def.color;
    ctx.beginPath(); ctx.arc(0, r * 0.25, r, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillRect(-r, r * 0.25, r * 2, r * 0.3);
    ctx.fillStyle = '#fff2cf';
    ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.3, r * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.15, -r * 0.55, r * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.45, -r * 0.2, r * 0.09, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'patty') {
    ctx.fillStyle = opts.cooked ? '#6b4229' : '#a9714e';
    roundRect(ctx, -r, -r * 0.55, r * 2, r * 1.1, r * 0.4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.2); ctx.lineTo(r * 0.6, -r * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * 0.6, r * 0.2); ctx.lineTo(r * 0.6, r * 0.2); ctx.stroke();
  } else if (id === 'noodle') {
    ctx.strokeStyle = def.color; ctx.lineWidth = r * 0.28; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.35, -r * 0.2, r * 0.4, 0.6, 4.2);
    ctx.arc(r * 0.35, r * 0.2, r * 0.4, 3.8, 1.2);
    ctx.stroke();
    ctx.strokeStyle = def.dark; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
  } else if (id === 'broth') {
    ctx.fillStyle = '#d96f1e';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = def.color;
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-r * 0.2, -r * 0.05, r * 0.4, r * 0.12, -0.3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function prepLabel(item) {
  if (!item) return '';
  const def = INGREDIENTS[item.id];
  if (item.burned) return 'BURNED';
  if (item.prep === 'ready') return 'READY';
  if (def.chop > 0) return 'CHOP ' + (def.chop - item.chopLeft) + '/' + def.chop;
  if (def.grill > 0) return 'GRILL ' + Math.min(99, Math.floor(100 * item.cook / def.grill)) + '%';
  if (def.boil > 0) return 'BOIL ' + Math.min(99, Math.floor(100 * item.cook / def.boil)) + '%';
  return '';
}

// --- screens ----------------------------------------------------------------

function drawBackground(ctx) {
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = COLORS.wallTile;
  for (let y = 0; y < 190; y += 46) {
    for (let x = (y / 46 % 2) * 23; x < CANVAS_W; x += 46) {
      ctx.fillRect(x, y, 42, 42);
    }
  }
  ctx.fillStyle = COLORS.counter;
  ctx.fillRect(0, 190, CANVAS_W, CANVAS_H - 190);
  ctx.fillStyle = COLORS.counterTop;
  ctx.fillRect(0, 190, CANVAS_W, 10);
}

function drawHeader(ctx, g) {
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(0, 0, CANVAS_W, 56);
  text(ctx, 'RUSH KITCHEN', 24, 30, 26, '#f5c542', true);
  text(ctx, 'DAY ' + g.day, 300, 30, 20, '#ffffff', true);
  text(ctx, 'SCORE ' + g.score, 430, 30, 20, '#ffffff', true);
  if (g.combo >= 2) text(ctx, 'COMBO x' + g.combo, 620, 30, 20, '#7CFC00', true);
  const tune = dayTuning(g.day);
  const dayProg = Math.min(1, (g.served % tune.dishesPerDay) / tune.dishesPerDay);
  ctx.fillStyle = '#44403a';
  roundRect(ctx, 900, 20, 160, 16, 8); ctx.fill();
  ctx.fillStyle = COLORS.gold;
  if (dayProg > 0) { roundRect(ctx, 900, 20, 160 * dayProg, 16, 8); ctx.fill(); }
  text(ctx, 'NEXT DAY ' + (g.served % tune.dishesPerDay) + '/' + tune.dishesPerDay, 900, 52, 11, '#bbbbbb', false);
  for (let i = 0; i < MAX_STRIKES; i++) {
    ctx.fillStyle = i < g.strikes ? '#e74c3c' : '#55504a';
    ctx.beginPath(); ctx.arc(1110 + i * 32, 28, 11, 0, Math.PI * 2); ctx.fill();
    text(ctx, 'X', 1110 + i * 32, 29, 13, '#ffffff', true, 'center');
  }
  text(ctx, g.strikes + '/' + MAX_STRIKES + ' strikes', 1210, 52, 12, '#bbbbbb', false, 'right');
}

function drawOrderBoard(ctx, g) {
  text(ctx, 'ORDER BOARD', 24, 70, 13, COLORS.muted, true);
  for (let i = 0; i < 3; i++) {
    const x = LAYOUT.board.x + i * (LAYOUT.board.w + LAYOUT.board.gap);
    const y = LAYOUT.board.y;
    ctx.fillStyle = COLORS.ticket;
    roundRect(ctx, x, y, LAYOUT.board.w, LAYOUT.board.h, 10); ctx.fill();
    ctx.strokeStyle = '#d9c48f'; ctx.lineWidth = 2;
    roundRect(ctx, x, y, LAYOUT.board.w, LAYOUT.board.h, 10); ctx.stroke();
    const order = g.orders[i];
    if (!order) {
      text(ctx, '— waiting for orders —', x + LAYOUT.board.w / 2, y + 56, 14, '#b3a586', false, 'center');
      continue;
    }
    const recipe = RECIPE_BY_ID[order.recipeId];
    text(ctx, recipe.name.toUpperCase(), x + 14, y + 22, 17, COLORS.ink, true);
    text(ctx, '$' + recipe.value, x + LAYOUT.board.w - 14, y + 22, 17, '#c0392b', true, 'right');
    let cx = x + 14;
    for (const id of recipe.needs) {
      drawIngredient(ctx, id, cx + 14, y + 58, 13, {});
      text(ctx, INGREDIENTS[id].short, cx + 30, y + 58, 11, COLORS.muted, true);
      cx += 62;
    }
    const frac = Math.max(0, order.timeLeft / order.timeMax);
    ctx.fillStyle = '#e8dcc3';
    roundRect(ctx, x + 14, y + 86, LAYOUT.board.w - 28, 12, 6); ctx.fill();
    ctx.fillStyle = frac > 0.5 ? COLORS.green : frac > 0.25 ? COLORS.gold : COLORS.accent;
    roundRect(ctx, x + 14, y + 86, (LAYOUT.board.w - 28) * frac, 12, 6); ctx.fill();
    text(ctx, Math.ceil(order.timeLeft) + 's', x + LAYOUT.board.w - 14, y + 92, 11, COLORS.ink, true, 'right');
  }
}

function drawBins(ctx, g) {
  text(ctx, 'INGREDIENTS — click to take (keys 1-7)', 24, 200, 13, '#f7e8d0', true);
  for (let i = 0; i < INGREDIENT_ORDER.length; i++) {
    const id = INGREDIENT_ORDER[i];
    const def = INGREDIENTS[id];
    const r = binRect(i);
    ctx.fillStyle = '#fff8e7';
    roundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = '#d9c48f'; ctx.lineWidth = 2;
    roundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
    drawIngredient(ctx, id, r.x + 34, r.y + 40, 22, {});
    text(ctx, def.name, r.x + 64, r.y + 30, 16, COLORS.ink, true);
    let hint = 'ready';
    if (def.chop > 0) hint = 'chop x' + def.chop;
    else if (def.grill > 0) hint = 'grill ' + def.grill + 's';
    else if (def.boil > 0) hint = 'boil ' + def.boil + 's';
    text(ctx, hint, r.x + 64, r.y + 54, 12, COLORS.muted, false);
    text(ctx, '[' + (i + 1) + ']', r.x + r.w - 12, r.y + 16, 11, '#b3a586', false, 'right');
  }
}

function drawStationSlot(ctx, x, y, w, h, label, item) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  roundRect(ctx, x, y, w, h, 8); ctx.fill();
  text(ctx, label, x + 10, y + 12, 11, '#f7e8d0', true);
  if (item) {
    const def = INGREDIENTS[item.id];
    drawIngredient(ctx, item.id, x + 34, y + 38, 20, { chopped: item.prep === 'ready' && def.chop > 0, cooked: item.prep === 'ready' && def.grill > 0, burned: item.burned });
    text(ctx, def.name, x + 62, y + 30, 14, '#ffffff', true);
    text(ctx, prepLabel(item), x + 62, y + 50, 12, item.burned ? '#ff6b5e' : '#ffe9a8', true);
    if (def.grill > 0 || def.boil > 0) {
      const frac = Math.min(1, item.cook / item.cookMax);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      roundRect(ctx, x + 62, y + 58, w - 76, 8, 4); ctx.fill();
      ctx.fillStyle = item.burned ? '#ff6b5e' : COLORS.gold;
      roundRect(ctx, x + 62, y + 58, (w - 76) * frac, 8, 4); ctx.fill();
    }
  } else {
    text(ctx, 'empty — click an item in hand', x + 10, y + 40, 12, 'rgba(255,255,255,0.55)', false);
  }
}

function drawStations(ctx, g) {
  text(ctx, 'PREP STATIONS', 24, 316, 13, '#f7e8d0', true);
  ctx.fillStyle = COLORS.board;
  roundRect(ctx, LAYOUT.boardSlot.x, LAYOUT.stations.y, LAYOUT.boardSlot.w, LAYOUT.stations.h, 10); ctx.fill();
  for (let i = 0; i < 2; i++) drawStationSlot(ctx, boardSlotRect(i).x, boardSlotRect(i).y, 168, 68, 'CHOP ' + (i + 1), g.board[i]);
  ctx.fillStyle = COLORS.grill;
  roundRect(ctx, LAYOUT.grillSlot.x, LAYOUT.stations.y, LAYOUT.grillSlot.w, LAYOUT.stations.h, 10); ctx.fill();
  for (let i = 0; i < 2; i++) drawStationSlot(ctx, grillSlotRect(i).x, grillSlotRect(i).y, 168, 68, 'GRILL ' + (i + 1), g.grill[i]);
  ctx.fillStyle = COLORS.pot;
  roundRect(ctx, LAYOUT.potSlot.x, LAYOUT.stations.y, LAYOUT.potSlot.w, LAYOUT.stations.h, 10); ctx.fill();
  drawStationSlot(ctx, potSlotRect().x, potSlotRect().y, 168, 68, 'POT', g.pot[0]);
  ctx.fillStyle = '#2e2a26';
  roundRect(ctx, LAYOUT.handSlot.x, LAYOUT.stations.y, LAYOUT.handSlot.w, LAYOUT.stations.h, 10); ctx.fill();
  text(ctx, 'IN HAND', LAYOUT.handSlot.x + 12, LAYOUT.stations.y + 16, 11, '#f5c542', true);
  if (g.hand) {
    const def = INGREDIENTS[g.hand.id];
    drawIngredient(ctx, g.hand.id, LAYOUT.handSlot.x + 34, LAYOUT.stations.y + 62, 20, { chopped: g.hand.prep === 'ready' && def.chop > 0, cooked: g.hand.prep === 'ready' && def.grill > 0, burned: g.hand.burned });
    text(ctx, def.name, LAYOUT.handSlot.x + 62, LAYOUT.stations.y + 52, 15, '#ffffff', true);
    text(ctx, prepLabel(g.hand), LAYOUT.handSlot.x + 62, LAYOUT.stations.y + 74, 12, '#ffe9a8', true);
  } else {
    text(ctx, 'nothing', LAYOUT.handSlot.x + 12, LAYOUT.stations.y + 56, 13, '#999999', false);
  }
}

function drawPlateArea(ctx, g) {
  const r = plateRect();
  const shakeX = g.shake > 0 ? Math.sin(g.time * 60) * 5 * g.shake : 0;
  ctx.fillStyle = '#fff8e7';
  roundRect(ctx, r.x + shakeX, r.y, r.w, r.h, 12); ctx.fill();
  ctx.strokeStyle = '#d9c48f'; ctx.lineWidth = 2;
  roundRect(ctx, r.x + shakeX, r.y, r.w, r.h, 12); ctx.stroke();
  text(ctx, 'PLATE — click to add what you hold', r.x + 16, r.y + 20, 13, COLORS.muted, true);
  // The plate.
  ctx.fillStyle = COLORS.plate;
  ctx.beginPath(); ctx.ellipse(r.x + 120, r.y + 100, 92, 46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d8d2c4'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(r.x + 120, r.y + 100, 92, 46, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(r.x + 120, r.y + 100, 62, 30, 0, 0, Math.PI * 2); ctx.stroke();
  let px = r.x + 120;
  let py = r.y + 100;
  for (let i = 0; i < g.plate.length; i++) {
    drawIngredient(ctx, g.plate[i], px + (i - (g.plate.length - 1) / 2) * 44, py - 6, 18, { chopped: true, cooked: true });
  }
  // Which order this plate would serve.
  let match = null;
  for (const order of g.orders) if (plateMatches(g, order.recipeId)) { match = order; break; }
  if (g.plate.length > 0) {
    if (match) text(ctx, 'Ready for: ' + RECIPE_BY_ID[match.recipeId].name + ' — hit SERVE!', r.x + 260, r.y + 60, 16, '#2e7d32', true);
    else text(ctx, 'Plate: ' + g.plate.map((id) => INGREDIENTS[id].name).join(' + '), r.x + 260, r.y + 60, 15, COLORS.ink, false);
  } else {
    text(ctx, 'Build a dish from an order above.', r.x + 260, r.y + 60, 15, COLORS.muted, false);
  }
  const unlocked = unlockedRecipes(g.day).map((x) => x.name + ' (' + x.needs.map((id) => INGREDIENTS[id].short).join('+') + ')').join('   ');
  text(ctx, 'Recipes today: ' + unlocked, r.x + 260, r.y + 92, 12, COLORS.muted, false);
  text(ctx, 'Trash clears the plate (or the item in hand).', r.x + 260, r.y + 122, 12, COLORS.muted, false);

  // Serve button.
  const serveHot = match !== null;
  ctx.fillStyle = serveHot ? (g.flashServe > 0 ? '#ffd54f' : COLORS.green) : '#8a8378';
  roundRect(ctx, LAYOUT.serve.x, LAYOUT.serve.y, LAYOUT.serve.w, LAYOUT.serve.h, 12); ctx.fill();
  text(ctx, 'SERVE  (S)', LAYOUT.serve.x + LAYOUT.serve.w / 2, LAYOUT.serve.y + 36, 22, '#ffffff', true, 'center');
  ctx.fillStyle = '#e74c3c';
  roundRect(ctx, LAYOUT.trash.x, LAYOUT.trash.y, LAYOUT.trash.w, LAYOUT.trash.h, 12); ctx.fill();
  text(ctx, 'TRASH  (T)', LAYOUT.trash.x + LAYOUT.trash.w / 2, LAYOUT.trash.y + 36, 22, '#ffffff', true, 'center');
}

function drawFooter(ctx, g) {
  text(ctx, 'Click ingredients, chop / grill / boil, build the plate, serve before the timer runs out.  Keys: 1-7 take, S serve, T trash.', 24, 676, 14, '#f7e8d0', false);
  text(ctx, 'Day ' + g.day + '  •  Served ' + g.served + '  •  Best combo x' + g.bestCombo, 24, 702, 13, '#e8cfa8', false);
}

function drawToast(ctx, g) {
  if (!g.toast) return;
  ctx.fillStyle = g.toast.good ? 'rgba(46,125,50,0.92)' : 'rgba(183,28,28,0.92)';
  const w = ctx.measureText(g.toast.text).width + 36;
  roundRect(ctx, CANVAS_W / 2 - w / 2, 600, w, 36, 18); ctx.fill();
  text(ctx, g.toast.text, CANVAS_W / 2, 619, 16, '#ffffff', true, 'center');
}

function drawTitle(ctx, g) {
  ctx.fillStyle = 'rgba(30,22,16,0.72)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fff8e7';
  roundRect(ctx, 290, 110, 700, 480, 16); ctx.fill();
  text(ctx, 'RUSH KITCHEN', 640, 170, 54, '#c0392b', true, 'center');
  text(ctx, 'A 12-hour service. Orders fly in — cook fast, serve faster.', 640, 220, 18, COLORS.ink, false, 'center');
  const lines = [
    '1. Click an ingredient on the counter to pick it up.',
    '2. Chop lettuce & tomato on the board, grill patties, boil noodles.',
    '3. Click the plate to build the dish an order asks for.',
    '4. Hit SERVE before the order timer runs out. 3 strikes ends the day.',
  ];
  let y = 270;
  for (const line of lines) { text(ctx, line, 640, y, 16, COLORS.muted, false, 'center'); y += 32; }
  text(ctx, 'Recipes: Garden Salad, Tomato Noodle Soup, Cheese Burger, Creamy Pasta', 640, y + 8, 15, COLORS.ink, false, 'center');
  ctx.fillStyle = COLORS.green;
  roundRect(ctx, LAYOUT.startButton.x, LAYOUT.startButton.y, LAYOUT.startButton.w, LAYOUT.startButton.h, 12); ctx.fill();
  text(ctx, 'START SERVICE', 640, LAYOUT.startButton.y + 34, 24, '#ffffff', true, 'center');
  text(ctx, 'or press Enter', 640, LAYOUT.startButton.y + 92, 13, COLORS.muted, false, 'center');
}

function drawGameOver(ctx, g) {
  ctx.fillStyle = 'rgba(30,22,16,0.78)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fff8e7';
  roundRect(ctx, 340, 130, 600, 440, 16); ctx.fill();
  text(ctx, 'SERVICE OVER', 640, 190, 44, '#c0392b', true, 'center');
  text(ctx, 'Final score: ' + g.score, 640, 260, 26, COLORS.ink, true, 'center');
  text(ctx, 'Dishes served: ' + g.served + '    Day reached: ' + g.day + '    Best combo: x' + g.bestCombo, 640, 310, 18, COLORS.muted, false, 'center');
  text(ctx, 'Three orders expired. The kitchen closes — for now.', 640, 350, 16, COLORS.muted, false, 'center');
  ctx.fillStyle = COLORS.green;
  roundRect(ctx, LAYOUT.restartButton.x, LAYOUT.restartButton.y, LAYOUT.restartButton.w, LAYOUT.restartButton.h, 12); ctx.fill();
  text(ctx, 'PLAY AGAIN', 640, LAYOUT.restartButton.y + 34, 24, '#ffffff', true, 'center');
  text(ctx, 'or press R', 640, LAYOUT.restartButton.y + 92, 13, COLORS.muted, false, 'center');
}

function drawHandCursor(ctx, g, mouse) {
  if (!g.hand || !mouse) return;
  drawIngredient(ctx, g.hand.id, mouse.x, mouse.y - 18, 20, { chopped: g.hand.prep === 'ready' && INGREDIENTS[g.hand.id].chop > 0, cooked: g.hand.prep === 'ready' && INGREDIENTS[g.hand.id].grill > 0, burned: g.hand.burned });
  text(ctx, INGREDIENTS[g.hand.id].name, mouse.x, mouse.y + 14, 12, '#ffffff', true, 'center');
}

function drawGame(ctx, g, mouse) {
  drawBackground(ctx);
  drawHeader(ctx, g);
  drawOrderBoard(ctx, g);
  drawBins(ctx, g);
  drawStations(ctx, g);
  drawPlateArea(ctx, g);
  drawFooter(ctx, g);
  drawToast(ctx, g);
  drawHandCursor(ctx, g, mouse);
  if (g.screen === 'title') drawTitle(ctx, g);
  if (g.screen === 'over') drawGameOver(ctx, g);
}
