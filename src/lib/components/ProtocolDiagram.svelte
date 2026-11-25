<!--
	Redrawn from the paper's figure "RaC-style data and trained policy", animated. States form a
	funnel from the initial states through each sub-task's completion set to full task completion
	(expert demonstrations as dotted grey paths). The loop plays the two phases:
	1. Collecting data: a policy rollout (orange) leaves the funnel and fails; the operator
	   recovers to a familiar state (green), then corrects to finish the sub-task (blue), where the
	   episode ends. A dot marks the robot's state; its color says who is in control.
	2. Deploying the policy trained on this data (purple, dashed): it drifts out twice, recovers by
	   itself each time, and completes the task.
	The animation is SMIL built at build time (#lib/timeline.ts); every element's base attributes
	are the finished figure. #lib/enhance.ts runs it only while on screen, and removes it for
	reduced motion (`data-timeline`).
-->
<script lang="ts">
	import { along, curve, type Point } from '#lib/geometry.js';
	import { track, type Frame } from '#lib/timeline.js';

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

	// ---- Timeline (seconds in a 15 s loop).
	const LOOP = 15;
	const fadeIn = (at: number): Frame[] => [
		[at, 0],
		[at + 0.3, 1, true]
	];
	const pop = (at: number, r: number): Frame[] => [
		[at, 0],
		[at + 0.25, r, true]
	];
	/** A stroke drawn from start to end over [from, to] (mask dash offset, path length 1). */
	const drawn = (from: number, to: number): Frame[] => [
		[from, 1],
		[to, 0, true]
	];
	/** The state dot: shown while it travels its path over [from, to]. */
	const travel = (from: number, to: number) => ({
		motion: track(
			LOOP,
			[
				[from, 0],
				[to, 1, true]
			],
			'keyPoints'
		),
		opacity: track(LOOP, [
			[from - 0.15, 0],
			[from, 1],
			[to, 1],
			[to + 0.2, 0]
		])
	});

	/** A stroke revealed along its path over [from, to] while the state dot travels it. */
	const stroke = (points: Point[], from: number, to: number) => ({
		d: curve(points),
		reveal: track(LOOP, drawn(from, to)),
		...travel(from, to)
	});
	const strokes = {
		rollout: stroke(rollout, 0.5, 2.2),
		recovery: stroke(recovery, 2.7, 3.9),
		correction: stroke(correction, 4.2, 5.4),
		deployed: stroke(deployed, 7, 11.4)
	};

	const timeline = {
		// Everything fades out at the end of the loop, then the strokes draw again.
		traces: track(LOOP, [
			[14.3, 1],
			[LOOP, 0]
		]),
		collecting: track(LOOP, [
			[0.1, 0],
			[0.4, 1, true],
			[6.6, 1],
			[6.9, 0, true]
		]),
		deploying: track(LOOP, [
			[6.8, 0],
			[7.1, 1, true],
			[12, 1],
			[12.3, 0, true]
		]),
		// The collected data steps back while the deployed policy runs.
		collection: track(LOOP, [
			[6.6, 1],
			[7, 0.28, true],
			[12, 0.28],
			[12.4, 1, true]
		]),
		rolloutLabel: track(LOOP, fadeIn(1.2)),
		failure: track(LOOP, pop(2.2, 7.5)),
		failureLabel: track(LOOP, fadeIn(2.3)),
		recoveryLabel: track(LOOP, fadeIn(3)),
		familiar: track(LOOP, pop(3.9, 4.5)),
		correctionLabel: track(LOOP, fadeIn(4.6)),
		end: track(LOOP, fadeIn(5.4)),
		recoveryBehavior: track(LOOP, fadeIn(8.4)),
		deployedLabel: track(LOOP, fadeIn(9.8)),
		success: track(LOOP, [
			[11.35, 0],
			[11.6, 1, true],
			[12.6, 0, true]
		])
	};
</script>

<figure class="figure">
	<svg
		class="diagram"
		viewBox="0 0 670 472"
		role="img"
		aria-labelledby="diagram-title diagram-desc"
		data-timeline
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

		<defs>
			<!-- Each stroke is revealed by a wide copy of its path drawn along it. -->
			{#each Object.entries(strokes) as [id, { d, reveal }] (id)}
				<mask id="draw-{id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="710" height="512">
					<path class="reveal" {d} pathLength="1">
						<animate attributeName="stroke-dashoffset" {...reveal} />
					</path>
				</mask>
			{/each}
		</defs>

		<g class="funnel">
			{#each Object.values(sets) as set, i (i)}
				<ellipse class="set" {...set} />
			{/each}
			<ellipse class="success" {...sets.full} opacity="0">
				<animate attributeName="opacity" {...timeline.success} />
			</ellipse>
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

		<g class="traces">
			<animate attributeName="opacity" {...timeline.traces} />

			<text class="phase" x="0" y="16" opacity="0">
				<animate attributeName="opacity" {...timeline.collecting} />
				1 · Collecting RaC data
			</text>
			<text class="phase" x="0" y="16" opacity="0">
				<animate attributeName="opacity" {...timeline.deploying} />
				2 · Deploying the trained policy
			</text>

			<g class="collection">
				<animate attributeName="opacity" {...timeline.collection} />

				<g class="rollout">
					<g mask="url(#draw-rollout)">
						<path class="stroke" d={strokes.rollout.d} />
						{#each arrows.rollout as transform, i (i)}
							<path class="head" d={head} {transform} />
						{/each}
					</g>
					<g>
						<animate attributeName="opacity" {...timeline.rolloutLabel} />
						<text class="label" x="228" y="102">On-policy</text>
						<text class="label" x="228" y="122">rollout</text>
					</g>
				</g>

				<g class="failure">
					<circle cx={failure[0]} cy={failure[1]} r="7.5">
						<animate attributeName="r" {...timeline.failure} />
					</circle>
					<text class="label" x={failure[0] + 8} y="36" text-anchor="middle">
						<animate attributeName="opacity" {...timeline.failureLabel} />
						failure
					</text>
				</g>

				<g class="recovery">
					<g mask="url(#draw-recovery)">
						<path class="stroke" d={strokes.recovery.d} />
						{#each arrows.recovery as transform, i (i)}
							<path class="head" d={head} {transform} />
						{/each}
					</g>
					<text class="label strong" transform="translate(139 77) rotate(-47)" text-anchor="middle">
						<animate attributeName="opacity" {...timeline.recoveryLabel} />
						recovery
					</text>
				</g>

				<circle class="familiar" cx={familiar[0]} cy={familiar[1]} r="4.5">
					<animate attributeName="r" {...timeline.familiar} />
				</circle>

				<g class="correction">
					<g mask="url(#draw-correction)">
						<path class="stroke" d={strokes.correction.d} />
						{#each arrows.correction as transform, i (i)}
							<path class="head" d={head} {transform} />
						{/each}
					</g>
					<text class="label strong" x="205" y="206" text-anchor="middle">
						<animate attributeName="opacity" {...timeline.correctionLabel} />
						correction
					</text>
				</g>

				<path class="end" d="M{end[0] - 6} {end[1] - 6}l12 12m0-12-12 12">
					<animate attributeName="opacity" {...timeline.end} />
				</path>
			</g>

			<g class="deployed">
				<g mask="url(#draw-deployed)">
					<path class="stroke dashed" d={strokes.deployed.d} />
					{#each arrows.deployed as transform, i (i)}
						<path class="head" d={head} {transform} />
					{/each}
				</g>
				<g>
					<animate attributeName="opacity" {...timeline.recoveryBehavior} />
					<path class="pointer" d="m134 441 8-15" />
					<text class="label" x="70" y="460">Recovery behavior</text>
				</g>
				<text class="label strong" x="438" y="414">
					<animate attributeName="opacity" {...timeline.deployedLabel} />
					Deployed policy rollout
				</text>
			</g>

			<!-- The robot's state, colored by who is in control. -->
			{#each Object.entries(strokes) as [id, { d, motion, opacity }] (id)}
				<circle class="state {id}" r="6" opacity="0">
					<animateMotion path={d} {...motion} />
					<animate attributeName="opacity" {...opacity} />
				</circle>
			{/each}
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

	@media (prefers-color-scheme: dark) {
		.figure {
			--set: #1f2a3b;
			--rollout: #f29a58;
			--recovery: #79c95a;
			--correction: #82a3ff;
			--deployed: #b893f2;
		}
	}

	.diagram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.set {
		fill: var(--set);
		stroke: var(--ink-2);
		stroke-width: 1;
		stroke-dasharray: 3 2.5;
	}

	.success {
		fill: color-mix(in srgb, var(--deployed) 35%, transparent);
		stroke: var(--deployed);
		stroke-width: 2;
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

	.reveal {
		fill: none;
		stroke: #fff;
		stroke-width: 16;
		stroke-dasharray: 1 1;
	}

	.label,
	.phase {
		font-family: var(--sans);
		font-size: 15.5px;
		fill: var(--ink);
	}

	.phase {
		font-size: 14.5px;
		font-weight: 600;
		letter-spacing: 0.01em;
		fill: var(--ink-2);
	}

	.strong {
		font-weight: 650;
	}

	.stroke {
		fill: none;
		stroke: var(--c);
		stroke-width: 2.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.dashed {
		stroke-dasharray: 7 6;
	}

	.head {
		fill: var(--c);
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

	.strong,
	.deployed .label {
		fill: var(--c);
	}

	.state {
		fill: var(--c);
		stroke: var(--bg);
		stroke-width: 2.5;
	}

	.failure circle,
	.failure .label {
		fill: var(--fail);
	}

	.familiar {
		fill: var(--familiar);
		stroke: var(--ink);
		stroke-width: 1.25;
	}

	.end,
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

		.phase {
			font-size: 17px;
		}
	}
</style>
