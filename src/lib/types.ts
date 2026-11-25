export interface Author {
	name: string;
	url: string;
}

/**
 * A video in the media bucket, encoded twice: `<key>.av1.mp4` (tried first) and
 * `<key>.h264.mp4` (fallback), plus a `<key>.jpg` poster. See `#lib/media`.
 */
export interface Video {
	key: string;
	width: number;
	height: number;
	/** Seconds. */
	duration: number;
	/** Codec strings of the two files (printed by scripts/encode-video.ts). */
	codecs: { av1: string; h264: string };
}

/** One autonomous rollout in a task's playlist. */
export interface Clip extends Video {
	caption: string;
}

export interface Task {
	/** Anchor id on the page. */
	id: string;
	title: string;
	/** In display order; the first clip is loaded in the player. */
	clips: Clip[];
}

/** A static image in `static/` with its intrinsic size (prevents layout shift). */
export interface Image {
	src: string;
	width: number;
	height: number;
	alt: string;
}

export interface Section {
	/** Anchor id; also used by the section nav. */
	id: string;
	/** Short label in the section nav. */
	nav: string;
}
