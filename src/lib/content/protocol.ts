import type { Video } from '#lib/types.js';

export const protocol = {
	title: 'RaC Data Collection Protocol',
	intro: 'RaC standardizes human intervention data collection protocols with two rules:',
	rules: [
		'Upon intervention, operators first recover back to in-distribution states, then perform correction to complete the sub-task.',
		'After intervention completes, operator terminates the episode to prevent further rollouts.'
	],
	video: {
		key: 'data_collection/full_demos_and_intervention',
		width: 1920,
		height: 1080,
		duration: 117.25,
		codecs: { av1: 'av01.0.08M.08', h264: 'avc1.4d4028' }
	} satisfies Video,
	videoLabel: 'RaC data collection protocol on the shirt-hanging task'
};
