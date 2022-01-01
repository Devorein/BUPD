import * as yup from 'yup';
import { paginationSchema } from './utils/paginationSchema';

export const AccessPayload = {
	get: yup
		.object({
			filter: yup
				.object({
					approved: yup.array().of(yup.number().min(0).max(1)),
					permission: yup.array().of(yup.string().oneOf(['read', 'write', 'update', 'delete'])),
					type: yup.array().of(yup.string().oneOf(['case', 'criminal'])),
				})
				.strict()
				.noUnknown(),
		})
		.concat(paginationSchema(/^(criminal_id|case_no|approved|permission)$/)),
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
			approved: yup.number().oneOf([0, 1]),
		})
		.strict()
		.noUnknown(),
};
