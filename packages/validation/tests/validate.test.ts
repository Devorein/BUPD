/// <reference types="@types/jest"/>

import { checkForFields, validateEmail, validatePassword } from '../src/validate';
describe('.validateEmail', () => {
	it(`Should return true if the email is valid`, () => {
		expect(validateEmail('randomemail1922@gmail.com')).toBe(true);
	});
	it(`Should return false if the email is invalid`, () => {
		expect(validateEmail('randomemail1922gmail.com')).toBe(false);
	});
});
describe('.validatePassword', () => {
	it(`Should return true if the password is valid`, () => {
		expect(validatePassword('aZ120vFW91n')).toBe(true);
	});
	it(`Should return false if the password is invalid`, () => {
		expect(validatePassword('')).toBe(false);
	});
});
describe('.checkForFields', () => {
	it(`Should return field that are present in the object`, () => {
		expect(
			checkForFields(
				{
					filter1: 'value1',
					filter2: 'value2',
					rank: 'Nayak',
					filter3: null,
				},
				['filter1', 'filter4' as any]
			)
		).toStrictEqual(['filter4']);
	});
});
