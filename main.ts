// Rush Kitchen — the hand-in program (Node 22, standard library only).
// Rush Kitchen is a complete cooking game: take orders from the order board,
// prep ingredients on the counter and chopping boards, assemble dishes on
// plates, and serve them before their timers run out. The game itself lives
// in game/ (plain static files a desktop browser loads offline) and its
// screenshots live in screenshots/ (the first by name is the cover).
// This program hands the entry in: it copies game/ and screenshots/ to
// /output and writes /output/dossier.json, the summary the judge reads,
// using the vendored make.fun library (vendor/makefun-game.ts, unchanged).
// It refuses to write a partial entry: game/index.html and screenshots/
// must both be present, and dossier.json must exist after the build.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program runs twice in grading and the two runs must write the same bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly instead of handing in a partial entry.
const gameIndex = join(here, 'game', 'index.html');
if (!existsSync(gameIndex)) {
  throw new Error(`Rush Kitchen: refusing to build — missing ${gameIndex}`);
}
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir)) {
  throw new Error(`Rush Kitchen: refusing to build — missing ${shotsDir}`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The gate's caps: at most 4 screenshots of 256 KiB, game/ under 993 files
// and 48 MiB, and the dossier text under 160 KiB.
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
if (!existsSync(dossierPath)) {
  throw new Error(`Rush Kitchen: refusing to finish — ${dossierPath} was not written`);
}
