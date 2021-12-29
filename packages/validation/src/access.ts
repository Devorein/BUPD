import * as yup from 'yup';

export const AccessPayload = {
	get: yup
		.object({
			filter: yup
				.object({
					approved: yup.number().min(0).max(1),
					permission: yup.array().of(yup.string().oneOf(['read', 'write', 'update', 'delete'])),
					type: yup.string().oneOf(['case', 'criminal']),
				})
				.strict()
				.noUnknown(),
			sort: yup
				.array()
				.test(
					(arr) =>
						arr === undefined ||
						(arr.length === 2 &&
							arr[0].match(/^(criminal_id|case_no|approved|permission)$/) &&
							(arr[1] === -1 || arr[1] === 1))
				),
			limit: yup.number(),
		})
		.strict()
		.noUnknown(),
	create: yup
		.object({
			case_no: yup.number().nullable(),
			criminal_id: yup.number().nullable(),
			permission: yup.string().oneOf(['read', 'write', 'update', 'delete']).required(),
		})
		.test(
			(obj) =>
				(!obj.case_no && Boolean(obj.criminal_id)) || (!obj.criminal_id && Boolean(obj.case_no))
		)
		.strict()
		.noUnknown(),
};
