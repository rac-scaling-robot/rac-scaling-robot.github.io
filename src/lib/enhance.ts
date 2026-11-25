/**
 * The site's only client-side code. The page is plain prerendered HTML (`csr = false`) and
 * inlines this function as a module script via `Function.prototype.toString()`. It must
 * therefore be self-contained: no imports and no references to outer variables.
 * Everything works without it; it only adds the behavior below.
 *
 * Markup contract:
 * - `video[data-poster]` gets its poster once it is within a screen height of the viewport
 *   (browsers fetch `poster` images eagerly, even with preload="none").
 * - `[data-spy]` holds the section nav links; the link of the section in view gets
 *   `aria-current="true"`.
 * - `[data-player]` wraps a click-to-play `video` and a hidden `button` overlay: the button is
 *   shown instead of the native controls until the first play.
 * - `video[data-autoplay]` plays while at least half on screen (never with reduced motion).
 *   Any video that leaves the screen while playing is paused, and resumed when it is back.
 * - `[data-playlist]` holds a `video` and links with `data-av1`, `data-h264`, `data-poster` and
 *   `data-label`: choosing one loads it into the video; at the end the next clip plays.
 * - `[data-youtube]` (embed URL) holds a link that is replaced by the YouTube embed on click.
 * - `button[data-copy]` (hidden) copies the text of the element with that id.
 * - `svg[data-timeline]` holds looping SMIL animations: they run only while the figure is on
 *   screen, and are removed with reduced motion (the base attributes are the finished figure).
 */
