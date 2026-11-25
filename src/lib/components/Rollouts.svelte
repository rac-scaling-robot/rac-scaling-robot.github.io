<script lang="ts">
	import { rollouts } from '#lib/content/rollouts.js';
	import Player from './Player.svelte';
	import Playlist from './Playlist.svelte';
	import Section from './Section.svelte';
</script>

<Section id="rollouts" title={rollouts.title}>
	<p class="note">{rollouts.note}</p>

	<div class="comparison">
		<h3>{rollouts.comparison.title}</h3>
		<Player video={rollouts.comparison.video} label={rollouts.comparison.label} />
	</div>

	{#each rollouts.tasks as task (task.id)}
		<Playlist {task} />
	{/each}
</Section>

<style>
	.note {
		max-width: var(--measure);
		color: var(--ink-2);
	}

	.comparison {
		margin-top: clamp(2rem, 4vw, 2.75rem);
	}

	h3 {
		margin-bottom: 1rem;
		font-size: clamp(1.375rem, 1.2rem + 0.6vw, 1.625rem);
		line-height: 1.2;
	}
</style>
