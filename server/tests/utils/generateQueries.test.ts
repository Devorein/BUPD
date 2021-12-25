/// <reference types="@types/jest"/>

import {
	generateCountQuery,
	generateWhereClause,
	generateInsertQuery,
	generateSetClause,
	generateSelectQuery,
} from '../../src/utils/generateQueries';

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
	).toBe(
		`SELECT COUNT(*) as count FROM police WHERE \`filter1\`='value1' AND \`filter2\`='value2';`
	);
});

//
describe('.generateWhereClause', () => {
	it(`Should work when we pass only filter`, () => {
		expect(
			generateWhereClause({
				filter: {
					filter1: 'value1',
					filter2: 'value2',
					rank: 'Nayak',
					filter3: null,
				},
			})
		).toBe(`WHERE \`filter1\`='value1' AND \`filter2\`='value2' AND \`rank\`='Nayak'`);
	});

	it(`Should work when we pass empty filter`, () => {
		expect(
			generateWhereClause({
				filter: {},
			})
		).toBe(``);
	});

	it(`Should work when we pass filter with single null value`, () => {
		expect(
			generateWhereClause({
				filter: {
					filter: null,
				},
			})
		).toBe(``);
	});
	it(`Should work when we pass only sort for DESC`, () => {
		expect(
			generateWhereClause({
				sort: ['rank', -1],
			})
		).toBe(`ORDER BY \`rank\` DESC`);
	});
	it(`Should work when we pass only sort for ASC`, () => {
		expect(
			generateWhereClause({
				sort: ['rank', 1],
			})
		).toBe(`ORDER BY \`rank\` ASC`);
	});
	it(`Should work when we pass limit`, () => {
		expect(
			generateWhereClause({
				limit: 10,
			})
		).toBe(`LIMIT 10`);
	});
	it(`Should work when we pass Filter, Limit and Sort`, () => {
		expect(
			generateWhereClause({
				filter: {
					filter1: 'value1',
					filter2: 'value2',
					rank: 'Nayak',
					filter3: null,
				},
				sort: ['rank', -1],
				limit: 10,
			})
		).toBe(
			`WHERE \`filter1\`='value1' AND \`filter2\`='value2' AND \`rank\`='Nayak' ORDER BY \`rank\` DESC LIMIT 10`
		);
	});
});

it(`Should work when we Insert`, () => {
	expect(
		generateInsertQuery(
			{
				payload: {
					field1: 'value1',
					field2: 'value2',
				},
			},
			'police'
		)
	).toBe(`INSERT INTO police(payload) VALUES(\`field1\` = 'value1', \`field2\` = 'value2');`);
});
it(`Should work when we SET in SQL`, () => {
	expect(
		generateSetClause({
			payload: {
				field1: 'value1',
				field2: 'value2',
			},
		})
	).toBe(`SET payload=\`field1\` = 'value1', \`field2\` = 'value2'`);
});
it(`Should work when we SET in SQL`, () => {
	expect(
		generateSelectQuery(
			{
				filter: {
					filter1: 'value1',
				},
			},
			'Police'
		)
	).toBe(`SELECT * FROM Police WHERE \`filter1\`='value1';`);
});
