<script lang="ts">
	import { paper } from '#lib/content/paper.js';
	import Icon from './Icon.svelte';

	// Rendered once at build time, so this is the date of the last deploy.
	const updated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
</script>

<footer class="footer wrap">
	<p>{paper.affiliation}</p>
	<p>Updated {updated}</p>
	<p><a href="#introduction"><Icon name="up" size={15} />Back to top</a></p>
</footer>

<style>
	.footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		margin-top: clamp(4.5rem, 9vw, 7rem);
		padding-block: 1.5rem 2.5rem;
		color: var(--ink-3);
		font-size: 0.875rem;
	}

	.footer p:last-child {
		margin-left: auto;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		text-decoration: none;
	}

	a:hover {
		color: var(--ink);
	}
</style>
