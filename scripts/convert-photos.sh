#!/usr/bin/env bash
# Convert photos to WebP at several responsive widths
# Usage: ./scripts/convert-photos.sh [input_dir] [output_dir]
#   input_dir  defaults to ./photos
#   output_dir defaults to ./photos/converted
#
# Generates one WebP per width in WIDTHS (named name-<width>.webp), plus a
# plain name.webp fallback (a copy of the largest width). This lets the site
# serve a srcset so phones/small screens download a smaller file instead of
# the full 1600px image everywhere.

set -euo pipefail

INPUT_DIR="${1:-./photos}"
OUTPUT_DIR="${2:-./photos/converted}"
WIDTHS=(480 800 1200 1600)

if ! command -v magick &>/dev/null; then
  echo "ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
files=("$INPUT_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,mp.jpg,MP.jpg})

if [ ${#files[@]} -eq 0 ]; then
  echo "No image files found in $INPUT_DIR"
  exit 0
fi

for src in "${files[@]}"; do
  filename=$(basename "$src")
  # Strip all extensions
  base="${filename%%.*}"

  for width in "${WIDTHS[@]}"; do
    dest="$OUTPUT_DIR/${base}-${width}.webp"
    echo "Converting $filename -> ${base}-${width}.webp"
    magick "$src" -resize "${width}>" -quality 82 "$dest"
  done

  # Plain filename (no width suffix) is the fallback `src` for browsers
  # that ignore srcset — just the largest variant we already made.
  largest="${WIDTHS[${#WIDTHS[@]}-1]}"
  cp "$OUTPUT_DIR/${base}-${largest}.webp" "$OUTPUT_DIR/${base}.webp"
done

echo "Done. Output in $OUTPUT_DIR"
