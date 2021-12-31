import { AdminJwtPayload, PoliceJwtPayload } from '@bupd/types';

// Augmenting express type definitions to contain parsed jwt_payload in req object
declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}

export interface SqlClause {
	filter?: Record<string, any>;
	sort?: [string, -1 | 1];
	limit?: number;
	select?: string[];
}
