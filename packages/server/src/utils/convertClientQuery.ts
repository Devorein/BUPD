import { GetAccessesPayload, GetCasefilesPayload, GetPolicesPayload } from '@bupd/types';
import { SqlFilter } from '../types';

export function convertAccessFilter(clientFilter: GetAccessesPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.type && clientFilter.type.length !== 0) {
		filter.push({
			type: {
				$in: clientFilter.type,
			},
		});
	}

	if (clientFilter?.approved && clientFilter.approved.length !== 0) {
		filter.push({
			approved: {
				$in: clientFilter.approved,
			},
		});
	}

	if (clientFilter?.permission && clientFilter.permission.length !== 0) {
		filter.push({
			permission: {
				$in: clientFilter.permission,
			},
		});
	}

	return filter;
}

export function convertPoliceFilter(clientFilter: GetPolicesPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.designation && clientFilter.designation.length !== 0) {
		filter.push({
			designation: {
				$in: clientFilter.designation,
			},
		});
	}

	if (clientFilter?.rank && clientFilter.rank.length !== 0) {
		filter.push({
			rank: {
				$in: clientFilter.rank,
			},
		});
	}

	return filter;
}

export function convertCaseFilter(clientFilter: GetCasefilesPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.status && clientFilter.status.length !== 0) {
		filter.push({
			status: {
				$in: clientFilter.status,
			},
		});
	}

	if (clientFilter?.priority && clientFilter.priority.length !== 0) {
		filter.push({
			priority: {
				$in: clientFilter.priority,
			},
		});
	}
	return filter;
}
