/// <reference types="@types/jest"/>

import removeFields from '../../src/utils/removeFields';

describe('.removeFields', () => {
	it(`Should return an object after removing the required key, val`, () => {
		expect(
			removeFields(
				{
					field1: 'value1',
					field2: 'value2',
				},
				['field2']
			)
		).toStrictEqual({
			field1: 'value1',
		});
	});
});
