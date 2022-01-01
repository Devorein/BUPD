import { AdminJwtPayload, PoliceJwtPayload } from '@bupd/types';

// Augmenting express type definitions to contain parsed jwt_payload in req object
declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}

type PrimitiveValues = string | number | boolean;

export type SqlFilterOperators =
	| {
			$in: PrimitiveValues[];
	  }
	| {
			$eq: PrimitiveValues;
	  }
	| {
			$neq: PrimitiveValues;
	  }
	| {
			$gte: PrimitiveValues;
	  }
	| {
			$gt: PrimitiveValues;
	  }
	| {
			$lt: PrimitiveValues;
	  }
	| {
			$lte: PrimitiveValues;
	  };

export type SqlFilter = (
	| Record<string, PrimitiveValues | SqlFilterOperators>
	| { $or: SqlFilter }
	| { $and: SqlFilter }
)[];

export interface SqlClause {
	filter?: SqlFilter;
	sort?: [string, -1 | 1];
	limit?: number;
	select?: string[];
}
