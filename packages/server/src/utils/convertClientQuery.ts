import { GetAccessesPayload } from '@bupd/types';
import { SqlFilter } from '../types';

export function convertClientQuery(clientFilter: GetAccessesPayload['filter']) {
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
