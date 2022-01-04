import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';

export const VictimEntitySchema = yup
	.object({
		name: yup.string().default('John Doe'),
		address: yup.string().nullable(),
		age: yup.number().max(120).nullable(),
		phone_no: yup.string().nullable(),
		description: yup.string().nullable(),
	})
	.required()
	.strict()
	.noUnknown();

export const VictimRequest = {
	get: yup
		.object({
			filter: yup.object({
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
	update: VictimEntitySchema,
};
