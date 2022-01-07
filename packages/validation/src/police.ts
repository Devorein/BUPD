import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';
import { validateEmail, validatePassword } from './validate';

function policeValidationSchema(purpose?: 'create' | 'update', domain?: 'server' | 'client') {
	// eslint-disable-next-line
	purpose = purpose ?? 'update';

	const baseSchema = {
		email: yup
			.string()
			.test((email) => {
				if (!email || !validateEmail(email)) {
					return false;
				}
				return true;
			})
			.required(domain === 'client' ? 'Required' : undefined)
			.typeError('Invalid'),
		phone: yup.string().required(domain === 'client' ? 'Required' : undefined),
		address: yup.string().required(domain === 'client' ? 'Required' : undefined),
		designation: yup.string().required(domain === 'client' ? 'Required' : undefined),
		name: yup.string().required(domain === 'client' ? 'Required' : undefined),
		rank: yup.string().required(domain === 'client' ? 'Required' : undefined),
	};

	if (purpose === 'create') {
		return yup
			.object({
				...baseSchema,
				password: yup
					.string()
					.test((password) => validatePassword(password ?? ''))
					.required(domain === 'client' ? 'Required' : undefined),
				nid: yup.number().required(domain === 'client' ? 'Required' : undefined),
			})
			.strict()
			.noUnknown();
	}

	return yup.object(baseSchema).strict().noUnknown();
}

export const PoliceRequest = {
	update: (domain: 'client' | 'server') => policeValidationSchema('update', domain),
	updateProfile: (domain: 'client' | 'server') =>
		policeValidationSchema('update', domain).concat(
			yup.object({
				password: yup.string().required(domain === 'client' ? 'Required' : undefined),
				new_password: yup.string().test(function validation(password) {
					if (!password) {
						return true;
					}
					if (!validatePassword(password)) {
						return (this as any).createError({
							message: 'Weak password',
							path: 'new_password',
						});
					}
					return true;
				}),
				nid: yup.number().required(),
			})
		),
	get: yup
		.object({
			filter: yup.object({
				search: yup.array().of(yup.number()),
				rank: yup.array().of(yup.string()),
			}),
		})
		.concat(paginationSchema(/^(designation|rank|name)$/)),
	create: (domain: 'client' | 'server') => policeValidationSchema('create', domain),
};
