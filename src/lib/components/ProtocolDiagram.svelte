<!--
	Schematic of the two protocol rules: the policy drifts out of in-distribution states and fails;
	the operator recovers back into them, corrects to finish the sub-task, then ends the episode.
	The trace draws itself once when scrolled into view (`data-reveal`, see #lib/enhance.ts).
-->
<svg
	class="diagram"
	viewBox="0 0 600 270"
	role="img"
	aria-labelledby="diagram-title diagram-desc"
	data-reveal
>
	<title id="diagram-title">The RaC intervention protocol</title>
	<desc id="diagram-desc">
		A policy rollout drifts out of in-distribution states and fails. The human operator intervenes,
		first recovering back to in-distribution states, then correcting to complete the sub-task, and
		then terminates the episode.
	</desc>
	<defs>
		<linearGradient id="diagram-band" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="600" y2="0">
			<stop class="band-stop" offset="0.78" />
			<stop class="band-stop" offset="1" stop-opacity="0" />
		</linearGradient>
	</defs>

	<!-- In-distribution states: the band around the nominal path. -->
	<path
		class="band"
		d="M24 100C90 96 140 88 190 90C240 92 290 94 340 92C380 90.4 430 83 470 84C520 85.2 552 92 572 92"
	/>
	<text class="label band-label" x="24" y="60">In-distribution states</text>

	<g class="trace">
		<circle class="start" cx="24" cy="100" r="4.5" />
		<path class="policy" d="M24 100C90 96 140 88 190 90C226 91.4 258 150 278 201" />
		<path class="recover" d="M295 202C318 186 314 132 322 112C327 99 332 93 340 92" />
		<path class="correct" d="M340 92C380 90.4 430 83 470 84" />
		<path class="failure" d="m277 203 14 14m0-14-14 14" />
		<rect class="stop" x="463" y="77" width="14" height="14" rx="2" />

		<text class="label failure-label" x="268" y="215" text-anchor="end">Failure</text>
		<text class="label human" x="334" y="164">Recover</text>
		<text class="label human" x="408" y="118" text-anchor="middle">Correct</text>
		<text class="label terminate" x="470" y="58" text-anchor="middle">Terminate</text>
	</g>

	<g class="legend">
		<path class="policy" d="M24 254h28" />
		<text class="label key" x="62" y="259">Policy</text>
		<path class="correct" d="M140 254h28" />
		<text class="label key" x="178" y="259">Human intervention</text>
	</g>
</svg>

<style>
	.diagram {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.band {
		fill: none;
		stroke: url(#diagram-band);
		stroke-width: 46;
		stroke-linecap: round;
	}

	.band-stop {
		stop-color: var(--accent);
		stop-opacity: 0.13;
	}

	.band-stop:last-child {
		stop-opacity: 0;
	}

	.policy,
	.recover,
	.correct,
	.failure {
		fill: none;
		stroke-linecap: round;
	}

	.policy {
		stroke: var(--ink);
		stroke-width: 2.5;
	}

	.start,
	.stop {
		fill: var(--ink);
	}

	.recover {
		stroke: var(--accent);
		stroke-width: 3;
		stroke-dasharray: 2 7;
	}

	.correct {
		stroke: var(--accent);
		stroke-width: 3.5;
	}

	.failure {
		stroke: var(--fail);
		stroke-width: 3;
	}

	.label {
		font-family: var(--sans);
		font-size: 15px;
		font-weight: 500;
		fill: var(--ink-2);
	}

	.band-label {
		font-family: var(--serif);
		font-size: 17px;
		font-style: italic;
		font-weight: 400;
		fill: var(--ink-3);
	}

	.failure-label {
		fill: var(--fail);
	}

	.human {
		fill: var(--accent);
	}

	.terminate {
		font-weight: 600;
		fill: var(--ink);
	}

	.key {
		font-weight: 400;
		fill: var(--ink-2);
	}

	/* Phones: the drawing scales down to ~0.75×; keep the labels legible. */
	@media (max-width: 40rem) {
		.label {
			font-size: 19px;
		}

		.band-label {
			font-size: 20px;
		}
	}

	/* Draw-in, once (enhance.ts adds .pending to diagrams below the fold). */
	.trace {
		clip-path: inset(-10% -10% -10% -10%);
		transition: clip-path 1.8s cubic-bezier(0.5, 0, 0.2, 1) 0.15s;
	}

	.diagram:global(.pending) .trace {
		clip-path: inset(-10% 110% -10% -10%);
	}
</style>
