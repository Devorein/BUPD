import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';

function victimValidationSchema(domain?: 'server' | 'client') {
	const baseSchema = {
		name: yup.string().required(),
		address: yup.string().required(),
		age: yup.number().max(120).required(),
		phone_no: yup.string().required(),
		description: yup.string().required(),
	};

	if (domain === 'client') {
		Object.keys(baseSchema).forEach((key) => {
			(baseSchema as any)[key] = baseSchema[key as keyof typeof baseSchema].required('Required');
		});

		return yup.object(baseSchema).strict().noUnknown();
	}

	return yup
		.object({
			...baseSchema,
			case_no: yup.number().required(),
			old_name: yup.string().required(),
		})
		.strict()
		.noUnknown();
}

export const VictimRequest = {
	create: victimValidationSchema('client'),
	get: yup
		.object({
			filter: yup.object({
				search: yup.array().of(yup.number()),
				age: yup
					.array()
					.of(yup.number())
					.test((value) =>
						Boolean(
							value &&
								value.length === 2 &&
								(typeof value[0] === 'number' || typeof value[0] === 'undefined') &&
								(typeof value[1] === 'number' || typeof value[1] === 'undefined')
						)
					),
			}),
		})
		.concat(paginationSchema(/^(case_no|age|name)$/)),
	delete: yup
		.object({
			case_no: yup.number().required(),
			name: yup.string().required(),
		})
		.strict()
		.noUnknown(),
	update: (domain: 'server' | 'client') => victimValidationSchema(domain),
};
