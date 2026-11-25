// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {}

	interface ImportMetaEnv {
		/** Overrides `site.mediaBase` in a build, e.g. `/media` to preview a build locally. */
		readonly VITE_MEDIA_BASE?: string;
	}
}

export {};
