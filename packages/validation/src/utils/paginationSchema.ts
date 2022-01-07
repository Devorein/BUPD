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
				.test((obj) => {
					if (obj === undefined || obj === null) {
						return true;
					}
					// Making sure the keys of next are sortable properties
					const objectKeys = Object.keys(obj);
					return objectKeys.every(
						(objectKey) => objectKey === 'id' || objectKey.match(sortFieldsRegex)
					);
				})
				.nullable(),
		})
		.strict()
		.noUnknown();
}
