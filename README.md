# RaC: Robot Learning for Long-Horizon Tasks by Scaling Recovery and Correction

Project page for the RaC paper (IEEE Transactions on Robotics, 2026), served at
<https://rac.huzheyuan.io>. SvelteKit + TypeScript, prerendered to one static HTML page that
ships no framework JavaScript (just one small inline script). Videos and their posters live in
Cloudflare R2 and are not committed.

```
src/lib/content/         all page text and data: paper.ts (title, authors, links, TL;DR, BibTeX),
                         protocol.ts, results.ts (figures, Table 1), rollouts.ts, evaluation.ts, nav.ts
src/lib/components/      Svelte components, each with its own styles
src/lib/types.ts         content types (Video, Clip, Task, Image, …)
src/lib/media.ts         media URLs and video MIME types
src/lib/config.ts        site URL, media base URL, R2 bucket and prefix
src/lib/enhance.ts       the only browser JS (inlined): section nav, video playback, YouTube facade, copy
src/routes/              the page, 404 page, sitemap.xml
src/app.css              design tokens, fonts, global element styles
src/app.html             document shell (favicon, font preload, Google Analytics, currently off)
static/                  copied as is: fonts, figures, favicon, social image, robots.txt, _headers
media/                   git-ignored working copy of the R2 prefix (videos and posters)
scripts/encode-video.ts  encodes one video into media/ (AV1 + H.264 + poster)
scripts/sync-media.ts    uploads media/ to R2
```

## Develop

```sh
bun install
bun run dev       # http://localhost:5173 (serves media/ at /media)
bun run check     # svelte-check: types and Svelte diagnostics
bun run format    # prettier
bun run build     # → dist/
```

A production build points videos at `https://media.huzheyuan.io/rac`. To try a build locally
against your `media/` folder:

```sh
VITE_MEDIA_BASE=/media bun run build && bun run preview
```

## Edit content

Everything on the page comes from `src/lib/content/`. The type checker (`bun run check`) catches
missing or misspelled fields.

- **Links**: `paper.ts`. Set `code` to the repository URL once the code is out; the button
  changes from "coming soon" to a link.
- **Rollout clips**: `rollouts.ts`. Each task is a playlist; the first clip is loaded in the
  player. Add a clip by encoding it (below) and adding `{ key, caption, duration }`.
- **Figures**: put a WebP (about 2000 px wide, white background) in `static/images/` and
  reference it with its pixel size and alt text, as in `results.ts`.

## Media

Every video is stored twice, and browsers take the first one they can play:

- `<key>.av1.mp4`: AV1 (SVT-AV1), roughly half the size at the same quality;
- `<key>.h264.mp4`: H.264, for devices without AV1 (Safari only reports AV1 where there is a
  hardware decoder, so older iPhones and Macs use this one);
- `<key>.jpg`: the poster.

Encode a clip and print its entry for the content file (needs ffmpeg with libsvtav1, libx264 and
libvmaf):

```sh
bun scripts/encode-video.ts raw/clip.mp4 shirt_hanging/shirt_hang_6 --width 1280 --vmaf
```

Rollouts are 1280×720 (the player is at most about 640 CSS px wide; at the same bitrate 720p
also scored better than 540p upscaled). Tune `--av1-crf` and `--h264-crf` per clip so the VMAF
printed by `--vmaf` is about 94 for AV1 and 93 for H.264 (the full-width protocol and
comparison videos: about 95 for AV1). Those two are already web H.264 at their size and use
`--h264-copy`: re-encoding them would lose quality and save almost nothing.

Then upload:

```sh
bunx wrangler login          # once
bun run media:sync --dry     # see what would be uploaded
bun run media:sync           # uploads new or changed files to huzheyuan-media/rac/
```

`media:sync` uploads only new or changed files (tracked in `media/.synced.json`). Files are
served with a one-year cache, so give a changed video a new key. Keep `media/` backed up; with
the bucket it is the only copy of the encoded videos (the originals are in this repository's
git history, before the redesign).

## Deploy

`bun run build` writes the static site to `dist/`. Host it on any static host (Cloudflare
Pages reads `static/_headers` for cache headers).
