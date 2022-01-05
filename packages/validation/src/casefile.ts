import { CASEFILE_PRIORITIES, CASEFILE_STATUSES } from '@bupd/constants';
import * as yup from 'yup';
import { VictimEntitySchema } from './victim';

export const CasefilePayload = {
	create: yup
		.object({
			categories: yup.array(yup.string()).default([]).strict(),
			weapons: yup.array(yup.string()).default([]).strict(),
			time: yup.number().required().strict(),
			status: yup.string().oneOf(CASEFILE_STATUSES).nullable().strict(),
			location: yup.string().required().strict(),
			criminals: yup
				.array()
				.of(
					yup
						.mixed()
						.test(
							(obj) =>
								(obj.name !== undefined && typeof obj.name === 'string') ||
								(obj.id !== undefined && typeof obj.id === 'number')
						)
				)
				.default([])
				.strict(),
			priority: yup.number().oneOf(CASEFILE_PRIORITIES).strict().required(),
			victims: yup.array().of(VictimEntitySchema),
		})
		.strict()
		.noUnknown(),
	update: yup
		.object({
			police_nid: yup.number().strict(),
			time: yup.number().strict(),
			status: yup.string().oneOf(CASEFILE_STATUSES).nullable().strict(),
			location: yup.string().strict(),
			priority: yup.number().oneOf(CASEFILE_PRIORITIES).strict().required(),
		})
		.strict()
		.noUnknown(),
};
