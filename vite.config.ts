import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import sirv from 'sirv';
import { defineConfig, type Plugin } from 'vite';

/**
 * Serves the git-ignored `media/` folder (local copy of the R2 prefix) at `/media` in
 * `vite dev`, and in `vite preview` for builds made with `VITE_MEDIA_BASE=/media`.
 */
function localMedia(dir = 'media'): Plugin {
	const serve = sirv(dir, { dev: true });
	return {
		name: 'local-media',
		configureServer(server) {
			server.middlewares.use('/media', serve);
		},
		configurePreviewServer(server) {
			server.middlewares.use('/media', serve);
		}
	};
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: { runes: true },
			// Every page is prerendered to static HTML in dist/.
			adapter: adapter({ pages: 'dist' }),
			// Inline all CSS into the HTML: no render-blocking stylesheet request.
			inlineStyleThreshold: Infinity,
			// Absolute /_app/ URLs, so 404.html also works when served for nested paths.
			paths: { relative: false }
		}),
		localMedia()
	]
});
