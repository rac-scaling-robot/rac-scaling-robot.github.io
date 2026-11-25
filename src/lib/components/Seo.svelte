<!-- Page metadata: title, description, canonical URL, social previews, Google Scholar tags, schema.org. -->
<script lang="ts">
	import { site } from '#lib/config.js';
	import { paper } from '#lib/content/paper.js';

	const url = `${site.url}/`;
	const image = `${site.url}/images/social.jpg`;
	const imageAlt = 'A bimanual robot hanging a shirt on a rack';

	const article = {
		'@context': 'https://schema.org',
		'@type': 'ScholarlyArticle',
		headline: paper.title,
		description: paper.description,
		url,
		image,
		author: paper.authors.map((author) => ({
			'@type': 'Person',
			name: author.name,
			url: author.url,
			affiliation: { '@type': 'Organization', name: paper.affiliation }
		})),
		isPartOf: { '@type': 'Periodical', name: paper.venue },
		datePublished: String(paper.year),
		sameAs: [paper.arxiv],
		keywords: paper.keywords.join(', ')
	};
	// Escape `<` so the JSON can never close its <script> element.
	const jsonLd = JSON.stringify(article).replaceAll('<', '\\u003c');
</script>

<svelte:head>
	<title>{paper.title}</title>
	<meta name="description" content={paper.description} />
	<meta name="keywords" content={paper.keywords.join(', ')} />
	<meta name="author" content={paper.authors.map((author) => author.name).join(', ')} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={paper.acronym} />
	<meta property="og:title" content={paper.title} />
	<meta property="og:description" content={paper.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />

	<meta name="citation_title" content={paper.title} />
	{#each paper.authors as author (author.name)}
		<meta name="citation_author" content={author.name} />
	{/each}
	<meta name="citation_journal_title" content={paper.venue} />
	<meta name="citation_publication_date" content={String(paper.year)} />
	<meta name="citation_pdf_url" content={paper.pdf} />
	<meta name="citation_arxiv_id" content={paper.arxiv.split('/').pop()} />

	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
