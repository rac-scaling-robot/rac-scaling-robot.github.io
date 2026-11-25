<!--
	Redrawn from the paper's figure "RaC-style data and trained policy". States form a funnel from
	the initial states through each sub-task's completion set to full task completion (expert
	demonstrations as dotted grey paths). An on-policy rollout leaves the funnel and fails; the
	operator recovers back to a familiar state, then corrects to finish the sub-task, where the
	episode ends. A policy trained on this data recovers by itself when deployed (dashed).
	All geometry is computed at build time; once scrolled into view the steps draw in order
	(`data-reveal`, see #lib/enhance.ts).
-->
<script lang="ts">
	import { along, curve, type Point } from '#lib/geometry.js';

	// The funnel: initial states, two sub-task completion sets and full task completion.
	const sets = {
		initial: { cx: 40, cy: 246, rx: 28, ry: 157 },
		subtask1: { cx: 293, cy: 248, rx: 26.5, ry: 89 },
		subtask2: { cx: 474, cy: 250, rx: 16.5, ry: 57 },
		full: { cx: 583, cy: 250, rx: 13, ry: 25 }
	};
	const top: Point[] = [
		[40, 89],
		[107, 100],
		[145, 126],
		[175, 152],
		[192, 157.5],
		[290, 160],
		[365, 166],
		[419, 174.5],
		[474, 193],
		[583, 225]
	];
	const bottom: Point[] = [
		[40, 403],
		[99, 400],
		[122, 393],
		[168, 354],
		[198, 342],
		[293, 337.5],
		[373, 327.5],
		[474, 307],
		[583, 275]
	];

	// Expert demonstrations: from the initial set through both sub-task sets to completion.
	const lanes = [
		[112, 182, 176, 212, 221, 238, 236],
		[140, 168, 196, 230, 230, 244, 240],
		[176, 214, 220, 214, 240, 236, 244],
		[212, 236, 244, 246, 252, 250, 248],
		[250, 262, 262, 270, 262, 256, 252],
		[290, 290, 282, 262, 272, 262, 256],
		[330, 300, 302, 290, 284, 268, 260],
		[372, 330, 318, 300, 294, 274, 264]
	];
	const expert = lanes.map(([y0, m1, y1, m2, y2, m3, y3]) => {
		const { cx, cy, rx, ry } = sets.initial;
		const x0 = cx + rx * Math.sqrt(1 - ((y0 - cy) / ry) ** 2);
		const points: Point[] = [
			[x0, y0],
			[180, m1],
			[293, y1],
			[385, m2],
			[474, y2],
			[530, m3],
			[580, y3]
		];
		return curve(points);
	});

	// The intervention episode: rollout → failure → recovery → correction → episode ends.
	const rollout: Point[] = [
		[65, 153],
		[99, 167],
		[137, 174],
		[157, 162],
		[180, 154],
		[202, 110],
		[221, 73],
		[252, 60]
	];
	const failure: Point = [265, 60];
	const recovery: Point[] = [
		[256, 50],
		[225, 47],
		[200, 52],
		[184, 72],
		[170, 89],
		[148, 101],
		[131, 117],
		[123, 128]
	];
	const familiar: Point = [118, 136];
	const correction: Point[] = [
		[123, 139],
		[149, 149],
		[168, 171],
		[198, 181],
		[236, 177],
		[266, 183],
		[287, 206]
	];
	const end: Point = [291, 214];

	// The deployed policy: leaves the funnel twice, recovers, and completes the task.
	const deployed: Point[] = [
		[65, 354],
		[99, 349],
		[145, 347],
		[175, 357],
		[206, 374],
		[240, 390],
		[229, 407],
		[183, 417],
		[145, 413],
		[130, 400],
		[126, 374],
		[130, 334],
		[153, 314],
		[191, 310],
		[251, 308],
		[312, 308],
		[350, 304],
		[373, 301],
		[403, 308],
		[426, 347],
		[411, 387],
		[373, 394],
		[354, 367],
		[343, 334],
		[362, 301],
		[388, 295],
		[434, 291],
		[495, 288],
		[525, 281],
		[566, 263]
	];

	const head = 'M-5.5 -4.5 5 0-5.5 4.5Z';
	const arrows = {
		rollout: [1, 4, 6, 7].map((i) => along(rollout, i)),
		recovery: [recovery.length - 1].map((i) => along(recovery, i)),
		correction: [correction.length - 1].map((i) => along(correction, i)),
		deployed: [1, 3, 9, 13, 19, 23, 26, 29].map((i) => along(deployed, i))
	};
</script>

<figure class="figure">
	<svg
		class="diagram"
		viewBox="0 0 670 472"
		role="img"
		aria-labelledby="diagram-title diagram-desc"
		data-reveal
	>
		<title id="diagram-title">RaC-style intervention data and the policy it trains</title>
		<desc id="diagram-desc">
			States form a funnel from the initial states, through the states where sub-task 1 and sub-task
			2 are complete, to full task completion; expert demonstrations run through it. An on-policy
			rollout leaves the funnel and fails. The operator first recovers back to a familiar state
			inside the funnel, then corrects to complete sub-task 1, where the episode ends. Deployed, the
			policy trained on this data drifts out of the funnel twice, recovers each time, and completes
			the full task.
		</desc>

		<g class="funnel">
			{#each Object.values(sets) as set, i (i)}
				<ellipse class="set" {...set} />
			{/each}
			{#each expert as d, i (i)}
				<path class="expert" {d} />
			{/each}
			<path class="wall" d={curve(top)} />
			<path class="wall" d={curve(bottom)} />

			<text class="label" transform="translate(45 246) rotate(-90)" text-anchor="middle">
				Initial state
			</text>
			<text class="label" transform="translate(287 266) rotate(-90)" text-anchor="middle">
				Subtask 1
			</text>
			<text class="label" transform="translate(304 266) rotate(-90)" text-anchor="middle">
				complete
			</text>
			<text class="label" x="446" y="146">Subtask 2</text>
			<text class="label" x="446" y="166">complete</text>
			<text class="label" x="566" y="302">Full task</text>
			<text class="label" x="566" y="322">complete</text>
		</g>

		<g class="step rollout" style:--d="0s" style:--t="0.8s">
			<path class="draw" d={curve(rollout)} pathLength="1" />
			{#each arrows.rollout as transform, i (i)}
				<path class="head" d={head} {transform} />
			{/each}
			<text class="label" x="228" y="102">On-policy</text>
			<text class="label" x="228" y="122">rollout</text>
		</g>

		<g class="step failure" style:--d="0.8s" style:--t="0.3s">
			<circle class="pop" cx={failure[0]} cy={failure[1]} r="7.5" />
			<text class="label pop" x={failure[0] + 8} y="36" text-anchor="middle">failure</text>
		</g>

		<g class="step recovery" style:--d="1.15s" style:--t="0.7s">
			<path class="draw" d={curve(recovery)} pathLength="1" />
			{#each arrows.recovery as transform, i (i)}
				<path class="head" d={head} {transform} />
			{/each}
			<text class="label strong" transform="translate(139 77) rotate(-47)" text-anchor="middle">
				recovery
			</text>
		</g>

		<g class="step familiar" style:--d="1.8s" style:--t="0.2s">
			<circle class="pop" cx={familiar[0]} cy={familiar[1]} r="4.5" />
		</g>

		<g class="step correction" style:--d="1.95s" style:--t="0.8s">
			<path class="draw" d={curve(correction)} pathLength="1" />
			{#each arrows.correction as transform, i (i)}
				<path class="head" d={head} {transform} />
			{/each}
			<text class="label strong" x="205" y="206" text-anchor="middle">correction</text>
		</g>

		<g class="step end" style:--d="2.75s" style:--t="0.2s">
			<path class="pop" d="M{end[0] - 6} {end[1] - 6}l12 12m0-12-12 12" />
		</g>

		<g class="step deployed" style:--d="3.2s" style:--t="2s">
			<g class="wipe">
				<path class="dashed" d={curve(deployed)} />
				{#each arrows.deployed as transform, i (i)}
					<path class="head" d={head} {transform} />
				{/each}
			</g>
			<text class="label strong pop" x="438" y="414">Deployed policy rollout</text>
			<path class="pointer pop" d="m134 441 8-15" />
			<text class="label pop" x="70" y="460">Recovery behavior</text>
		</g>
	</svg>
	<figcaption>
		<ul class="legend">
			<li><svg viewBox="0 0 28 8"><path class="key recovery" d="M2 4h24" /></svg>Recovery</li>
			<li><svg viewBox="0 0 28 8"><path class="key correction" d="M2 4h24" /></svg>Correction</li>
			<li>
				<svg viewBox="0 0 28 8"><path class="key deployed" d="M2 4h24" /></svg>Deployed policy
			</li>
			<li><svg viewBox="0 0 28 8"><path class="key expert" d="M2 4h24" /></svg>Expert demos</li>
		</ul>
		<span class="source">Adapted from the paper.</span>
	</figcaption>
</figure>

<style>
	.figure {
		--expert: color-mix(in srgb, var(--ink-3) 70%, transparent);
		--set: #dfe8f5;
		--rollout: #e07a2f;
		--recovery: #4c9a2a;
		--correction: #3b67c8;
		--deployed: #7a3cb4;
		--familiar: #f3b51b;
	}

	.diagram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	@media (prefers-color-scheme: dark) {
		.figure {
			--set: #1f2a3b;
			--rollout: #f29a58;
			--recovery: #79c95a;
			--correction: #82a3ff;
			--deployed: #b893f2;
		}
	}

	.set {
		fill: var(--set);
		stroke: var(--ink-2);
		stroke-width: 1;
		stroke-dasharray: 3 2.5;
	}

	.expert {
		fill: none;
		stroke: var(--expert);
		stroke-width: 1.1;
		stroke-dasharray: 1.5 2.5;
	}

	.wall {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
	}

	.label {
		font-family: var(--sans);
		font-size: 15.5px;
		fill: var(--ink);
	}

	.strong {
		font-weight: 650;
	}

	.draw,
	.dashed {
		fill: none;
		stroke-width: 2.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* `pathLength="1"`: a single dash the length of the path, so it can be drawn in. */
	.draw {
		stroke-dasharray: 1;
	}

	.dashed {
		stroke-dasharray: 7 6;
	}

	.rollout {
		--c: var(--rollout);
	}

	.recovery {
		--c: var(--recovery);
	}

	.correction {
		--c: var(--correction);
	}

	.deployed {
		--c: var(--deployed);
	}

	.step .draw,
	.step .dashed {
		stroke: var(--c);
	}

	.step .head {
		fill: var(--c);
	}

	.step .strong {
		fill: var(--c);
	}

	.deployed .label {
		fill: var(--deployed);
	}

	.failure circle {
		fill: var(--fail);
	}

	.failure .label {
		fill: var(--fail);
	}

	.familiar circle {
		fill: var(--familiar);
		stroke: var(--ink);
		stroke-width: 1.25;
	}

	.end path,
	.pointer {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.25;
		stroke-linecap: round;
	}

	.pointer {
		stroke-width: 1.25;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem 1.5rem;
		margin-top: 1rem;
		color: var(--ink-2);
		font-size: 0.875rem;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.1rem;
		padding: 0;
		list-style: none;
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend svg {
		width: 1.75rem;
		height: 0.5rem;
		overflow: visible;
	}

	.key {
		fill: none;
		stroke-width: 3;
		stroke-linecap: round;
	}

	.key.recovery {
		stroke: var(--recovery);
	}

	.key.correction {
		stroke: var(--correction);
	}

	.key.deployed {
		stroke: var(--deployed);
		stroke-dasharray: 5 4;
		stroke-linecap: butt;
	}

	.key.expert {
		stroke: var(--ink-3);
		stroke-width: 1.5;
		stroke-dasharray: 1.5 2.5;
	}

	.source {
		color: var(--ink-3);
		font-size: 0.8125rem;
	}

	/* Phones: the drawing scales down to ~0.65×; keep the labels legible. */
	@media (max-width: 40rem) {
		.label {
			font-size: 18px;
		}
	}

	/* Draw-in, once, in story order (enhance.ts adds .pending while the figure is below the
	   fold). Each step starts at --d; strokes take --t, then arrowheads and labels fade in. */
	.draw {
		transition: stroke-dashoffset var(--t) cubic-bezier(0.45, 0, 0.25, 1) var(--d);
	}

	.step .head,
	.step .label,
	.pop {
		transition: opacity 0.35s ease calc(var(--d) + var(--t) * 0.6);
	}

	.wipe {
		clip-path: inset(-5% -5% -5% -5%);
		transition: clip-path var(--t) cubic-bezier(0.45, 0, 0.25, 1) var(--d);
	}

	.diagram:global(.pending) .draw {
		stroke-dashoffset: 1;
	}

	.diagram:global(.pending) .step .head,
	.diagram:global(.pending) .step .label,
	.diagram:global(.pending) .pop {
		opacity: 0;
	}

	.diagram:global(.pending) .wipe {
		clip-path: inset(-5% 105% -5% -5%);
	}
</style>
