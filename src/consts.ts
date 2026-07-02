// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Miriam Tingle';
export const SITE_DESCRIPTION = 'Miriam Tingle — Toronto-based artist. Paintings, illustrations, and ceramics.';

// Images are converted to .webp by scripts/convert-photos.sh and uploaded to
// Cloudflare R2 (see README) — full-size originals never live in this repo
// or get served from GitHub.
const R2_PUBLIC_URL = import.meta.env.R2_PUBLIC_URL ?? '';

export function photoUrl(name: string): string {
	return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${name}.webp`;
}
