import { dev } from '$app/env';
import { site } from '#lib/config.js';
import type { Video } from '#lib/types.js';

// The dev server serves the local media/ folder at /media (see vite.config.ts).
const base = dev ? '/media' : import.meta.env.VITE_MEDIA_BASE || site.mediaBase;

/** URL of a file in the media bucket. */
export const mediaUrl = (key: string) => `${base}/${key}`;

/**
 * MIME types with the exact codec of each file (see scripts/encode-video.ts), so browsers skip
 * a source they cannot decode without downloading it. Safari reports AV1 only where it has a
 * hardware decoder, so older iPhones and Macs fall back to H.264.
 */
export const av1Type = (video: Video) => `video/mp4; codecs="${video.codecs.av1}"`;
export const h264Type = (video: Video) => `video/mp4; codecs="${video.codecs.h264}"`;

export const av1Url = (video: Video) => mediaUrl(`${video.key}.av1.mp4`);
export const h264Url = (video: Video) => mediaUrl(`${video.key}.h264.mp4`);
export const posterUrl = (video: Video) => mediaUrl(`${video.key}.jpg`);

/** `127.6` → `"2:08"`. */
export function formatDuration(seconds: number) {
	const s = Math.round(seconds);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
