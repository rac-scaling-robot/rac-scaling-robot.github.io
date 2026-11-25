/**
 * Looping SVG (SMIL) animation tracks, built at build time. Every track of a figure shares one
 * loop length and starts together, so they stay in sync; #lib/enhance.ts only pauses, resumes or
 * freezes the whole figure (`svg[data-timeline]`).
 */

/** `[seconds, value, eased]`: the value at that time; `eased` eases the segment ending there. */
export type Frame = readonly [time: number, value: number, eased?: boolean];

const EASE = '0.45 0 0.3 1';
const LINEAR = '0 0 1 1';

/**
 * Attributes for an `<animate>` (`values`) or `<animateMotion>` (`keyPoints`) element that holds
 * the first value until its first frame and the last value until the end of the loop.
 */
export function track(
	loop: number,
	frames: readonly Frame[],
	key: 'values' | 'keyPoints' = 'values'
) {
	const all: Frame[] = [...frames];
	if (all[0][0] > 0) all.unshift([0, all[0][1]]);
	if (all[all.length - 1][0] < loop) all.push([loop, all[all.length - 1][1]]);
	return {
		dur: `${loop}s`,
		repeatCount: 'indefinite',
		calcMode: 'spline',
		keyTimes: all.map(([time]) => +(time / loop).toFixed(4)).join(';'),
		keySplines: all
			.slice(1)
			.map(([, , eased]) => (eased ? EASE : LINEAR))
			.join(';'),
		[key]: all.map(([, value]) => value).join(';')
	};
}
