<!--
	The two-hour uncut evaluation on YouTube, behind a click-to-load facade: no YouTube request
	until the visitor asks for it. #lib/enhance.ts swaps the link for the embed (`data-youtube`);
	without JavaScript the link opens the video on YouTube.
-->
<script lang="ts">
	import { evaluation } from '#lib/content/evaluation.js';
	import Icon from './Icon.svelte';
	import Section from './Section.svelte';

	const { youtube } = evaluation;
</script>

<Section id="evaluation" title={evaluation.title}>
	<p class="prose summary">{evaluation.summary}</p>

	<div
		class="frame"
		style:aspect-ratio="{youtube.poster.width} / {youtube.poster.height}"
		data-youtube={youtube.embed}
		data-title={evaluation.title}
	>
		<a class="facade" href={youtube.watch}>
			<img
				src={youtube.poster.src}
				alt=""
				width={youtube.poster.width}
				height={youtube.poster.height}
				loading="lazy"
				decoding="async"
			/>
			<span class="pill">
				<span class="disc"><Icon name="play" size={16} /></span>
				<span>Play on YouTube<span class="visually-hidden">: {evaluation.title}</span></span>
				<span class="duration">{youtube.duration}</span>
			</span>
		</a>
	</div>
</Section>

<style>
	.summary {
		margin-bottom: 1.5rem;
	}

	.frame {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		background: #000;
		box-shadow: 0 0 0 1px var(--line);
	}

	.facade {
		display: block;
		height: 100%;
	}

	.facade:focus-visible {
		outline-offset: -4px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.2s ease;
	}

	.facade:hover img {
		opacity: 0.88;
	}

	.pill {
		position: absolute;
		left: clamp(0.75rem, 2.5vw, 1.25rem);
		bottom: clamp(0.75rem, 2.5vw, 1.25rem);
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

	.facade:hover .pill {
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
		color: #4a4e57;
	}

	.frame :global(iframe) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
