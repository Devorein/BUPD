/// <reference types="@types/jest"/>

import { AccessPayload } from '../src/access';

describe('.AccessPayload.get', () => {
	it(`Should throw error when next has unknown fields`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('next', {
				unknown_field: 1,
			})
		).toThrow();
	});

	it(`Should throw error when next.id is not number`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('next', {
				id: 'false',
			})
		).toThrow();
	});

	it(`Should not throw error when next is null`, () => {
		expect(() => AccessPayload.get.validateSyncAt('next', null)).not.toThrow();
	});

	it(`Should throw error when filter approved is negative`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.approved', {
				filter: {
					approved: [-1],
				},
			})
		).toThrow();
	});

	it(`Should throw error when filter approved is greater than 1`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.approved', {
				filter: {
					approved: [2],
				},
			})
		).toThrow();
	});

	it(`Should not throw error when filter approved is correct`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.approved', {
				filter: {
					approved: [0, 1],
				},
			})
		).not.toThrow();
	});

	it(`Should throw error when permission is not one of read, write, update or delete`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.permission', {
				filter: {
					permission: ['deleted'],
				},
			})
		).toThrow();
	});

	it(`Should throw error when type is not one of case or criminal`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.type', {
				filter: {
					type: ['police'],
				},
			})
		).toThrow();
	});

	it(`Should not throw error when type is one of case or criminal`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('filter.type', {
				filter: {
					type: ['case', 'criminal'],
				},
			})
		).not.toThrow();
	});

	it(`Should throw error when sort item value is greater than 2`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['criminal_id', 'case_no', 'approved', 'permission'],
			})
		).toThrow();
	});

	it(`Should not throw error when sort is null`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('sort', {
				sort: null,
			})
		).not.toThrow();
	});

	it(`Should not throw error when sort is undefined`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('sort', {
				sort: undefined,
			})
		).not.toThrow();
	});

	it(`Should catch error when first item is not a sortable property`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['approve', 'permission'],
			})
		).toThrow();
	});

	it(`Should catch error when the second item is not 1 or -1`, () => {
		expect(() =>
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['approved', 0],
			})
		).toThrow();
	});

	it(`Should not throw error when the payload is valid`, () => {
		expect(() =>
			AccessPayload.get.validateSync({
				filter: {
					approved: [1],
					permission: ['read', 'update'],
					type: ['case', 'criminal'],
				},
				limit: 2,
				sort: ['criminal_id', -1],
			})
		).not.toThrow();
	});
});

describe('.AccessPayload.create', () => {
	it(`Should throw error when the given case no is not null or number`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('case_no', {
				case_no: 'NaN',
			})
		).toThrow();
	});

	it(`Should not throw error when the given case no is valid`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('case_no', {
				case_no: 2,
			})
		).not.toThrow();
	});

	it(`Should throw error when the given criminal no is invalid`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('criminal_id', {
				criminal_id: false,
			})
		).toThrow();
	});

	it(`Should not throw error when the given case no is valid`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('criminal_id', {
				criminal_id: 2,
			})
		).not.toThrow();
	});

	it(`Should throw error when permission is not provided`, () => {
		expect(() => AccessPayload.create.validateSyncAt('permission', {})).toThrow();
	});

	it(`Should throw error when permission is not an array`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('permission', {
				permission: false,
			})
		).toThrow();
	});

	it(`Should throw error when permission doesn't have correct items`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('permission', {
				permission: 'updated',
			})
		).toThrow();
	});

	it(`Should not throw error when permission have correct items`, () => {
		expect(() =>
			AccessPayload.create.validateSyncAt('permission', {
				permission: 'update',
			})
		).not.toThrow();
	});

	it(`Should throw error if both case_no and criminal_id is null`, () => {
		expect(() =>
			AccessPayload.create.validateSync({
				permission: 'update',
				criminal_id: null,
				case_no: null,
			})
		).toThrow();
	});

	it(`Should not throw error when the payload is valid`, () => {
		expect(() =>
			AccessPayload.create.validateSync({
				permission: 'update',
				criminal_id: 1,
				case_no: null,
			})
		).not.toThrow();
	});
});

describe('.AccessPayload.update', () => {
	it(`Should throw error when approve is not 0 or 1`, () => {
		expect(() =>
			AccessPayload.update.validateSyncAt('approve', {
				approve: 2,
			})
		).toThrow();
	});

	it(`Should not throw error when approve is either 0 or 1`, () => {
		expect(() =>
			AccessPayload.update.validateSyncAt('approve', {
				approve: 1,
			})
		).toThrow();
	});
});
