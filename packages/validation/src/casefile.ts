import { CASEFILE_PRIORITIES, CASEFILE_STATUSES, CRIME_CATEGORIES } from '@bupd/constants';
import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';
import { VictimRequest } from './victim';

function casefileValidationSchema(domain: 'server' | 'client') {
	const baseSchema = {
		categories: yup.array().of(yup.string().oneOf(CRIME_CATEGORIES)).required(),
		weapons: yup.array(yup.string()).default([]).required(),
		status: yup.string().oneOf(CASEFILE_STATUSES).nullable().required(),
		location: yup.string().required(),
		time: yup.number().required(),
		criminals: yup
			.array()
			.of(
				yup.object({
					name: yup.string().required('Required'),
				})
			)
			.default([])
			.required(),
		priority: yup.number().oneOf(CASEFILE_PRIORITIES).required(),
		victims: yup.array().of(VictimRequest.create),
	};

	if (domain === 'client') {
		Object.keys(baseSchema).forEach((key) => {
			(baseSchema as any)[key] = baseSchema[key as keyof typeof baseSchema].required('Required');
		});

		return yup.object(baseSchema).strict().noUnknown();
	}

	return yup.object(baseSchema).strict().noUnknown();
}

export const CasefilePayload = {
	create: (domain: 'server' | 'client') => casefileValidationSchema(domain),
	update: yup
		.object({
			status: yup.string().oneOf(CASEFILE_STATUSES).nullable().required(),
			location: yup.string().required(),
			categories: yup.array().of(yup.string().oneOf(CRIME_CATEGORIES)).required(),
			weapons: yup.array(yup.string()).default([]).required(),
			priority: yup.number().oneOf(CASEFILE_PRIORITIES).required(),
		})
		.strict()
		.noUnknown(),
	get: yup
		.object({
			filter: yup
				.object({
					search: yup.array().of(yup.number()),
					priority: yup.array().of(yup.number().oneOf(CASEFILE_PRIORITIES)),
					status: yup.array().of(yup.string().oneOf(CASEFILE_STATUSES)),
					time: yup.array().test((arr) => {
						if (arr === undefined) {
							return false;
						}
						return (
							(arr[0] === undefined || typeof arr[0] === 'string') &&
							(arr[1] === undefined || typeof arr[1] === 'string')
						);
					}),
				})
				.strict()
				.noUnknown(),
		})
		.concat(paginationSchema(/^(case_no|priority|status|time)$/)),
};
