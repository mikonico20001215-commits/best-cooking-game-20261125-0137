// Rush Kitchen — configuration: ingredients, recipes, tuning, layout.
// One job: every number and name the game uses lives here.

const CANVAS_W = 1280;
const CANVAS_H = 720;

// Ingredients. chop = clicks needed on the board (0 = ready to use).
// grill / boil = seconds on the station (0 = no cooking needed).
// burnAfter = seconds past done before it burns (grill only).
const INGREDIENTS = {
  lettuce: { name: 'Lettuce', short: 'LET', color: '#69b34c', dark: '#4a8a34', chop: 3, grill: 0, boil: 0 },
  tomato: { name: 'Tomato', short: 'TOM', color: '#e74c3c', dark: '#b93226', chop: 3, grill: 0, boil: 0 },
  cheese: { name: 'Cheese', short: 'CHS', color: '#f5c542', dark: '#d9a41f', chop: 0, grill: 0, boil: 0 },
  bun: { name: 'Bun', short: 'BUN', color: '#e0a866', dark: '#b57e42', chop: 0, grill: 0, boil: 0 },
  patty: { name: 'Patty', short: 'PTY', color: '#8d5a3b', dark: '#6b4229', chop: 0, grill: 5, boil: 0, burnAfter: 5 },
  noodle: { name: 'Noodle', short: 'NDL', color: '#f2d06b', dark: '#d9ae3e', chop: 0, grill: 0, boil: 5 },
  broth: { name: 'Broth', short: 'BTH', color: '#e67e22', dark: '#b95f14', chop: 0, grill: 0, boil: 0 },
};
const INGREDIENT_ORDER = ['lettuce', 'tomato', 'cheese', 'bun', 'patty', 'noodle', 'broth'];

// Recipes. needs lists ingredient ids; the plate must hold exactly that set.
const RECIPES = [
  { id: 'salad', name: 'Garden Salad', value: 100, needs: ['lettuce', 'tomato'], unlockDay: 1 },
  { id: 'soup', name: 'Tomato Noodle Soup', value: 140, needs: ['broth', 'noodle', 'tomato'], unlockDay: 1 },
  { id: 'burger', name: 'Cheese Burger', value: 180, needs: ['bun', 'patty', 'cheese', 'lettuce'], unlockDay: 2 },
  { id: 'pasta', name: 'Creamy Pasta', value: 160, needs: ['noodle', 'cheese', 'tomato'], unlockDay: 3 },
];
const RECIPE_BY_ID = {};
for (const r of RECIPES) RECIPE_BY_ID[r.id] = r;

// Day tuning. Orders arrive faster and run out sooner as days pass.
function dayTuning(day) {
  return {
    spawnInterval: Math.max(4.5, 9 - (day - 1) * 1.2),
    orderTime: Math.max(32, 65 - (day - 1) * 6),
    maxOrders: 3,
    dishesPerDay: 5,
  };
}

const MAX_STRIKES = 3;

// Layout (single source of truth for input hit-testing and rendering).
const LAYOUT = {
  header: { x: 0, y: 0, w: 1280, h: 56 },
  board: { x: 24, y: 76, w: 376, h: 112, gap: 24 },
  bins: { x: 24, y: 208, w: 160, h: 96, gap: 16 },
  stations: { y: 324, h: 118 },
  boardSlot: { x: 24, w: 380 },
  grillSlot: { x: 428, w: 380 },
  potSlot: { x: 832, w: 200 },
  handSlot: { x: 1056, w: 200 },
  plate: { x: 24, y: 462, w: 760, h: 168 },
  serve: { x: 808, y: 466, w: 208, h: 72 },
  trash: { x: 808, y: 550, w: 208, h: 72 },
  footer: { x: 0, y: 648, w: 1280, h: 72 },
  startButton: { x: 490, y: 480, w: 300, h: 64 },
  restartButton: { x: 490, y: 500, w: 300, h: 64 },
};

// Colors.
const COLORS = {
  wall: '#f7e8d0',
  wallTile: '#f3ddba',
  counter: '#b07a45',
  counterTop: '#c98f52',
  steel: '#c9ced6',
  steelDark: '#9aa1ad',
  board: '#d8b98a',
  grill: '#5b5f66',
  pot: '#7a828c',
  plate: '#ffffff',
  ink: '#2e2a26',
  muted: '#6b6259',
  accent: '#e74c3c',
  gold: '#f5c542',
  green: '#69b34c',
  ticket: '#fff8e7',
};
