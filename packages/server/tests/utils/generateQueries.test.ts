/// <reference types="@types/jest"/>

import {
	generateCountQuery,
	generateDeleteQuery,
	generateInsertQuery,
	generateSelectQuery,
	generateSetClause,
	generateUpdateQuery,
	generateWhereClause,
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
	).toBe("SELECT COUNT(*) as count FROM police WHERE `filter1`='value1' AND `filter2`='value2';");
});

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
		).toBe("WHERE `filter1`='value1' AND `filter2`='value2' AND `rank`='Nayak'");
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
		).toBe('ORDER BY `rank` DESC');
	});

	it(`Should work when we pass only sort for ASC`, () => {
		expect(
			generateWhereClause({
				sort: ['rank', 1],
			})
		).toBe('ORDER BY `rank` ASC');
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
			"WHERE `filter1`='value1' AND `filter2`='value2' AND `rank`='Nayak' ORDER BY `rank` DESC LIMIT 10"
		);
	});
});

describe('.generateInsertQuery', () => {
	it(`Should work when we Insert`, () => {
		expect(
			generateInsertQuery(
				{
					field1: 'value1',
					field2: 'value2',
				},
				'police'
			)
		).toBe("INSERT INTO police(`field1`,`field2`) VALUES('value1','value2');");
	});
});

describe('.generateSetClause', () => {
	it(`Should work when we SET in SQL`, () => {
		expect(
			generateSetClause({
				field1: 'value1',
				field2: 'value2',
			})
		).toBe("SET `field1`='value1',`field2`='value2'");
	});
});

describe('.generateSelectQuery', () => {
	it(`Should work when we Select in SQL`, () => {
		expect(
			generateSelectQuery(
				{
					filter: {
						filter1: 'value1',
					},
				},
				'Police'
			)
		).toBe("SELECT * FROM Police WHERE `filter1`='value1';");
	});

	it(`Should work when we Select specific attributes in SQL`, () => {
		expect(
			generateSelectQuery(
				{
					filter: {
						filter1: 'value1',
					},
					select: ['attribute1'],
				},
				'Police'
			)
		).toBe("SELECT `attribute1` FROM Police WHERE `filter1`='value1';");
	});
});

describe('.generateUpdateQuery', () => {
	it(`Should work when we UPDATE in SQL`, () => {
		expect(
			generateUpdateQuery(
				{
					filter1: 'value1',
				},
				{
					payload: 'value',
				},
				'Police'
			)
		).toBe("UPDATE Police SET `payload`='value' WHERE `filter1`='value1'");
	});
});

describe('.generateDeleteQuery', () => {
	it(`Should generate delete query`, () => {
		expect(generateDeleteQuery({ rank: 'Sergeant' }, 'police')).toBe(
			"DELETE FROM police WHERE `rank`='Sergeant';"
		);
	});
});
