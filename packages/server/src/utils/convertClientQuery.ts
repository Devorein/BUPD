import { GetAccessesPayload } from '@bupd/types';
import { SqlFilter } from '../types';

export function convertClientQuery(clientFilter: GetAccessesPayload['filter']) {
	const filter: SqlFilter = [];
	if (clientFilter.access_type) {
		filter.push({
			access_type: {
				$in: clientFilter.access_type,
			},
		});
	}

	if (clientFilter.approved) {
		filter.push({
			approved: {
				$in: clientFilter.approved,
			},
		});
	}

	if (clientFilter.permission) {
		filter.push({
			permission: {
				$in: clientFilter.permission,
			},
		});
	}

	return filter;
}
