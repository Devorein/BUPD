/// <reference types="@types/jest"/>

import { AccessPayload } from '../../src/controllers';

describe('.AccessPayload.get', () => {
	it(`Should work when filter approved is negative`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.approved', {
				filter: {
					approved: -1,
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when filter approved is greater than 1`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.approved', {
				filter: {
					approved: 2,
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when permission is not in the given array`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.permission', {
				filter: {
					Permission: 'something',
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when permission is in the given array`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.permission', {
				filter: {
					Permission: 'read',
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when type is not in the given array`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.type', {
				filter: {
					type: 'something',
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when type is in the given array`, () => {
		try {
			AccessPayload.get.validateSyncAt('filter.type', {
				filter: {
					type: 'case',
				},
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});

	it(`Should catch error when sort item value is greater than 2`, () => {
		try {
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['criminal_id', 'case_no', 'approved', 'permission'],
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should catch error when first item is not sortable`, () => {
		try {
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['approve', 'permission'],
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should catch error when the second item is not 1 or -1`, () => {
		try {
			AccessPayload.get.validateSyncAt('sort', {
				sort: ['approved', 0],
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the payload is valid`, () => {
		try {
			AccessPayload.get.validateSync({
				fiter: {
					approved: 1,
					permission: 'read',
					type: 'case',
				},
				limit: 2,
				sort: ['criminal_id', -1],
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
});
describe('.AccessPayload.create', () => {
	it(`Should work when the given case no is invalid`, () => {
		try {
			AccessPayload.create.validateSyncAt('case_no', {
				case_no: 'NaN',
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the given case no is valid`, () => {
		try {
			AccessPayload.create.validateSyncAt('case_no', {
				case_no: 2,
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the given criminal id is invalid`, () => {
		try {
			AccessPayload.create.validateSyncAt('criminal_id', {
				criminal_id: 'NaN',
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the given criminal id is valid`, () => {
		try {
			AccessPayload.create.validateSyncAt('criminal_id', {
				criminal_id: 2,
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the given permission exists`, () => {
		try {
			AccessPayload.create.validateSyncAt('permission', {
				permission: 'delete',
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the given permission does not exist`, () => {
		try {
			AccessPayload.create.validateSyncAt('permission', {
				permission: 'NaN',
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
	it(`Should work when the payload is valid`, () => {
		try {
			AccessPayload.get.validateSync({
				case_no: 1,
				criminal_id: 22,
				permission: 'read',
			});
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
});