export function enhance() {
	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';

	// ---- Section nav: highlight the section crossing the upper third of the viewport.
	const nav = document.querySelector<HTMLElement>('[data-spy]');
	if (nav) {
		const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
		let current = '';
		const mark = (id: string) => {
			if (id === current) return;
			current = id;
			for (const link of links) {
				if (link.hash !== `#${id}`) {
					link.removeAttribute('aria-current');
					continue;
				}
				link.setAttribute('aria-current', 'true');
				// Narrow screens: keep the active link visible in the sideways-scrolling bar.
				if (nav.scrollWidth > nav.clientWidth) {
					nav.scrollTo({ left: link.parentElement!.offsetLeft - 8, behavior });
				}
			}
		};
		const spy = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) mark(entry.target.id);
			},
			{ rootMargin: '-30% 0px -69% 0px' }
		);
		for (const link of links) {
			const section = document.getElementById(link.hash.slice(1));
			if (section) spy.observe(section);
		}
		// The last section may be too short to reach the line: mark it at the bottom of the page.
		const last = links[links.length - 1].hash.slice(1);
		addEventListener(
			'scroll',
			() => {
				if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) mark(last);
			},
			{ passive: true }
		);
	}

	// ---- Posters: fetch only when a video comes near the screen.
	const posters = new IntersectionObserver(
		(entries) => {
			for (const { target, isIntersecting } of entries) {
				if (!isIntersecting) continue;
				const video = target as HTMLVideoElement;
				// A playlist may already have set the poster of another clip.
				if (!video.getAttribute('poster')) video.poster = video.dataset.poster!;
				posters.unobserve(video);
			}
		},
		{ rootMargin: '100% 0px' }
	);
	for (const video of document.querySelectorAll<HTMLVideoElement>('video[data-poster]')) {
		posters.observe(video);
	}

	// ---- Videos: play autoplay videos while on screen; pause anything that scrolls away.
	const resume = new WeakSet<HTMLVideoElement>();
	const watcher = new IntersectionObserver(
		(entries) => {
			for (const { target, intersectionRatio } of entries) {
				const video = target as HTMLVideoElement;
				if (intersectionRatio >= 0.5) {
					if (resume.delete(video) || ('autoplay' in video.dataset && !reduceMotion)) {
						video.play().catch(() => {});
					}
				} else if (!video.paused) {
					resume.add(video);
					video.pause();
				}
			}
		},
		{ threshold: [0, 0.5] }
	);
	for (const video of document.querySelectorAll('video')) watcher.observe(video);

	// ---- Click-to-play players.
	for (const player of document.querySelectorAll<HTMLElement>('[data-player]')) {
		const video = player.querySelector('video')!;
		const button = player.querySelector('button')!;
		video.controls = false;
		video.tabIndex = -1;
		button.hidden = false;
		button.addEventListener('click', () => {
			button.hidden = true;
			video.controls = true;
			video.tabIndex = 0;
			video.play().catch(() => {});
			video.focus({ preventScroll: true });
		});
	}

	// ---- Playlists: one player per task; only the chosen clip is loaded.
	for (const playlist of document.querySelectorAll<HTMLElement>('[data-playlist]')) {
		const video = playlist.querySelector('video')!;
		const [av1, h264] = video.querySelectorAll('source');
		const clips = [...playlist.querySelectorAll<HTMLAnchorElement>('a[data-h264]')];
		let index = 0;
		const select = (next: number) => {
			const clip = clips[next];
			clips[index].removeAttribute('aria-current');
			clip.setAttribute('aria-current', 'true');
			index = next;
			av1.src = clip.dataset.av1!;
			h264.src = clip.dataset.h264!;
			video.poster = clip.dataset.poster!;
			video.setAttribute('aria-label', clip.dataset.label!);
			video.load();
			video.play().catch(() => {});
		};
		video.loop = false;
		video.addEventListener('ended', () => {
			if (!reduceMotion) select((index + 1) % clips.length);
		});
		clips.forEach((clip, i) =>
			clip.addEventListener('click', (event) => {
				event.preventDefault();
				if (i !== index) select(i);
				else if (video.paused) video.play().catch(() => {});
				// On phones the list sits below the player: bring the player into view.
				const { top, bottom } = video.getBoundingClientRect();
				if (top < 0 || bottom > innerHeight) video.scrollIntoView({ block: 'nearest', behavior });
			})
		);
	}

	// ---- YouTube: load the embed only when asked.
	for (const frame of document.querySelectorAll<HTMLElement>('[data-youtube]')) {
		frame.querySelector('a')!.addEventListener('click', (event) => {
			event.preventDefault();
			const url = new URL(frame.dataset.youtube!);
			url.searchParams.set('autoplay', '1');
			const iframe = document.createElement('iframe');
			iframe.src = url.href;
			iframe.title = frame.dataset.title ?? 'YouTube video player';
			iframe.allow =
				'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
			iframe.referrerPolicy = 'strict-origin-when-cross-origin';
			iframe.allowFullscreen = true;
			frame.replaceChildren(iframe);
			iframe.focus();
		});
	}

	// ---- Copy buttons.
	for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-copy]')) {
		const source = document.getElementById(button.dataset.copy!)!;
		const label = button.querySelector('span')!;
		let timer = 0;
		button.hidden = false;
		button.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(source.textContent ?? '');
				label.textContent = 'Copied';
			} catch {
				// No clipboard access: select the text so it can be copied by hand.
				getSelection()?.selectAllChildren(source);
				label.textContent = 'Selected';
			}
			clearTimeout(timer);
			timer = window.setTimeout(() => (label.textContent = 'Copy'), 2000);
		});
	}

	// ---- Animated figures: play from the start once on screen, pause while off it.
	for (const svg of document.querySelectorAll<SVGSVGElement>('svg[data-timeline]')) {
		if (reduceMotion) {
			// Without its animations the figure shows its finished state.
			for (const animation of svg.querySelectorAll('animate, animateMotion')) animation.remove();
			continue;
		}
		svg.pauseAnimations();
		svg.setCurrentTime(0);
		new IntersectionObserver(
			([entry]) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()),
			{ threshold: 0.6 }
		).observe(svg);
	}
}
