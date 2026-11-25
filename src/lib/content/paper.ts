import type { Author } from '#lib/types.js';

export const paper = {
	acronym: 'RaC',
	title: 'RaC: Robot Learning for Long-Horizon Tasks by Scaling Recovery and Correction',
	/** The words whose initials spell the acronym; their first letters are underlined. */
	acronymWords: ['Recovery', 'and', 'Correction'],
	authors: [
		{ name: 'Zheyuan Hu', url: 'https://huzheyuan.io' },
		{ name: 'Robyn Wu', url: 'https://www.linkedin.com/in/robynwuprofile/' },
		{ name: 'Naveen Enock', url: 'https://www.linkedin.com/in/naveen-enock/' },
		{ name: 'Jasmine Li', url: 'https://www.linkedin.com/in/jasmine-jiani-li/' },
		{ name: 'Riya Kadakia', url: 'https://www.linkedin.com/in/riyakadakia/' },
		{ name: 'Zackory Erickson', url: 'https://zackory.com/' },
		{ name: 'Aviral Kumar', url: 'https://aviralkumar2907.github.io/' }
	] satisfies Author[],
	affiliation: 'Carnegie Mellon University',
	venue: 'IEEE Transactions on Robotics',
	year: 2026,
	volume: 42,
	pages: [2843, 2860] as [first: number, last: number],
	doi: '10.1109/TRO.2026.3706552',
	pdf: 'https://arxiv.org/pdf/2509.07953',
	arxiv: 'https://arxiv.org/abs/2509.07953',
	code: 'https://github.com/Leo428/RAC',
	/** Hugging Face collection of the policy checkpoints and datasets. */
	release: 'https://huggingface.co/huzheyuan',
	tldr: 'RaC achieves efficient performance scaling via a "mid-training" phase added after imitation pre-training. In this phase, RaC scales recovery & correction data via human intervention data collection. Learning on diverse skills data enables policies to reset, retry, and adapt, mitigating compounding errors in long-horizon manipulation tasks.',
	/** Meta description and social previews: the first two sentences of the TL;DR. */
	description:
		'RaC achieves efficient performance scaling via a "mid-training" phase added after imitation pre-training. In this phase, RaC scales recovery & correction data via human intervention data collection.',
	keywords: [
		'Imitation Learning',
		'Robotic Manipulation',
		'Long Horizon Manipulation',
		'Scaling Law',
		'Robot Learning'
	],
	bibtex: `@article{hu2026rac,
  title={RaC: Robot Learning for Long-Horizon Tasks by Scaling Recovery and Correction},
  author={Hu, Zheyuan and Wu, Robyn and Enock, Naveen and Li, Jasmine and Kadakia, Riya and Erickson, Zackory and Kumar, Aviral},
  journal={IEEE Transactions on Robotics},
  volume={42},
  pages={2843--2860},
  year={2026},
  doi={10.1109/TRO.2026.3706552}
}`
};
