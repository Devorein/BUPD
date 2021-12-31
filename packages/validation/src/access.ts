import * as yup from 'yup';

export const AccessPayload = {
	get: yup
		.object({
			filter: yup
				.object({
					approved: yup.number().min(0).max(1).required(),
					permission: yup
						.array()
						.of(yup.string().oneOf(['read', 'write', 'update', 'delete']))
						.required(),
					type: yup.string().oneOf(['case', 'criminal']).required(),
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
			// Used for cursor based pagination
			next: yup
				.object({
					id: yup.number(),
				})
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
			access_id: yup.number().required(),
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
			switch (obj.type) {
				case 'criminal':
					return !obj.case_no && Boolean(obj.criminal_id);
				case 'case':
					return !obj.criminal_id && Boolean(obj.case_no);
				default:
					return !obj.criminal_id && !obj.case_no;
			}
		}),
};
