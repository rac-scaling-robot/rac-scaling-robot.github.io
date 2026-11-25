<script lang="ts">
	import { paper } from '#lib/content/paper.js';
</script>

<svelte:head>
	<title>Not found · {paper.acronym}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="not-found wrap">
	<p class="code">404</p>
	<h1>This page doesn’t exist.</h1>
	<p><a href="/">Go to the {paper.acronym} project page</a></p>
</main>

<style>
	.not-found {
		padding-top: 20vh;
	}

	.code {
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	h1 {
		margin-top: 0.5rem;
		font-size: clamp(2.25rem, 5vw, 3.5rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	h1 + p {
		margin-top: 1.5rem;
	}
</style>
