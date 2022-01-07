export function setDifference(setA: Set<string>, setB: Set<string>) {
	const set: Set<string> = new Set();
	setA.forEach((setAItem) => {
		if (!setB.has(setAItem)) {
			set.add(setAItem);
		}
	});

	return set;
}
