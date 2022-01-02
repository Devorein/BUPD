/// <reference types="@types/jest"/>

import {
	generateCountQuery,
	generateDeleteQuery,
	generateInsertQuery,
	generateLimitClause,
	generateLogicalOperationClauses,
	generateOrderbyClause,
	generatePaginationQuery,
	generateScalarClauses,
	generateSelectQuery,
	generateSetClause,
	generateUpdateQuery,
	generateWhereClause,
} from '../../src/utils/generateQueries';

it(`generateCountQuery`, () => {
	expect(
		generateCountQuery(
			[
				{
					filter1: 'value1',
					filter2: 'value2',
				},
			],
			'police'
		)
	).toBe("SELECT COUNT(*) as count FROM police WHERE (`filter1`='value1' AND `filter2`='value2');");
});

describe('.generateScalarClauses', () => {
	it(`Should generate correct operators`, () => {
		expect(
			generateScalarClauses({
				a: {
					$gt: 1,
				},
				b: {
					$lte: 3,
				},
				c: {
					$in: [1, 2, 3],
				},
				d: {
					$gte: 'abc',
				},
				e: {
					$lt: 5,
				},
				f: {
					$neq: 'def',
				},
				g: {
					$eq: 5,
				},
				h: true,
			})
		).toBe(
			"(`a`>1 AND `b`<=3 AND `c` IN(1,2,3) AND `d`>='abc' AND `e`<5 AND `f`!='def' AND `g`=5 AND `h`=true)"
		);
	});

	it(`Should generate nothing if query is empty`, () => {
		expect(generateScalarClauses({})).toBe(``);
	});
});

describe('.generateLogicalOperationClauses', () => {
	it(`Should work with complex nested queries`, () => {
		expect(
			generateLogicalOperationClauses(
				[
					{
						key1: {
							$gt: 'val1',
						},
						key2: 'val2',
					},
					{
						$or: [
							{
								key3: {
									$in: [1, 2, 3],
								},
								key4: {
									$lte: 5,
								},
							},
							{
								key5: {
									$gte: 6,
								},
							},
						],
					},
					{
						$or: [{}],
					},
					{
						$and: [
							{
								key6: 'value6',
							},
						],
					},
				],
				'AND',
				0
			)
		).toBe(
			"((`key1`>'val1' AND `key2`='val2') AND ((`key3` IN(1,2,3) AND `key4`<=5) OR (`key5`>=6)) AND (`key6`='value6'))"
		);
	});
});

describe('.generateWhereClause', () => {
	it(`Should work when we pass only filter`, () => {
		expect(
			generateWhereClause([
				{
					filter1: 'value1',
					filter2: 'value2',
					filter3: {
						$gt: 'value3',
					},
				},
			])
		).toBe("WHERE (`filter1`='value1' AND `filter2`='value2' AND `filter3`>'value3')");
	});

	it(`Should work when we pass empty filter`, () => {
		expect(generateWhereClause([])).toBe(``);
	});
});

describe('.generateOrderbyClause', () => {
	it(`Should work when we pass only sort for DESC`, () => {
		expect(
			generateOrderbyClause([
				['rank', -1],
				['key', -1],
			])
		).toBe('ORDER BY `rank` DESC, `key` DESC');
	});

	it(`Should work when we pass only sort for ASC`, () => {
		expect(generateOrderbyClause([['rank', 1]])).toBe('ORDER BY `rank` ASC');
	});
});

describe('.generateLimitClause', () => {
	it(`Should work when we pass limit`, () => {
		expect(generateLimitClause(10)).toBe(`LIMIT 10`);
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
	it(`Should work select all attributes by default and no sql clause is sent`, () => {
		expect(generateSelectQuery({}, 'Police')).toBe('SELECT * FROM Police ;');
	});

	it(`Should work when we Select specific attributes in SQL`, () => {
		expect(
			generateSelectQuery(
				{
					filter: [
						{
							filter1: 'value1',
							filter2: 'value2',
							rank: 'Nayak',
						},
					],
					sort: [['rank', -1]],
					limit: 10,
					select: ['attribute1'],
				},
				'Police'
			)
		).toBe(
			"SELECT `attribute1` FROM Police WHERE (`filter1`='value1' AND `filter2`='value2' AND `rank`='Nayak') ORDER BY `rank` DESC LIMIT 10;"
		);
	});
});

describe('.generateUpdateQuery', () => {
	it(`Should work when we UPDATE in SQL`, () => {
		expect(
			generateUpdateQuery(
				[
					{
						filter1: 'value1',
					},
				],
				{
					payload: 'value',
				},
				'Police'
			)
		).toBe("UPDATE Police SET `payload`='value' WHERE (`filter1`='value1');");
	});
});

describe('.generateDeleteQuery', () => {
	it(`Should generate delete query`, () => {
		expect(generateDeleteQuery([{ rank: 'Sergeant' }], 'police')).toBe(
			"DELETE FROM police WHERE (`rank`='Sergeant');"
		);
	});
});

describe('.generatePaginationQuery', () => {
	it(`Should generate update filter if no filter and sort is present`, () => {
		expect(generatePaginationQuery({ next: { id: 2 } }, 'access_id')).toMatchObject({
			filter: [
				{
					access_id: {
						$gt: 2,
					},
				},
			],
		});
	});

	it(`Should generate update filter if filter and sort(descending) is present`, () => {
		expect(
			generatePaginationQuery(
				{ filter: [{ field1: 'value1' }], sort: [['field2', -1]], next: { id: 2 } },
				'access_id'
			)
		).toMatchObject({
			filter: [{ field1: 'value1' }, { $or: [{ field2: {} }, { access_id: { $lt: 2 } }] }],
			sort: [
				['field2', -1],
				['access_id', -1],
			],
			next: { id: 2 },
		});
	});

	it(`Should generate update filter if filter and sort(ascending) is present`, () => {
		expect(
			generatePaginationQuery(
				{ filter: [{ field1: 'value1' }], sort: [['field2', 1]], next: { id: 2, field2: 2 } },
				'access_id'
			)
		).toMatchObject({
			filter: [
				{ field1: 'value1' },
				{
					$or: [
						{
							field2: {
								$gt: 2,
							},
						},
						{ access_id: { $gt: 2 } },
					],
				},
			],
			sort: [
				['field2', 1],
				['access_id', 1],
			],
			next: { id: 2 },
		});
	});
});
