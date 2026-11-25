<script lang="ts">
	import Citation from '#lib/components/Citation.svelte';
	import Evaluation from '#lib/components/Evaluation.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Nav from '#lib/components/Nav.svelte';
	import Protocol from '#lib/components/Protocol.svelte';
	import Results from '#lib/components/Results.svelte';
	import Rollouts from '#lib/components/Rollouts.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { enhance } from '#lib/enhance.js';
</script>

<Seo />

<svelte:head>
	{@html `<script type="module">(${enhance.toString()})();</script>`}
</svelte:head>

<a class="skip" href="#main">Skip to content</a>

<div class="page wrap">
	<Nav />
	<main id="main">
		<Hero />
		<Protocol />
		<Results />
		<Rollouts />
		<Evaluation />
		<Citation />
	</main>
</div>

<Footer />

<style>
	.skip {
		position: absolute;
		top: -3rem;
		left: 1rem;
		z-index: 20;
		padding: 0.5rem 0.8rem;
		border-radius: 6px;
		background: var(--surface);
		box-shadow: 0 0 0 1px var(--line);
	}

	.skip:focus {
		top: 0.5rem;
	}

	/* Sections lay out by the width of this column (container queries), not the viewport. */
	main {
		min-width: 0;
		container-type: inline-size;
	}

	@media (min-width: 64rem) {
		.page {
			display: grid;
			grid-template-columns: var(--rail) minmax(0, 1fr);
			column-gap: clamp(2.5rem, 4vw, 4.5rem);
		}
	}
</style>
