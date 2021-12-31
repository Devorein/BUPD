import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';
import { validateEmail } from './validate';

export const PoliceRequest = {
	update: yup
		.object({
			email: yup.string().test((email) => (email === undefined ? true : validateEmail(email))),
			phone: yup.string().nullable(),
			address: yup.string().nullable(),
			designation: yup.string().nullable(),
			name: yup.string(),
			rank: yup.string(),
		})
		.strict()
		.noUnknown(),
	get: yup
		.object({
			filter: yup.object({
				designation: yup.string(),
				rank: yup.string(),
			}),
		})
		.concat(paginationSchema(/^(designation|rank|name)$/)),
	delete: yup
		.object({
			nid: yup.number().min(10000).required(),
		})
		.strict()
		.noUnknown(),
};
