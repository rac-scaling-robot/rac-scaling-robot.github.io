// Uploads new or changed files in media/ to the R2 bucket behind site.mediaBase, under the
// `site.r2Prefix/` key prefix. media/.synced.json records the hash of each uploaded file so
// unchanged files are skipped. Needs a one-time `bunx wrangler login`.
//
//   bun run media:sync           upload new and changed files
//   bun run media:sync --all     re-upload everything
//   bun run media:sync --dry     list what would be uploaded
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { site } from '../src/lib/config.ts';

const DIR = 'media';
const MANIFEST = path.join(DIR, '.synced.json');
const CONTENT_TYPES: Record<string, string> = {
	'.mp4': 'video/mp4',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.pdf': 'application/pdf'
};
// Media is cached for a year: give a changed file a new name instead of overwriting it.
const CACHE_CONTROL = 'public, max-age=31536000';

const uploadAll = process.argv.includes('--all');
const dryRun = process.argv.includes('--dry');

async function readManifest(): Promise<Record<string, string>> {
	try {
		return JSON.parse(await readFile(MANIFEST, 'utf8'));
	} catch {
		return {}; // first run
	}
}

async function listFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });
	return entries
		.filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
		.map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
		.sort();
}

const synced = await readManifest();
let uploaded = 0;
let skipped = 0;

for (const file of await listFiles(DIR)) {
	const key = file.split(path.sep).join('/');
	const data = await readFile(path.join(DIR, file));
	const hash = createHash('sha256').update(data).digest('hex');
	if (!uploadAll && synced[key] === hash) {
		skipped++;
		continue;
	}

	const object = `${site.r2Bucket}/${site.r2Prefix}/${key}`;
	const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
	process.stdout.write(`↑ ${object} (${(data.length / 1e6).toFixed(1)} MB) ... `);
	if (dryRun) {
		console.log('skipped (dry run)');
		continue;
	}
	// prettier-ignore
	execFileSync('bunx', [
		'wrangler', 'r2', 'object', 'put', object,
		'--file', path.join(DIR, file),
		'--content-type', contentType,
		'--cache-control', CACHE_CONTROL,
		'--remote'
	], { stdio: ['ignore', 'ignore', 'inherit'] });
	console.log('done');

	synced[key] = hash;
	uploaded++;
	await writeFile(MANIFEST, JSON.stringify(synced, null, 2) + '\n');
}

console.log(`uploaded ${uploaded}, skipped ${skipped} unchanged → ${site.mediaBase}`);
