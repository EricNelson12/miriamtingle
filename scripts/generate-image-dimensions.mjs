#!/usr/bin/env node
// Generate src/image-dimensions.json from the converted photos.
//
// For each photo in photos/converted/ this finds the largest width variant
// (name-1600.webp etc.), reads its real pixel dimensions with ImageMagick,
// and writes them to src/image-dimensions.json. The site uses these as the
// width/height attributes on <img> tags so the browser can reserve layout
// space (the correct aspect ratio) before the image loads.
//
// Run via `npm run photos` (after converting) or `npm run photos:dimensions`
// on its own. The JSON file is committed to git — it's needed at build time.

import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONVERTED_DIR = path.join(ROOT, "photos", "converted");
const OUTPUT_FILE = path.join(ROOT, "src", "image-dimensions.json");

// Pick the largest width variant of each photo, e.g. backyardpink-1600.webp.
const largest = new Map();
for (const file of readdirSync(CONVERTED_DIR)) {
	const match = file.match(/^(.+)-(\d+)\.webp$/);
	if (!match) continue;
	const [, base, width] = match;
	const entry = largest.get(base);
	if (!entry || Number(width) > entry.width) {
		largest.set(base, { width: Number(width), file });
	}
}

if (largest.size === 0) {
	console.error(`No converted images found in ${CONVERTED_DIR} — run scripts/convert-photos.sh first.`);
	process.exit(1);
}

const dimensions = {};
for (const base of [...largest.keys()].sort()) {
	const { file } = largest.get(base);
	const output = execFileSync(
		"magick",
		["identify", "-format", "%w %h", path.join(CONVERTED_DIR, file)],
		{ encoding: "utf8" }
	);
	const [width, height] = output.trim().split(" ").map(Number);
	dimensions[base] = { width, height };
}

writeFileSync(OUTPUT_FILE, JSON.stringify(dimensions, null, "\t") + "\n");
console.log(`Wrote dimensions for ${largest.size} photos to src/image-dimensions.json`);
