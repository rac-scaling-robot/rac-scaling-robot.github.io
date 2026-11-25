export const site = {
	url: 'https://rac.huzheyuan.io',
	/** Public URL of the R2 prefix that serves the videos and posters in `media/`. */
	mediaBase: 'https://media.huzheyuan.io/rac',
	/** `bun run media:sync` uploads `media/` to this R2 bucket under `r2Prefix/`. */
	r2Bucket: 'huzheyuan-media',
	r2Prefix: 'rac'
} as const;
