import type { Section } from '#lib/types.js';

/** Page sections in order. Ids are kept from the old site where the section is the same. */
export const sections: Section[] = [
	{ id: 'introduction', nav: 'Overview' },
	{ id: 'data-collection', nav: 'Protocol' },
	{ id: 'results', nav: 'Results' },
	{ id: 'rollouts', nav: 'Rollouts' },
	{ id: 'evaluation', nav: 'Uncut evaluation' },
	{ id: 'citation', nav: 'Citation' }
];
