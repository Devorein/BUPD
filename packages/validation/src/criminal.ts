import * as yup from 'yup';

export const CriminalPayload = {
	update: yup
		.object({
			name: yup.string().strict(),
			photo: yup.string().nullable().strict(),
		})
		.strict()
		.noUnknown(),
};
