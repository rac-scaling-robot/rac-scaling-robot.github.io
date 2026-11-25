<!-- Title, authors, venue, paper links and the TL;DR. -->
<script lang="ts">
	import { paper } from '#lib/content/paper.js';
	import Icon from './Icon.svelte';

	// "RaC: Robot Learning … by Scaling Recovery and Correction": the acronym, then the rest of
	// the title with the initials of "Recovery and Correction" underlined.
	const [acronym, rest] = paper.title.split(/:\s+/);
	const expansion = paper.acronymWords.join(' ');
	const lead = rest.slice(0, rest.indexOf(expansion));
</script>

<section id="introduction" class="hero" aria-labelledby="title">
	<!-- prettier-ignore -->
	<h1 class="title" id="title"><span class="acronym">{acronym}<span class="visually-hidden">:</span></span> <span class="full">{lead}{#each paper.acronymWords as word, i (i)}{#if i > 0}{' '}{/if}<u>{word[0]}</u>{word.slice(1)}{/each}</span></h1>

	<!-- prettier-ignore -->
	<p class="authors">{#each paper.authors as author, i (author.name)}{#if i > 0},{' '}{/if}<a href={author.url}>{author.name}</a>{/each}</p>
	<p class="meta">
		<span>{paper.affiliation}</span>
		<span>{paper.venue}, {paper.year}</span>
	</p>

	<ul class="links">
		<li>
			<a class="button primary" href={paper.pdf}><Icon name="pdf" />Paper</a>
		</li>
		<li>
			<a class="button" href={paper.arxiv}><Icon name="arxiv" />arXiv</a>
		</li>
		<li>
			{#if paper.code}
				<a class="button" href={paper.code}><Icon name="code" />Code</a>
			{:else}
				<span class="button soon">
					<Icon name="code" />Code <span class="later">(coming soon)</span>
				</span>
			{/if}
		</li>
		<li>
			<a class="button" href="#citation"><Icon name="cite" />BibTeX</a>
		</li>
	</ul>

	<p class="tldr prose"><strong class="tag">TL;DR</strong> {paper.tldr}</p>
</section>

<style>
	.hero {
		padding-top: var(--hero-top);
	}

	.title {
		max-width: 21em;
		font-size: clamp(1.875rem, 1.2rem + 2.4vw, 3rem);
		line-height: 1.08;
		letter-spacing: -0.012em;
	}

	/* The acronym sits on its own line, much larger: the expansion underneath spells it out. */
	.acronym {
		display: block;
		margin: 0 0 0.12em -0.04em;
		font-size: 2.35em;
		font-weight: 500;
		line-height: 0.9;
		letter-spacing: -0.03em;
	}

	.full {
		display: block;
	}

	u {
		text-decoration-color: var(--accent);
		text-decoration-thickness: 0.075em;
		text-underline-offset: 0.12em;
		text-decoration-skip-ink: none;
	}

	.authors {
		max-width: 46rem;
		margin-top: clamp(1.5rem, 3vw, 2.25rem);
		font-size: 1.0625rem;
	}

	.authors a {
		text-decoration-color: color-mix(in srgb, currentColor 30%, transparent);
	}

	.authors a:hover {
		text-decoration-color: var(--accent);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1.5rem;
		margin-top: 0.35rem;
		color: var(--ink-2);
		font-size: 0.9375rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding: 0;
		list-style: none;
	}

	.button {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 2.5rem;
		padding: 0.4rem 1rem 0.4rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1;
		text-decoration: none;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	a.button:hover {
		border-color: var(--ink-3);
	}

	.primary {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--bg);
	}

	a.primary:hover {
		border-color: var(--accent);
		background: var(--accent);
		color: #fff;
	}

	.soon {
		border-style: dashed;
		background: transparent;
		color: var(--ink-2);
		cursor: default;
	}

	.later {
		font-weight: 400;
	}

	.tldr {
		margin-top: clamp(2rem, 4vw, 2.75rem);
		font-size: clamp(1.1875rem, 1.05rem + 0.45vw, 1.375rem);
		line-height: 1.55;
	}

	.tag {
		margin-right: 0.35em;
		font-family: var(--sans);
		font-size: 0.68em;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--accent);
		vertical-align: 0.12em;
	}
</style>
