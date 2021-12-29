/**
 * Generate and return new object with appropriate fields removed, keeping the rest intact
 * @param data Object to remove fields from
 * @param excludedFields Array of fields to be removed
 * @returns A new object with the fields removed
 */
export default function removeFields<
	Data extends Record<string, any>,
	TransformedData extends Record<string, any> = Data
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
