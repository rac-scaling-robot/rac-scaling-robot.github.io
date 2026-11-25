<!--
	One task's rollouts: a single player plus the list of clips. Only the selected clip is ever
	loaded. #lib/enhance.ts (`data-playlist`) swaps the player's sources when a clip is chosen,
	advances to the next clip at the end, and plays the player only while it is on screen
	(`data-autoplay`). Without JavaScript each clip links to its MP4.
-->
<script lang="ts">
	import { av1Type, av1Url, formatDuration, h264Type, h264Url, posterUrl } from '#lib/media.js';
	import type { Task } from '#lib/types.js';
	import Icon from './Icon.svelte';

	let { task }: { task: Task } = $props();

	const first = $derived(task.clips[0]);
	const label = (caption: string) => `${task.title}: ${caption}`;
</script>

<article class="task" id={task.id} aria-labelledby="{task.id}-title" data-playlist>
	<header class="head">
		<h3 id="{task.id}-title">{task.title}</h3>
		<p class="count">{task.clips.length} rollouts</p>
	</header>

	<div class="layout">
		<div class="screen" style:aspect-ratio="{first.width} / {first.height}">
			<video
				controls
				muted
				loop
				playsinline
				preload="none"
				data-poster={posterUrl(first)}
				width={first.width}
				height={first.height}
				aria-label={label(first.caption)}
				data-autoplay
			>
				<source src={av1Url(first)} type={av1Type(first)} />
				<source src={h264Url(first)} type={h264Type(first)} />
			</video>
		</div>

		<ul class="clips" aria-label="{task.title} rollouts">
			{#each task.clips as clip, i (clip.key)}
				<li>
					<a
						class="clip"
						href={h264Url(clip)}
						aria-current={i === 0 ? 'true' : undefined}
						data-av1={av1Url(clip)}
						data-h264={h264Url(clip)}
						data-poster={posterUrl(clip)}
						data-label={label(clip.caption)}
					>
						<span class="marker"><Icon name="play" size={12} /></span>
						<span class="caption">{clip.caption}</span>
						<span class="duration">
							<span class="visually-hidden">Duration</span>
							{formatDuration(clip.duration)}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</article>

<style>
	.task {
		margin-top: clamp(3rem, 6vw, 4.5rem);
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.25rem 1rem;
		margin-bottom: 1rem;
	}

	h3 {
		font-size: clamp(1.375rem, 1.2rem + 0.6vw, 1.625rem);
		line-height: 1.2;
	}

	.count {
		color: var(--ink-3);
		font-size: 0.875rem;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem 1.5rem;
		align-items: start;
	}

	@container (min-width: 50rem) {
		.layout {
			grid-template-columns: minmax(0, 1.7fr) minmax(15rem, 1fr);
		}
	}

	.screen {
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

	.clips {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.clip {
		display: grid;
		grid-template-columns: 1.5rem minmax(0, 1fr) auto;
		gap: 0.15rem 0.5rem;
		padding: 0.6rem 0.75rem 0.6rem 0.5rem;
		border-radius: 8px;
		color: var(--ink-2);
		font-size: 0.9375rem;
		line-height: 1.4;
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.clip:hover {
		background: var(--surface-2);
		color: var(--ink);
	}

	.clip[aria-current='true'] {
		background: var(--surface);
		box-shadow: 0 0 0 1px var(--line);
		color: var(--ink);
	}

	.marker {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.4em;
		color: var(--ink-3);
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.clip:hover .marker,
	.clip:focus-visible .marker {
		opacity: 1;
	}

	.clip[aria-current='true'] .marker {
		color: var(--accent);
		opacity: 1;
	}

	.duration {
		color: var(--ink-3);
		font-size: 0.8125rem;
		line-height: 1.75;
		font-variant-numeric: tabular-nums;
	}

	.clip:focus-visible {
		outline-offset: 1px;
	}
</style>
