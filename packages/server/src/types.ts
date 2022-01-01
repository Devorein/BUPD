import { AdminJwtPayload, PoliceJwtPayload } from '@bupd/types';

// Augmenting express type definitions to contain parsed jwt_payload in req object
declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}

export type PrimitiveValues = string | number | boolean;

export type SqlFilterInOperator = {
	$in: PrimitiveValues[];
};

export type SqlFilterEqOperator = {
	$eq: PrimitiveValues;
};

export type SqlFilterNeqOperator = {
	$neq: PrimitiveValues;
};

export type SqlFilterGteOperator = {
	$gte: PrimitiveValues;
};

export type SqlFilterGtOperator = {
	$gt: PrimitiveValues;
};

export type SqlFilterLtOperator = {
	$lt: PrimitiveValues;
};

export type SqlFilterLteOperator = {
	$lte: PrimitiveValues;
};

export type SqlFilterOperators =
	| SqlFilterInOperator
	| SqlFilterEqOperator
	| SqlFilterNeqOperator
	| SqlFilterGteOperator
	| SqlFilterGtOperator
	| SqlFilterLtOperator
	| SqlFilterLteOperator;
export interface SqlFilterOr {
	// eslint-disable-next-line
	$or: SqlFilter;
}

export interface SqlFilterAnd {
	// eslint-disable-next-line
	$and: SqlFilter;
}

export type SqlFilter = (
	| Record<string, PrimitiveValues | SqlFilterOperators>
	| SqlFilterOr
	| SqlFilterAnd
)[];

export interface SqlClause {
	filter?: SqlFilter;
	sort?: [string, -1 | 1];
	limit?: number;
	select?: string[];
}
