# Hello!

This site is built with [Astro](https://astro.build). The pages and images
are the same as before — the images are just now served from Cloudflare R2
instead of being stored in this GitHub repo (so the repo stays small and
GitHub isn't serving multi-megabyte photos).

## What you'll need
- A free GitHub account
- [Visual Studio Code](https://code.visualstudio.com/) (for editing)
- Git or GitHub Desktop (for uploading)
- [Node.js](https://nodejs.org/) (to run the site locally / convert images)
- [ImageMagick](https://imagemagick.org/) for converting photos (`brew install imagemagick`)

## Everyday edits (text, layout)
1. **Clone the repo** – Use Git to make a copy of the repository on your computer.
2. **Install dependencies** – Run `npm install` once.
3. **Open and edit** – Use Visual Studio Code to open the folder and make your changes to files in `src/pages/` and `src/components/`.
4. **Preview locally** – Run `npm run dev` and open the URL it prints.
5. **Upload to GitHub** – Use Git or GitHub Desktop to publish your edits. Pushing to `main` automatically builds and deploys the site.

## Adding or replacing a photo
Full-size photos are never committed to GitHub — they're converted to small
`.webp` files and uploaded straight to Cloudflare R2.

1. Drop the full-size photo(s) into the `photos/` folder (this folder is
   ignored by git — nothing in it gets uploaded to GitHub).
2. Run the conversion script:
   ```
   ./scripts/convert-photos.sh
   ```
   This resizes each photo to several widths (480/800/1200/1600px) and
   writes them into `photos/converted/` as `name-480.webp`, `name-800.webp`,
   etc., plus a plain `name.webp` (a copy of the 1600px version, used as the
   fallback `src`). The site uses `srcset` to pick the right width for each
   visitor's screen instead of always downloading the largest one.
3. Upload **all** of the files from `photos/converted/` for that photo
   (all four width variants + the plain `name.webp`) to the `miriamtingle`
   R2 bucket in the Cloudflare dashboard (or via `rclone`/`wrangler` if you
   have one of those set up). Missing a width variant isn't fatal — the
   browser just falls back to a nearby size — but upload all five files if
   you can.
4. Reference the photo in `src/pages/index.astro` by its filename (without
   the extension or width suffix) in the `images2025` or `images2024` list,
   e.g. `"backyardpink"` for `backyardpink.webp` / `backyardpink-480.webp` / etc.
5. Commit and push as usual — GitHub never sees the actual image bytes.

## Local development with real images
To see real photos (not broken image icons) when running `npm run dev`
locally, copy `.env.example` to `.env` and fill in `R2_PUBLIC_URL` with the
public URL of the R2 bucket.

## Deployment
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site with Astro and publishes it to GitHub Pages. The `R2_PUBLIC_URL` value
is stored as a GitHub Actions secret (Repo → Settings → Secrets and
variables → Actions) so it's available at build time without being committed
to the repo.
