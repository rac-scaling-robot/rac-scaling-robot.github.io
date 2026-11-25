<!-- BibTeX with a copy button (shown only when JavaScript runs; see #lib/enhance.ts). -->
<script lang="ts">
	import { paper } from '#lib/content/paper.js';
	import Icon from './Icon.svelte';
	import Section from './Section.svelte';
</script>

<Section id="citation" title="BibTeX">
	<div class="bibtex">
		<pre><code id="bibtex">{paper.bibtex}</code></pre>
		<button class="copy" type="button" data-copy="bibtex" hidden>
			<Icon name="copy" size={16} />
			<span aria-live="polite">Copy</span>
		</button>
	</div>
</Section>

<style>
	.bibtex {
		position: relative;
		border-radius: 12px;
		background: var(--surface);
		box-shadow: 0 0 0 1px var(--line);
	}

	pre {
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		font-family: var(--mono);
		font-size: 0.8125rem;
		line-height: 1.7;
		tab-size: 2;
	}

	.copy {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
	}

	.copy:hover {
		border-color: var(--ink-3);
	}

	.copy[hidden] {
		display: none;
	}
</style>
