<!--
	Section navigation. Wide screens: a sticky rail on the left with a vertical track.
	Narrow screens: a sticky bar across the top whose links scroll sideways.
	#lib/enhance.ts marks the link of the section in view with aria-current (`data-spy`).
-->
<script lang="ts">
	import { sections } from '#lib/content/nav.js';
	import { paper } from '#lib/content/paper.js';
</script>

<nav class="nav" aria-label="Sections">
	<a class="brand" href="#introduction">
		<img src="/favicon.png" alt="" width="28" height="28" />
		<span>{paper.acronym}</span>
	</a>
	<ul class="links" data-spy>
		{#each sections as section (section.id)}
			<li><a href="#{section.id}">{section.nav}</a></li>
		{/each}
	</ul>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		height: var(--bar);
		margin-inline: calc(-1 * var(--gutter));
		padding-inline: var(--gutter);
		border-bottom: 1px solid var(--line);
		background: color-mix(in srgb, var(--bg) 86%, transparent);
		-webkit-backdrop-filter: blur(12px) saturate(1.4);
		backdrop-filter: blur(12px) saturate(1.4);
	}

	.brand {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--serif);
		font-size: 1.3125rem;
		font-weight: 500;
		line-height: 1;
		text-decoration: none;
	}

	.brand img {
		width: 1.625rem;
		height: 1.625rem;
	}

	.links {
		position: relative;
		display: flex;
		gap: 1.25rem;
		min-width: 0;
		height: 100%;
		margin: 0;
		padding: 0 2rem 0 0;
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent);
	}

	.links::-webkit-scrollbar {
		display: none;
	}

	.links li {
		display: flex;
	}

	.links a {
		display: flex;
		align-items: center;
		border-bottom: 2px solid transparent;
		color: var(--ink-2);
		font-size: 0.9375rem;
		text-decoration: none;
		white-space: nowrap;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.links a:hover,
	.links a:global([aria-current='true']) {
		color: var(--ink);
	}

	.links a:global([aria-current='true']) {
		border-bottom-color: var(--accent);
	}

	.links a:focus-visible {
		outline-offset: -2px;
	}

	@media (min-width: 64rem) {
		.nav {
			top: 2.5rem;
			display: block;
			align-self: start;
			height: auto;
			margin: var(--hero-top) 0 0;
			padding: 0;
			border: 0;
			background: none;
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}

		.links {
			display: block;
			height: auto;
			margin-top: 2rem;
			padding: 0;
			border-left: 1px solid var(--line);
			overflow: visible;
			mask-image: none;
		}

		.links a {
			margin-left: -1px;
			padding: 0.4rem 0 0.4rem 1rem;
			border-bottom: 0;
			border-left: 2px solid transparent;
			line-height: 1.35;
		}

		.links a:global([aria-current='true']) {
			border-left-color: var(--accent);
		}
	}

	@media print {
		.nav {
			display: none;
		}
	}
</style>
