import {
	accessAttributes,
	casefileAttributes,
	criminalAttributes,
	policeAttributes,
	victimAttributes,
} from '@bupd/constants';
import { IAccess, ICasefile, ICriminal, IPolice, IVictim } from '@bupd/types';

function generateAttributes<Entity>(
	attributes: (keyof Entity)[],
	namespace?: string,
	removeFields?: (keyof Entity)[]
) {
	const removeFieldsSet: Set<string> = new Set(removeFields as string[]);

	const modifiedAttributes: string[] = [];
	(attributes as string[]).forEach((attribute) => {
		if (!removeFieldsSet.has(attribute)) {
			modifiedAttributes.push(namespace ? `${namespace}.${attribute}` : attribute);
		}
	});
	return modifiedAttributes;
}

export function getPoliceAttributes(namespace?: string, removeFields?: (keyof IPolice)[]) {
	return generateAttributes<IPolice>(policeAttributes, namespace, removeFields);
}

export function getAccessAttributes(namespace?: string, removeFields?: (keyof IAccess)[]) {
	return generateAttributes<IAccess>(accessAttributes, namespace, removeFields);
}

export function getCasefileAttributes(namespace?: string, removeFields?: (keyof ICasefile)[]) {
	return generateAttributes<ICasefile>(casefileAttributes, namespace, removeFields);
}

export function getCriminalAttributes(namespace?: string, removeFields?: (keyof ICriminal)[]) {
	return generateAttributes<ICriminal>(criminalAttributes, namespace, removeFields);
}

export function getVictimAttributes(namespace?: string, removeFields?: (keyof IVictim)[]) {
	return generateAttributes<IVictim>(victimAttributes, namespace, removeFields);
}
