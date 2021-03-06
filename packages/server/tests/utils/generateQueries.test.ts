/// <reference types="@types/jest"/>

import {
	generateCountQuery,
	generateDeleteQuery,
	generateGroupClause,
	generateInsertQuery,
	generateJoinClause,
	generateLimitClause,
	generateLogicalOperationClauses,
	generateOrderbyClause,
	generateScalarClauses,
	generateSelectClause,
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

describe('.generateGroupClause', () => {
	it(`Should generate group clause for empty array`, () => {
		expect(generateGroupClause([])).toBe(``);
	});

	it(`Should generate group clause for non empty array`, () => {
		expect(generateGroupClause(['name', 'age'])).toBe('GROUP BY `name`,`age`');
	});
});

describe('.generateSelectClause', () => {
	it(`Should generate correct select clause without joins`, () => {
		expect(
			generateSelectClause(
				[
					'col1',
					{
						aggregation: ['SUM', 'COUNT'],
						attribute: 'col2',
					},
				],
				false
			)
		).toBe('`col1`,COUNT(SUM(`col2`)) as `col2`');
	});

	it(`Should generate correct select clause with joins`, () => {
		expect(
			generateSelectClause(
				[
					'col1',
					{
						aggregation: ['SUM', 'COUNT'],
						attribute: 'col2',
					},
				],
				true
			)
		).toBe('col1 as `col1`,COUNT(SUM(`col2`)) as `col2`');
	});
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
				i: {
					$is: null,
				},
			})
		).toBe(
			"(`a`>1 AND `b`<=3 AND `c` IN(1,2,3) AND `d`>='abc' AND `e`<5 AND `f`!='def' AND `g`=5 AND `h`=true AND `i` IS NULL)"
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

	it(`Should work when we pass undefined sort`, () => {
		expect(generateOrderbyClause(undefined)).toBe('');
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

	it(`Should work when we select specific attributes have filter and sort`, () => {
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
					joins: [],
					sort: [['rank', -1]],
					limit: 10,
					select: ['attribute1'],
					groups: ['col1'],
				},
				'Police'
			)
		).toBe(
			"SELECT `attribute1` FROM Police WHERE (`filter1`='value1' AND `filter2`='value2' AND `rank`='Nayak') GROUP BY `col1` ORDER BY `rank` DESC LIMIT 10;"
		);
	});

	it(`Should work when we have join in select query`, () => {
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
					joins: [['Police', 'Criminal', 'nid', 'criminal_nid']],
					sort: [['rank', -1]],
					limit: 10,
					select: ['Police.attribute1'],
				},
				'Police'
			)
		).toBe(
			"SELECT Police.attribute1 as `Police.attribute1` FROM Police as Police LEFT JOIN Criminal as Criminal on Police.nid = Criminal.criminal_nid WHERE (Police.`filter1`='value1' AND Police.`filter2`='value2' AND Police.`rank`='Nayak') ORDER BY Police.`rank` DESC LIMIT 10;"
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

describe('.generateJoinClause', () => {
	it(`Should work when joins is empty`, () => {
		expect(generateJoinClause([])).toBe('');
	});

	it(`Should work when joins is not empty`, () => {
		expect(
			generateJoinClause([
				['Access', 'Police', 'police_nid', 'nid', 'LEFT'],
				['Access', 'Criminal', 'criminal_id', 'criminal_id'],
			])
		).toBe(
			`Access as Access LEFT JOIN Police as Police on Access.police_nid = Police.nid LEFT JOIN Criminal as Criminal on Access.criminal_id = Criminal.criminal_id`
		);
	});
});
