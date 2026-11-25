import type { Task, Video } from '#lib/types.js';

/** Rollout clips are encoded at 1280×720 (the player is at most ~640 CSS px wide). */
const encoding = {
	width: 1280,
	height: 720,
	codecs: { av1: 'av01.0.05M.08', h264: 'avc1.640028' }
};

export const rollouts = {
	title: 'Recovery & Correction Improves Robustness to Failures',
	note: 'All videos are autonomous policy rollouts recorded at 1x speed.',
	comparison: {
		title: 'Learned Policies Comparison',
		video: {
			key: 'comparison/policy_comparison',
			width: 1824,
			height: 1078,
			duration: 85.65,
			codecs: { av1: 'av01.0.08M.08', h264: 'avc1.4d4028' }
		} satisfies Video,
		label: 'Shirt hanging rollouts of the RaC, HG-DAgger and full-demos BC policies side by side'
	},
	tasks: [
		{
			id: 'shirt-hanging',
			title: 'Shirt Hanging',
			clips: [
				{
					key: 'shirt_hanging/shirt_hang_5',
					caption: 'The robot recovers from left shoulder insertion failures many times.',
					duration: 118.35
				},
				{
					key: 'shirt_hanging/shirt_hang_0',
					caption: 'The robot recovers from both right and left shoulder failures.',
					duration: 92.23
				},
				{
					key: 'shirt_hanging/shirt_hang_1',
					caption: 'The robot recovers from both right and left shoulder failures.',
					duration: 88.99
				},
				{
					key: 'shirt_hanging/shirt_hang_2',
					caption: 'The robot fixes left shoulder insertion and the final hanging.',
					duration: 90.39
				},
				{
					key: 'shirt_hanging/shirt_hang_3',
					caption: 'The robot succeeds without making mistakes.',
					duration: 72.74
				},
				{
					key: 'shirt_hanging/shirt_hang_4',
					caption: 'The robot recovers from left shoulder insertion failure.',
					duration: 99.0
				}
			].map((clip) => ({ ...clip, ...encoding }))
		},
		{
			id: 'lid-sealing',
			title: 'Airtight Container Lid Sealing',
			clips: [
				{
					key: 'lid_sealing/lid_4',
					caption: 'The robot consistently recovers from snapping failures.',
					duration: 152.45
				},
				{
					key: 'lid_sealing/lid_1',
					caption: 'This example recovers from a tab snapping failure.',
					duration: 69.4
				},
				{
					key: 'lid_sealing/lid_2',
					caption: 'This video shows reactive recovery from failed lid placement.',
					duration: 85.65
				},
				{
					key: 'lid_sealing/lid_3',
					caption: 'The robot recovers from minor lid placement imperfection.',
					duration: 69.7
				},
				{
					key: 'lid_sealing/lid_0',
					caption: 'The robot successfully seals the lid without making mistakes.',
					duration: 61.73
				}
			].map((clip) => ({ ...clip, ...encoding }))
		},
		{
			id: 'takeout-box-packing',
			title: 'Clamshell Takeout Box Packing',
			clips: [
				{
					key: 'takeout_box_packing/burger_4',
					caption:
						'The robot succeeds packing a burger into a takeout box without making mistakes.',
					duration: 126.29
				},
				{
					key: 'takeout_box_packing/burger_0',
					caption:
						'The robot detects failed attempts at the final stage, then recovers from them and correctly completes the task.',
					duration: 207.34
				},
				{
					key: 'takeout_box_packing/burger_1',
					caption: 'The robot recovers from incorrectly grasping the spatula.',
					duration: 127.56
				},
				{
					key: 'takeout_box_packing/burger_2',
					caption: 'The robot recovers from misaligned grasping spatula and securing tab failures.',
					duration: 124.42
				},
				{
					key: 'takeout_box_packing/burger_3',
					caption:
						'The robot recovers from failed grasping of the spatula, performs corrections for scooping the burger, detects and recovers from a failed attempt at the final stage.',
					duration: 132.5
				}
			].map((clip) => ({ ...clip, ...encoding }))
		}
	] satisfies Task[]
};
