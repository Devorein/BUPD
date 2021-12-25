/// <reference types="@types/jest"/>

import { generateCountQuery, generateWhereClause } from '../../src/utils/generateQueries';

it(`generateCountQuery`, () => {
	expect(
		generateCountQuery(
			{
				filter: {
					filter1: 'value1',
					filter2: 'value2',
				},
			},
			'police'
		)
	).toBe(`SELECT COUNT(*) as count FROM police WHERE filter1='value1' AND filter2='value2';`);
});

//
describe('.generateWhereClause', () => {
	it(`Should work when we pass only filter`, () => {
		expect(
			generateWhereClause({
				filter: {
					filter1: 'value1',
					filter2: 'value2',
				},
			})
		).toBe(`WHERE filter1='value1' AND filter2='value2'`);
	});

	it(`Should work when we pass empty filter`, () => {
		expect(
			generateWhereClause({
				filter: {},
			})
		).toBe(``);
	});
});
