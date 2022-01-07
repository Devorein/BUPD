import { PoolConnection } from 'mysql2/promise';
import { query } from '../../utils';
import Logger from '../../utils/logger';

export async function useQuery(sqlQuery: string, connection?: PoolConnection) {
	if (!connection) {
		Logger.info(sqlQuery);
		return query(sqlQuery);
	} else {
		return connection.query(sqlQuery);
	}
}
