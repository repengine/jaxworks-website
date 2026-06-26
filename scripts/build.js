import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const outDir = join(root, "dist");

const publicFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "assets/hero-pressure-washing.jpg",
  "assets/logo-cropped.jpg",
  "assets/results/entry-steps-before-after.jpg",
  "assets/results/fence-before-after.jpg",
  "assets/results/house-siding-before-after.jpg",
  "assets/results/paver-patio-before-after.jpg",
  "assets/results/pool-paver-feature-after.jpg",
  "assets/results/pool-paver-feature-before.jpg",
  "assets/results/roof-before-after.jpg",
  "assets/results/walkway-before-after.jpg",
];

rmSync(outDir, { recursive: true, force: true });

for (const file of publicFiles) {
  const source = join(root, file);
  const target = join(outDir, file);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target);
}

console.log(`Built ${publicFiles.length} public files in dist/`);
