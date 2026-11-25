<!--
	A click-to-play video: poster plus a play button until the first play, then native controls.
	Nothing is downloaded before the click (preload="none"), and the poster only once the video
	is near the screen (`data-poster`). Without JavaScript the native controls are shown from
	the start. Wired up by #lib/enhance.ts (`data-player`).
-->
<script lang="ts">
	import { av1Type, av1Url, formatDuration, h264Type, h264Url, posterUrl } from '#lib/media.js';
	import type { Video } from '#lib/types.js';
	import Icon from './Icon.svelte';

	let { video, label }: { video: Video; label: string } = $props();
</script>

<div class="player" data-player style:aspect-ratio="{video.width} / {video.height}">
	<video
		controls
		muted
		playsinline
		preload="none"
		data-poster={posterUrl(video)}
		width={video.width}
		height={video.height}
		aria-label={label}
	>
		<source src={av1Url(video)} type={av1Type(video)} />
		<source src={h264Url(video)} type={h264Type(video)} />
		<a href={h264Url(video)}>Download the video (MP4)</a>
	</video>
	<button class="overlay" type="button" hidden>
		<span class="pill">
			<span class="disc"><Icon name="play" size={16} /></span>
			<span>Play<span class="visually-hidden">: {label}</span></span>
			<span class="duration">{formatDuration(video.duration)}</span>
		</span>
	</button>
</div>

<style>
	.player {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		background: #000;
		box-shadow: 0 0 0 1px var(--line);
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		padding: clamp(0.75rem, 2.5vw, 1.25rem);
		border: 0;
		background: linear-gradient(to top, rgb(0 0 0 / 0.35), transparent 40%);
		cursor: pointer;
	}

	.overlay[hidden] {
		display: none;
	}

	.overlay:focus-visible {
		outline-offset: -4px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.35rem 1rem 0.35rem 0.35rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.94);
		color: #15171b;
		font-size: 0.9375rem;
		font-weight: 600;
		box-shadow: 0 6px 24px rgb(0 0 0 / 0.25);
		transition: transform 0.2s ease;
	}

	.overlay:hover .pill {
		transform: scale(1.04);
	}

	.disc {
		display: grid;
		place-items: center;
		width: 2.125rem;
		height: 2.125rem;
		border-radius: 50%;
		background: #3a4fd6;
		color: #fff;
	}

	.disc :global(svg) {
		margin-left: 2px;
	}

	.duration {
		font-weight: 400;
		font-variant-numeric: tabular-nums;
		color: #4a4e57;
	}
</style>
