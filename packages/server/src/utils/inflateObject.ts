export function inflateObject<Data>(object: Record<string, any>, baseKey: string) {
	console.log(JSON.stringify(object));

	const baseObject: Record<string, any> = {};
	Object.keys(object).forEach((objectKey) => {
		const [keyFirstPart, keySecondPart] = objectKey.split('.');
		const isBaseKey = keyFirstPart === baseKey;
		if (!isBaseKey) {
			const lowercasedKey = keyFirstPart.toLowerCase();
			if (!baseObject[lowercasedKey]) {
				baseObject[lowercasedKey] = {};
			}
			baseObject[lowercasedKey][keySecondPart] = object[objectKey];
		} else {
			baseObject[keySecondPart] = object[objectKey];
		}
		delete baseObject[objectKey];
	});
	return baseObject as Data;
}
