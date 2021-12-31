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
				.nullable()
				.test(
					(arr) =>
						arr === null ||
						arr === undefined ||
						(arr.length === 2 &&
							arr[0].match(/^(criminal_id|case_no|approved|permission)$/) &&
							(arr[1] === -1 || arr[1] === 1))
				),
			limit: yup.number(),
			// Used for cursor based pagination
			next: yup
				.object({
					id: yup.number().required(),
				})
				.noUnknown()
				.nullable(),
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
	update: yup
		.object({
			permission: yup.string().oneOf(['read', 'write', 'update', 'delete']),
			approved: yup.boolean(),
			police_nid: yup.number().min(10000),
			type: yup.string().oneOf(['case', 'criminal']),
			criminal_id: yup.number().nullable(),
			case_no: yup.number().nullable(),
		})
		.strict()
		.noUnknown()
		.test((obj) => {
			if (obj.type === 'criminal') {
				return !obj.case_no && Boolean(obj.criminal_id);
			} else {
				return !obj.criminal_id && Boolean(obj.case_no);
			}
		}),
};
