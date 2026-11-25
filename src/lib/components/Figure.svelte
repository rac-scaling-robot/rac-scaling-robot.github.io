<!-- A plot from the paper on a white plate; links to the full-size image for zooming on phones. -->
<script lang="ts">
	import type { Image } from '#lib/types.js';

	let { image }: { image: Image } = $props();
</script>

<figure class="figure">
	<a class="plate" href={image.src} aria-label="{image.alt} (open full size)">
		<img
			src={image.src}
			alt={image.alt}
			width={image.width}
			height={image.height}
			loading="lazy"
			decoding="async"
		/>
	</a>
</figure>

<style>
	.plate {
		display: block;
		padding: clamp(0.75rem, 2.5vw, 1.75rem);
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 0 0 1px var(--line);
		filter: var(--plate-filter);
		cursor: zoom-in;
	}

	img {
		width: 100%;
	}
</style>
