import { AdminJwtPayload, PoliceJwtPayload } from '@bupd/types';

// Augmenting express type definitions to contain parsed jwt_payload in req object
declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}

export type SqlFilter = Record<string, any | [string, any]>;
export interface SqlClause {
	filter?: SqlFilter;
	sort?: [string, -1 | 1];
	limit?: number;
	select?: string[];
}
