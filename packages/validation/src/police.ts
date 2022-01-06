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
		phone: yup.string(),
		address: yup.string(),
		designation: yup.string(),
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
