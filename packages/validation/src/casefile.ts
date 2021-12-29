import * as yup from 'yup';

export const CasefilePayload = {
	create: yup
		.object({
			categories: yup.array(yup.string()).default([]).strict(),
			weapons: yup.array(yup.string()).default([]).strict(),
			time: yup.number().required().strict(),
			status: yup.string().oneOf(['solved', 'open', 'closed']).nullable().strict(),
			location: yup.string().required().strict(),
			criminals: yup
				.array()
				.of(
					yup
						.mixed()
						.test(
							(obj) =>
								(obj.name !== undefined && typeof obj.name === 'string') ||
								(obj.id !== undefined && typeof obj.id === 'number')
						)
				)
				.default([])
				.strict(),
			priority: yup.string().oneOf(['high', 'low', 'medium']).strict(),
			victims: yup.array().of(
				yup
					.object({
						name: yup.string().default('John Doe'),
						address: yup.string().nullable(),
						age: yup.number().max(120).nullable(),
						phone_no: yup.string().nullable(),
						description: yup.string().nullable(),
					})
					.required()
					.strict()
					.noUnknown()
			),
		})
		.strict()
		.noUnknown(),
	delete: yup
		.object({
			case_no: yup.number().required().strict(),
		})
		.strict()
		.noUnknown(),
	update: yup
		.object({
			case_no: yup.number().required().strict(),
			police_nid: yup.number().strict(),
			time: yup.number().strict(),
			status: yup.string().oneOf(['solved', 'open', 'closed']).nullable().strict(),
			location: yup.string().strict(),
			priority: yup.string().oneOf(['high', 'low', 'medium']).strict().nullable(),
		})
		.strict()
		.noUnknown(),
};
