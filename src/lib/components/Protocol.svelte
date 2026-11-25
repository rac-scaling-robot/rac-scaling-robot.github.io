<script lang="ts">
	import { protocol } from '#lib/content/protocol.js';
	import Player from './Player.svelte';
	import ProtocolDiagram from './ProtocolDiagram.svelte';
	import Section from './Section.svelte';
</script>

<Section id="data-collection" title={protocol.title}>
	<div class="split">
		<div>
			<p class="prose">{protocol.intro}</p>
			<ol class="rules">
				{#each protocol.rules as rule, i (i)}
					<li class="prose">{rule}</li>
				{/each}
			</ol>
		</div>
		<ProtocolDiagram />
	</div>

	<Player video={protocol.video} label={protocol.videoLabel} />
</Section>

<style>
	.split {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 2rem 3.5rem;
		align-items: start;
		margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
	}

	@container (min-width: 52rem) {
		.split {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		}
	}

	.rules {
		margin-top: 1.25rem;
		padding: 0;
		list-style: none;
		counter-reset: rule;
	}

	.rules li {
		position: relative;
		padding-left: 2.25rem;
		counter-increment: rule;
	}

	.rules li + li {
		margin-top: 1rem;
	}

	/* Rule numbers hang in the margin, in the serif. */
	.rules li::before {
		content: counter(rule);
		position: absolute;
		top: -0.18em;
		left: 0;
		font-size: 1.6em;
		line-height: 1.2;
		color: var(--accent);
		font-variant-numeric: lining-nums;
	}
</style>
