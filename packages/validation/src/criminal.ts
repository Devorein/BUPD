import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';

export const CriminalPayload = {
	update: yup
		.object({
			name: yup.string().required(),
			photo: yup.string().nullable(),
		})
		.strict()
		.noUnknown(),
	get: yup
		.object({
			filter: yup
				.object({
					search: yup.array().of(yup.number()),
				})
				.strict()
				.noUnknown(),
		})
		.concat(paginationSchema(/^(criminal_id|name)$/)),
};
