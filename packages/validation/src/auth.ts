import * as yup from 'yup';
import { validateEmail, validatePassword } from './validate';

export const AuthPayload = {
	register: yup
		.object({
			email: yup.string().test((email) => (email === undefined ? false : validateEmail(email))),
			phone: yup.string().nullable(),
			address: yup.string().nullable(),
			designation: yup.string().nullable(),
			nid: yup.number().min(10000).required(),
			name: yup.string().required(),
			rank: yup.string().required(),
			password: yup.string().test((pass) => (pass === undefined ? false : validatePassword(pass))),
		})
		.strict()
		.noUnknown(),
	login: yup
		.object({
			password: yup.string().test((pass) => (pass === undefined ? false : validatePassword(pass))),
			email: yup.string().test((email) => (email === undefined ? false : validateEmail(email))),
			as: yup.string().oneOf(['police', 'admin']).default('police'),
		})
		.noUnknown(),
	delete: yup
		.object({
			nid: yup.number().min(10000).required(),
		})
		.strict()
		.noUnknown(),
};
