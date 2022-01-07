import { AdminJwtPayload, PoliceJwtPayload } from '@bupd/types';

// Augmenting express type definitions to contain parsed jwt_payload in req object
declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}

export type PrimitiveValues = string | number | boolean | null;

export type SqlFilterInOperator = {
	$in: PrimitiveValues[];
};

export type SqlFilterEqOperator = {
	$eq: PrimitiveValues;
};

export type SqlFilterIsOperator = {
	$is: PrimitiveValues;
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
	| SqlFilterLteOperator
	| SqlFilterIsOperator;
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

export type SqlSort = Array<[string, -1 | 1]>;

// Left table, right table, Left table join attribute, right table join attribute, join type
export type SqlJoins = [string, string, string, string, ('LEFT' | 'RIGHT' | 'INNER')?][];
export type SqlAggregationSelect = {
	aggregation: ('COUNT' | 'GROUP_CONCAT' | 'MIN' | 'MAX' | 'SUM' | 'DISTINCT')[];
	attribute: string;
	namespace?: string;
	alias?: string;
};

export type SqlRawSelect = {
	raw: string;
};

export type SqlSelect = (string | SqlAggregationSelect | SqlRawSelect)[];

export interface SqlClause {
	filter?: SqlFilter;
	sort?: SqlSort;
	limit?: number;
	select?: SqlSelect;
	joins?: SqlJoins;
	groups?: string[];
}
