import { PoolConnection } from 'mysql2/promise';
import { query } from '../../utils';

export async function useQuery(sqlQuery: string, connection?: PoolConnection) {
	if (!connection) {
		return query(sqlQuery);
	} else {
		return connection.query(sqlQuery);
	}
}
