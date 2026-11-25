<!-- A titled page section. Its id is the anchor the section nav links to. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { id, title, children }: { id: string; title: string; children: Snippet } = $props();
</script>

<section {id} class="section" aria-labelledby="{id}-title">
	<h2 class="heading" id="{id}-title">{title}</h2>
	{@render children()}
</section>

<style>
	.section {
		margin-top: clamp(4.5rem, 9vw, 7.5rem);
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
	}

	.heading {
		max-width: 26em;
		margin-bottom: clamp(1.25rem, 2.5vw, 1.75rem);
		font-size: clamp(1.75rem, 1.35rem + 1.3vw, 2.375rem);
		line-height: 1.12;
		letter-spacing: -0.01em;
	}
</style>
