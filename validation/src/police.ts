import yup from 'yup';
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
			sort: yup
				.array()
				.test(
					(arr) =>
						arr === undefined ||
						(arr.length === 2 &&
							arr[0].match(/^(designation|rank|name)$/) &&
							(arr[1] === -1 || arr[1] === 1))
				),
			limit: yup.number(),
		})
		.strict()
		.noUnknown(),
	delete: yup
		.object({
			nid: yup.number().min(10000).required(),
		})
		.strict()
		.noUnknown(),
};
