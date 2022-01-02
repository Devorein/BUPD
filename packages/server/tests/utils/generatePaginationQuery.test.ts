import { generatePaginationQuery } from '../../src/utils/generatePaginationQuery';

describe('.generatePaginationQuery', () => {
	it.only(`Should work if next, sort is not present`, () => {
		expect(
			generatePaginationQuery(
				{
					filter: [
						{
							a: 1,
						},
					],
				},
				'access_id'
			)
		).toMatchObject({
			sort: [['access_id', 1]],
			filter: [{ a: 1 }],
		});
	});

	it.only(`Should work if sort and filter is not present, but next is`, () => {
		expect(generatePaginationQuery({ next: { id: 1 } }, 'access_id')).toMatchObject({
			sort: [['access_id', 1]],
			filter: [
				{
					access_id: {
						$gt: 1,
					},
				},
			],
		});
	});

	it.only(`Should work if sort (nullable key) is present, but next is not`, () => {
		expect(generatePaginationQuery({ sort: [['a', -1]] }, 'access_id', { a: 'b' })).toMatchObject({
			sort: [
				['a', -1],
				['b', -1],
				['access_id', -1],
			],
			filter: [],
		});
	});

	it.only(`Should work if sort is present, but next is not`, () => {
		expect(generatePaginationQuery({ sort: [['a', -1]] }, 'access_id')).toMatchObject({
			sort: [
				['a', -1],
				['access_id', -1],
			],
			filter: [],
		});
	});

	it.only(`Should work if sort (nullable key) and next is present and next.sort(nullable key) is not null`, () => {
		expect(
			generatePaginationQuery({ sort: [['a', -1]], next: { id: 1, a: 2 } }, 'access_id', { a: 'b' })
		).toMatchObject({
			sort: [
				['a', -1],
				['b', -1],
				['access_id', -1],
			],
			filter: [
				{
					$or: [
						{
							a: {
								$lt: 2,
							},
						},
						{
							a: {
								$eq: 2,
							},
							access_id: {
								$lt: 1,
							},
						},
						{
							a: {
								$is: null,
							},
						},
					],
				},
			],
		});
	});

	it.only(`Should work if sort (nullable key) and next is present and next.sort(nullable key) is null`, () => {
		expect(
			generatePaginationQuery({ sort: [['a', -1]], next: { id: 3, a: null, b: 2 } }, 'access_id', {
				a: 'b',
			})
		).toMatchObject({
			sort: [
				['b', -1],
				['access_id', -1],
			],
			filter: [
				{
					a: {
						$is: null,
					},
				},
				{
					$or: [
						{
							b: {
								$lt: 2,
							},
						},
						{
							b: {
								$eq: 2,
							},
							access_id: {
								$lt: 3,
							},
						},
					],
				},
			],
		});
	});

	it.only(`Should work if sort and next is present`, () => {
		expect(
			generatePaginationQuery({ sort: [['a', -1]], next: { id: 1, a: 2 } }, 'access_id')
		).toMatchObject({
			sort: [
				['a', -1],
				['access_id', -1],
			],
			filter: [
				{
					$or: [
						{
							a: {
								$lt: 2,
							},
						},
						{
							a: {
								$eq: 2,
							},
							access_id: {
								$lt: 1,
							},
						},
					],
				},
			],
		});
	});

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
