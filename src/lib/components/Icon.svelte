<!-- Inline stroke icons (24×24 grid). Decorative: always hidden from assistive technology. -->
<script lang="ts">
	type Name = 'pdf' | 'arxiv' | 'code' | 'cite' | 'play' | 'copy' | 'check' | 'up';

	let { name, size = 18 }: { name: Name; size?: number } = $props();
</script>

<svg
	class="icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	{#if name === 'pdf'}
		<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
		<path d="M14 3v5h5M12 11v6m-2.75-2.75L12 17l2.75-2.75" />
	{:else if name === 'arxiv'}
		<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
		<path d="M14 3v5h5M9 12.5h6M9 16.5h4" />
	{:else if name === 'code'}
		<path d="m8.5 7-5 5 5 5m7-10 5 5-5 5" />
	{:else if name === 'cite'}
		<path
			d="M10 11H6.5a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1H9a1 1 0 0 1 1 1V12c0 2.6-1.4 4.4-4 5.5M18.5 11H15a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1V12c0 2.6-1.4 4.4-4 5.5"
		/>
	{:else if name === 'play'}
		<path
			d="M8 5.2v13.6a.6.6 0 0 0 .9.5l10.9-6.8a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5Z"
			fill="currentColor"
			stroke="none"
		/>
	{:else if name === 'copy'}
		<rect x="9" y="9" width="11" height="11" rx="2" />
		<path d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5" />
	{:else if name === 'check'}
		<path d="m5 12.5 4.5 4.5L19 7.5" />
	{:else if name === 'up'}
		<path d="M12 19V5m-6 6 6-6 6 6" />
	{/if}
</svg>

<style>
	.icon {
		flex: none;
	}
</style>
