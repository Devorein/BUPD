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
				rank: yup.array().of(yup.string()),
			}),
		})
		.concat(paginationSchema(/^(designation|rank|name)$/)),
};
