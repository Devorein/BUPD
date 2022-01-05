import * as yup from 'yup';

export const CriminalPayload = {
	update: yup
		.object({
			name: yup.string().required(),
			photo: yup.string().required(),
		})
		.strict()
		.noUnknown(),
};
