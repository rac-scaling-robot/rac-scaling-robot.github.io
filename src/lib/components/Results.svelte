<script lang="ts">
	import { results } from '#lib/content/results.js';
	import Figure from './Figure.svelte';
	import PriorWorkTable from './PriorWorkTable.svelte';
	import Section from './Section.svelte';
</script>

<Section id="results" title={results.title}>
	<div class="finding">
		<p class="prose">{results.scaling.text}</p>
		<Figure image={results.scaling.figure} />
	</div>

	<div class="finding">
		<p class="prose">{results.priorWork.text}</p>
		<PriorWorkTable />
	</div>

	<div class="finding">
		<p class="prose">{results.testTime.text}</p>
		<Figure image={results.testTime.figure} />
	</div>
</Section>

<style>
	.finding + .finding {
		margin-top: clamp(3rem, 6vw, 4.5rem);
	}

	.finding > .prose {
		margin-bottom: 1.25rem;
	}
</style>
