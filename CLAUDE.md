# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Project page for "RaC: Robot Learning for Long-Horizon Tasks by Scaling Recovery and Correction"
(IEEE T-RO 2026; first author Zheyuan Hu), at https://rac.huzheyuan.io. SvelteKit 3 + Svelte 5
(runes) + TypeScript, fully prerendered by `@sveltejs/adapter-static` into `dist/`. Svelte runs
only at build time (`csr = false`): the page ships no framework JS, just one inline script.
Videos and posters are in the Cloudflare R2 bucket `huzheyuan-media` under `rac/`, served at
https://media.huzheyuan.io/rac. Same stack and conventions as the author's homepage
(`leo428.github.io`). The previous Nerfies/Bulma page is in git history before the redesign.

## Commands

```sh
bun install
bun run dev          # vite dev server; serves the git-ignored media/ at /media
bun run check        # svelte-check (must pass with 0 errors, 0 warnings)
bun run format       # prettier (tabs, single quotes, width 100); `bun run lint` checks
bun run build        # → dist/  (VITE_MEDIA_BASE=/media bun run build && bun run preview to test locally)
bun scripts/encode-video.ts <input> <key> --width 1280 --vmaf   # AV1 + H.264 + poster into media/
bun run media:sync   # upload media/ to R2 (needs `bunx wrangler login`)
```

## Layout

- `src/lib/content/` — all page content as typed data: `paper.ts` (title, authors, venue, links,
  TL;DR, BibTeX), `protocol.ts`, `results.ts` (figures; Table 1 cells are trusted HTML),
  `rollouts.ts` (comparison video + three task playlists), `evaluation.ts` (YouTube), `nav.ts`.
- `src/lib/types.ts` — `Video` (media key, size, duration, codec strings), `Clip`, `Task`, `Image`.
- `src/lib/media.ts` — `mediaUrl(key)`: `/media` in dev, `config.mediaBase` in production
  (`VITE_MEDIA_BASE` overrides it for local preview); `av1Url`/`h264Url`/`posterUrl` and the
  `<source type>` strings.
- `src/lib/components/` — `Nav` (sticky rail ≥64rem, sticky top bar below), `Hero`, `Section`,
  `Protocol` + `ProtocolDiagram` (inline SVG redrawn from the paper's "RaC-style data" funnel
  figure; points are placed by hand and smoothed with `#lib/geometry.ts`; a looping SMIL
  animation built with `#lib/timeline.ts`, whose base attributes are the finished figure),
  `Player` (click-to-play video), `Rollouts` + `Playlist` (one player per task), `Evaluation`
  (YouTube facade), `Results` + `Figure` + `PriorWorkTable`, `Citation`, `Footer`, `Seo`, `Icon`
  (inline SVG icons). Page order is in `+page.svelte` and `nav.ts` (keep them in step).
  Styles are scoped in each component; `src/app.css` holds tokens, `@font-face`, element
  defaults and `.wrap` / `.prose` / `.visually-hidden`.
- `src/lib/enhance.ts` — the only client-side code. `+page.svelte` inlines it with
  `Function.prototype.toString()`, so it must stay self-contained (no imports, no outer
  variables). Markup hooks: `[data-spy]`, `[data-player]`, `video[data-autoplay]`,
  `[data-playlist]`, `[data-youtube]`, `button[data-copy]`, `svg[data-timeline]` (see its header).
- `src/routes/` — `+page.svelte`, `404/+page.svelte`, `sitemap.xml/+server.ts`; `+layout.ts`
  sets `prerender = true` and `csr = false`.
- `src/app.html` — favicon, font preload, Google Analytics G-CR91FGL27V (commented out, as on
  the old site).
- `static/` — Newsreader woff2, figures (`images/*.webp`), the YouTube poster, social image,
  favicon (raster from the original `rac_icon.svg`), `robots.txt`, Cloudflare `_headers`.
- `vite.config.ts` — Kit options (no `svelte.config.js` in Kit 3): CSS inlined, absolute
  `/_app` paths, and a plugin serving `media/` in dev and preview.

## SvelteKit 3 / Svelte 5 notes

- Import project modules via `#lib/…` with a `.js` extension; `$lib` is gone. `$app/environment`
  is `$app/env`.
- With `csr = false`, component `<script>` blocks run only at build time. Put browser behavior
  in `#lib/enhance.ts`. Classes or attributes set only by it must be written `:global(...)` in
  component styles (e.g. `[aria-current]` in `Nav`).
- Svelte keeps one space for whitespace between inline nodes; keep inline runs (title, author
  list, captions) on one line with `<!-- prettier-ignore -->`.

## Conventions

- Use bun (not npm/npx). Dependencies are dev-only and few. No icon fonts, jQuery or CSS
  frameworks.
- Don't rewrite the paper's claims: page text is the authors'. Venue names are written out.
- Design: warm-neutral paper with one accent, "RaC blue" (`--accent`, the colour of RaC/"Ours"
  in the paper's plots). Newsreader for title, headings and prose; system sans for UI and
  captions; mono only for BibTeX. No all-caps labels. Plots sit on white plates (dimmed in dark
  mode). Dark mode follows `prefers-color-scheme`.
- Video loading: never preload. Explainer videos are click-to-play (`Player`). Each task has
  one player (`Playlist`) that loads only the selected clip, autoplays muted only while at
  least half on screen, and never autoplays with reduced motion. The YouTube embed loads only
  on click.
- Never commit videos. Each video is `media/<key>.av1.mp4` (SVT-AV1 preset 4, first `<source>`),
  `media/<key>.h264.mp4` (x264 slow, or a remux of an already-web source with `--h264-copy`),
  and `media/<key>.jpg`; 10 s GOP, `+faststart`, no audio, no cover-art stream. Rollouts are
  1280×720 (720p beat 540p at equal bitrate). Tune CRF per clip for VMAF (against the source
  scaled to the output size) ≈ 94 AV1 / ≈ 93 H.264 for rollouts and ≈ 95 AV1 for the
  full-width explainers, whose H.264 is a remux. R2 objects are cached for a year: a changed
  file needs a new key.
- Screenshot `dist/` or the dev server with headless Chrome at 1280 and 500 px wide (Chrome's
  minimum), light and dark. Viewport breakpoints: 64rem (nav rail vs top bar) and 40rem (table
  cards, diagram labels). The protocol split (52rem) and playlist (50rem) use container queries
  on `main`, so they follow the content column, not the viewport.
