import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';
import { validateEmail, validatePassword } from './validate';

function policeValidationSchema(purpose?: 'create' | 'update', domain?: 'server' | 'client') {
	// eslint-disable-next-line
	purpose = purpose ?? 'update';

	const baseSchema = {
		email: yup.string().test((email) => {
			if (!email || !validateEmail(email)) {
				return false;
			}
			return true;
		}),
		phone: yup.string(),
		address: yup.string(),
		designation: yup.string(),
		name: yup.string(),
		rank: yup.string(),
	};

	if (purpose === 'create') {
		return yup
			.object({
				email: baseSchema.email
					.required(domain === 'client' ? 'Required' : undefined)
					.typeError('Invalid'),
				name: baseSchema.name.required(domain === 'client' ? 'Required' : undefined),
				rank: baseSchema.rank.required(domain === 'client' ? 'Required' : undefined),
				password: yup
					.string()
					.test((password) => validatePassword(password ?? ''))
					.required(domain === 'client' ? 'Required' : undefined),
				nid: yup.number().required(domain === 'client' ? 'Required' : undefined),
				address: baseSchema.address,
				phone: baseSchema.phone,
				designation: baseSchema.designation,
			})
			.strict()
			.noUnknown();
	}

	return yup
		.object({
			email: baseSchema.email.nullable(),
			name: baseSchema.name.nullable(),
			rank: baseSchema.rank.nullable(),
			address: baseSchema.address.nullable(),
			phone: baseSchema.phone.nullable(),
			designation: baseSchema.designation.nullable(),
		})
		.strict()
		.noUnknown();
}

export const PoliceRequest = {
	update: policeValidationSchema('update'),
	get: yup
		.object({
			filter: yup.object({
				rank: yup.array().of(yup.string()),
			}),
		})
		.concat(paginationSchema(/^(designation|rank|name)$/)),
	create: (domain: 'client' | 'server') => policeValidationSchema('create', domain),
};
