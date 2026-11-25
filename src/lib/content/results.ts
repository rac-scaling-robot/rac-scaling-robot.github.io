import type { Image } from '#lib/types.js';

export const results = {
	title: 'Results',
	scaling: {
		text: 'On challenging real world long-horizon manipulation tasks, RaC achieves high success rates with efficient data scaling. It outperforms prior human-in-the-loop method HG-DAgger and conventional batched full expert trajectories data collection.',
		figure: {
			src: '/images/scaling-comparison.webp',
			width: 2000,
			height: 1050,
			alt: 'Plots of task progress score and success rate against human-collected frames (millions). Left, "Scaling of RaC on three real world tasks": shirt hanging, Tupperware lid and burger assembly. Right, "Comparisons on Shirt Hanging": RaC (ours) against HG-DAgger and full demos.'
		} satisfies Image
	},
	priorWork: {
		text: 'Compared to previous SOTA results on similar shirt-hanging task, RaC outperforms prior approaches with ~10x less data.',
		table: {
			columns: ['Name', 'Policy Architecture', 'Model Size', 'Training Data Size', 'SR'],
			/** Columns aligned like numbers. */
			numeric: [2, 4],
			/** Cells are trusted HTML; the first cell is the row header. */
			rows: [
				[
					'ALOHA Unleashed [50]',
					'Diffusion Transformer policy',
					'217M',
					'∼89 hours (5345 shirt-hanging expert demos)',
					'75.0%'
				],
				[
					'Seed GR-3 [7]',
					'Vision-Language-Action model',
					'4B',
					'116 hours of shirt-hanging expert demos and vision-language data',
					'∼63.6%'
				],
				[
					'Ours (<i>RaC</i>)',
					'Flow-matching Transformer policy',
					'368M',
					'<b>5 hours</b> (<i>RaC</i> data: expert, recovery, and correction)',
					'<b>78.3%</b>'
				]
			],
			/** Index of the highlighted row. */
			ours: 2,
			label: 'Table 1:',
			captionTitle: 'Comparison to similar shirt-hanging tasks in prior work.',
			/** Trusted HTML. */
			caption:
				'Under similar task setups and difficulty, the full task success rate (“SR”) of <i>RaC</i> policy is higher than other methods using an order of magnitude less data. See Appendix D for details.'
		}
	},
	testTime: {
		text: 'During deployment, RaC exhibits test-time scaling characteristic — full task completion success rises with more recovery behaviors.',
		figure: {
			src: '/images/test-time-scaling.webp',
			width: 2000,
			height: 746,
			alt: 'Scatter plots of success rate (%) against average recoveries per successful trajectory, each with a linear fit: shirt hanging (r = 0.714), airtight lid sealing (r = 0.803) and takeout box packing (r = 0.877).'
		} satisfies Image
	}
};
