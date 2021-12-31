import * as yup from 'yup';

export function paginationSchema(sortFieldsRegex: RegExp) {
	return yup
		.object({
			sort: yup
				.array()
				.nullable()
				.test(
					(arr) =>
						arr === undefined ||
						arr === null ||
						(arr.length === 2 && arr[0].match(sortFieldsRegex) && (arr[1] === -1 || arr[1] === 1))
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
		.noUnknown();
}
