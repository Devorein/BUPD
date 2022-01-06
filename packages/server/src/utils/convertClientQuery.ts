import {
	GetAccessesPayload,
	GetCasefilesPayload,
	GetCriminalsPayload,
	GetPolicesPayload,
	GetVictimsPayload,
} from '@bupd/types';
import { SqlFilter } from '../types';

export function convertAccessFilter(clientFilter: GetAccessesPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.search) {
		filter.push({
			access_id: {
				$in: clientFilter.search,
			},
		});
	}

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

	if (clientFilter?.search) {
		filter.push({
			nid: {
				$in: clientFilter.search,
			},
		});
	}

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

	if (clientFilter?.search) {
		filter.push({
			case_no: {
				$in: clientFilter.search,
			},
		});
	}

	if (clientFilter?.time) {
		if (clientFilter.time?.[0]) {
			filter.push({
				time: {
					$gte: clientFilter.time[0],
				},
			});
		}

		if (clientFilter.time?.[1]) {
			filter.push({
				time: {
					$lte: clientFilter.time[1],
				},
			});
		}
	}

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

export function convertVictimFilter(clientFilter: GetVictimsPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.search) {
		filter.push({
			case_no: {
				$in: clientFilter.search,
			},
		});
	}
	if (clientFilter?.age) {
		const [min, max] = clientFilter.age;
		if (min) {
			filter.push({
				age: {
					$gte: min,
				},
			});
		}

		if (max) {
			filter.push({
				age: {
					$lte: max,
				},
			});
		}
	}

	return filter;
}

export function convertCriminalFilter(clientFilter: GetCriminalsPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter?.search) {
		filter.push({
			criminal_id: {
				$in: clientFilter.search,
			},
		});
	}
	return filter;
}
