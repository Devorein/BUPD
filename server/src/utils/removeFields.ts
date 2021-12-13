export default function removeFields<
	Data extends Record<string, any>,
	TransformedData extends Record<string, any>
>(data: Data, excludedFields: (keyof Data)[]) {
	const newData: Record<string, any> = {};
	const fields = Object.keys(data);
	const excludedFieldsSet: Set<string> = new Set(excludedFields as string[]);
	fields.forEach((field) => {
		if (!excludedFieldsSet.has(field)) {
			newData[field] = data[field] as any;
		}
	});
	return newData as TransformedData;
}
