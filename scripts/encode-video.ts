// Encodes one video for the web into media/: `<key>.av1.mp4` (SVT-AV1), `<key>.h264.mp4`
// (x264) and a `<key>.jpg` poster, then prints the entry for src/lib/content/.
// Needs ffmpeg with libsvtav1, libx264 (and libvmaf for --vmaf) on PATH.
//
//   bun scripts/encode-video.ts <input> <key> [options]
//
//   --width <px>        scale down to this width (default: keep); use about 2× the CSS width
//   --av1-crf <n>       SVT-AV1 quality, lower is better (default 47)
//   --h264-crf <n>      x264 quality, lower is better (default 26; fractions allowed)
//   --h264-copy         remux the source's H.264 stream instead (no --width): when the source
//                       is already web H.264 at the output size, re-encoding only loses quality
//   --poster-at <s>     poster frame time in seconds (default 0)
//   --poster <image>    use this image as the poster instead (e.g. the source's cover art)
//   --vmaf              score both encodes against the source scaled to the output size
//
// Both encodes drop audio and any embedded cover-art stream (-map 0:v:0), keep the frame rate,
// and put the index first (+faststart) so playback starts before the download finishes.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		width: { type: 'string' },
		'av1-crf': { type: 'string', default: '47' },
		'h264-crf': { type: 'string', default: '26' },
		'h264-copy': { type: 'boolean', default: false },
		'poster-at': { type: 'string', default: '0' },
		poster: { type: 'string' },
		vmaf: { type: 'boolean', default: false }
	}
});
const [input, key] = positionals;
if (!input || !key) {
	console.error('usage: bun scripts/encode-video.ts <input> <key> [--width 1280] [--vmaf] …');
	process.exit(1);
}

const out = (ext: string) => path.join('media', `${key}.${ext}`);
mkdirSync(path.dirname(out('mp4')), { recursive: true });

const ffmpeg = (...args: string[]) =>
	execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
		stdio: ['ignore', 'pipe', 'inherit']
	});
const probe = (file: string, entries: string) =>
	execFileSync('ffprobe', [
		'-v',
		'error',
		'-select_streams',
		'v:0',
		'-show_entries',
		entries,
		'-of',
		'csv=p=0',
		file
	])
		.toString()
		.trim();

const scale = values.width ? `scale=${values.width}:-2:flags=lanczos,` : '';
const filters = `${scale}format=yuv420p`;
const common = ['-map', '0:v:0', '-an', '-sn', '-dn', '-map_metadata', '-1', '-vf', filters];
// A keyframe every 10 s: the clips are mostly static scenes, and seeking stays quick.
const gop = ['-g', '300'];

console.log(`AV1  → ${out('av1.mp4')}`);
// prettier-ignore
ffmpeg('-i', input, ...common,
	'-c:v', 'libsvtav1', '-preset', '4', '-crf', values['av1-crf']!, ...gop,
	'-movflags', '+faststart', out('av1.mp4'));

console.log(`H264 → ${out('h264.mp4')}`);
if (values['h264-copy']) {
	if (values.width) throw new Error('--h264-copy cannot scale; drop --width');
	// prettier-ignore
	ffmpeg('-i', input, '-map', '0:v:0', '-an', '-sn', '-dn', '-map_metadata', '-1',
		'-c:v', 'copy', '-movflags', '+faststart', out('h264.mp4'));
} else {
	// prettier-ignore
	ffmpeg('-i', input, ...common,
		'-c:v', 'libx264', '-preset', 'slow', '-crf', values['h264-crf']!, ...gop,
		'-profile:v', 'high', '-level:v', '4.0',
		'-movflags', '+faststart', out('h264.mp4'));
}

/** Codec string from the avcC box, e.g. `avc1.640028` (High profile, level 4.0). */
function h264Codec(file: string) {
	const data = readFileSync(file);
	const box = data.indexOf('avcC') + 4;
	const hex = (byte: number) => byte.toString(16).padStart(2, '0');
	return `avc1.${hex(data[box + 1])}${hex(data[box + 2])}${hex(data[box + 3])}`;
}

/** Codec string from the av1C box, e.g. `av01.0.05M.08`. */
function av1Codec(file: string) {
	const data = readFileSync(file);
	const box = data.indexOf('av1C') + 4;
	const profile = data[box + 1] >> 5;
	const level = data[box + 1] & 31;
	const tier = data[box + 2] >> 7 ? 'H' : 'M';
	const bits = (data[box + 2] >> 6) & 1 ? 10 : 8;
	return `av01.${profile}.${String(level).padStart(2, '0')}${tier}.${String(bits).padStart(2, '0')}`;
}

function vmaf(file: string, width: string, height: string) {
	// Frame-index timestamps on both sides, so frames pair up even if start times differ.
	const sync = 'settb=AVTB,setpts=N/FRAME_RATE/TB';
	const graph =
		`[0:v]${sync},format=yuv420p[d];` +
		`[1:v:0]scale=${width}:${height}:flags=lanczos,${sync},format=yuv420p[r];` +
		`[d][r]libvmaf=model=version=vmaf_v0.6.1:n_subsample=3:n_threads=8`;
	// ffmpeg prints the score on stderr.
	const { stderr } = spawnSync(
		'ffmpeg',
		['-hide_banner', '-i', file, '-i', input, '-lavfi', graph, '-f', 'null', '-'],
		{ encoding: 'utf8' }
	);
	return Number(/VMAF score: ([\d.]+)/.exec(stderr)?.[1]);
}

const [width, height] = probe(out('h264.mp4'), 'stream=width,height').split(',');
const duration = Number(probe(out('h264.mp4'), 'format=duration'));

// The poster has the video's width (a cover image may be larger, e.g. 4K).
console.log(`JPG  → ${out('jpg')}`);
const posterFilters = `scale=${width}:-2:flags=lanczos,format=yuvj420p`;
if (values.poster) {
	ffmpeg('-i', values.poster, '-vf', posterFilters, '-q:v', '4', out('jpg'));
} else {
	// prettier-ignore
	ffmpeg('-ss', values['poster-at']!, '-i', input, '-map', '0:v:0', '-frames:v', '1',
		'-vf', posterFilters, '-q:v', '4', out('jpg'));
}

const mb = (file: string) => (statSync(file).size / 1e6).toFixed(1);
const codecs = { av1: av1Codec(out('av1.mp4')), h264: h264Codec(out('h264.mp4')) };
console.log(
	`\nAV1 ${mb(out('av1.mp4'))} MB (${codecs.av1}), H.264 ${mb(out('h264.mp4'))} MB (${codecs.h264})`
);
if (values.vmaf) {
	console.log(
		`VMAF  AV1 ${vmaf(out('av1.mp4'), width, height).toFixed(2)}  H.264 ${vmaf(out('h264.mp4'), width, height).toFixed(2)}`
	);
}
console.log(
	`\n{ key: '${key}', width: ${width}, height: ${height}, duration: ${duration.toFixed(2)}, ` +
		`codecs: { av1: '${codecs.av1}', h264: '${codecs.h264}' } }`
);
