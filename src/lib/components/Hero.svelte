<!-- Title, authors, venue, paper links and the TL;DR. -->
<script lang="ts">
	import { paper } from '#lib/content/paper.js';
	import Icon from './Icon.svelte';

	// "RaC: Robot Learning … by Scaling Recovery and Correction": the acronym in bold, then the
	// rest of the title with the initials of "Recovery and Correction" underlined.
	const [acronym, rest] = paper.title.split(/:\s+/);
	const expansion = paper.acronymWords.join(' ');
	const lead = rest.slice(0, rest.indexOf(expansion));
</script>

<section id="introduction" class="hero" aria-labelledby="title">
	<!-- prettier-ignore -->
	<h1 class="title" id="title"><strong>{acronym}</strong>: {lead}{#each paper.acronymWords as word, i (i)}{#if i > 0}{' '}{/if}<u>{word[0]}</u>{word.slice(1)}{/each}</h1>

	<!-- prettier-ignore -->
	<p class="authors">{#each paper.authors as author, i (author.name)}{#if i > 0},{' '}{/if}<a href={author.url}>{author.name}</a>{/each}</p>
	<p class="meta">
		<span>{paper.affiliation}</span>
		<a href="https://doi.org/{paper.doi}">{paper.venue}, {paper.year}</a>
	</p>

	<ul class="links">
		<li>
			<a class="button primary" href={paper.pdf}><Icon name="pdf" />Paper</a>
		</li>
		<li>
			<a class="button" href={paper.arxiv}><Icon name="arxiv" />arXiv</a>
		</li>
		<li>
			<a class="button" href={paper.code}><Icon name="code" />Code</a>
		</li>
		<li>
			<a class="button" href={paper.release}><Icon name="data" />Checkpoints &amp; Data</a>
		</li>
		<li>
			<a class="button" href="#citation"><Icon name="cite" />BibTeX</a>
		</li>
	</ul>

	<p class="tldr"><strong class="tag">TL;DR</strong> {paper.tldr}</p>
</section>

<style>
	.hero {
		padding-top: var(--hero-top);
	}

	.title {
		max-width: 30em;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.625rem);
		line-height: 1.15;
		letter-spacing: -0.01em;
		text-wrap: balance;
	}

	.title strong {
		font-weight: 680;
	}

	u {
		text-decoration-color: var(--accent);
		text-decoration-thickness: 0.07em;
		text-underline-offset: 0.12em;
		text-decoration-skip-ink: none;
	}

	.authors {
		max-width: 52rem;
		margin-top: clamp(1rem, 2vw, 1.375rem);
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
		margin-top: 0.3rem;
		color: var(--ink-2);
		font-size: 0.9375rem;
	}

	.meta a {
		color: inherit;
		text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
	}

	.meta a:hover {
		color: var(--ink);
		text-decoration-color: var(--accent);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.25rem;
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

	.button:hover {
		border-color: var(--ink-3);
	}

	.primary {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--bg);
	}

	.primary:hover {
		border-color: var(--accent);
		background: var(--accent);
		color: #fff;
	}

	/* A wide summary card: the TL;DR runs the full column instead of a narrow reading measure. */
	.tldr {
		max-width: 62rem;
		margin-top: clamp(1.5rem, 3vw, 2rem);
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--accent);
		border-radius: 0 10px 10px 0;
		background: var(--accent-soft);
		font-family: var(--serif);
		font-size: clamp(1.0625rem, 1rem + 0.2vw, 1.1875rem);
		line-height: 1.55;
		text-wrap: pretty;
	}

	.tag {
		margin-right: 0.4em;
		font-family: var(--sans);
		font-size: 0.72em;
		font-weight: 650;
		letter-spacing: 0.03em;
		color: var(--accent);
		vertical-align: 0.1em;
	}
</style>
