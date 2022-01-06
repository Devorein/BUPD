import mysql from 'mysql2';
import {
	PrimitiveValues,
	SqlClause,
	SqlFilter,
	SqlFilterAnd,
	SqlFilterEqOperator,
	SqlFilterGteOperator,
	SqlFilterGtOperator,
	SqlFilterInOperator,
	SqlFilterIsOperator,
	SqlFilterLteOperator,
	SqlFilterLtOperator,
	SqlFilterNeqOperator,
	SqlFilterOperators,
	SqlFilterOr,
	SqlJoins,
	SqlSelect,
} from '../types';

/**
 * Generates a sql statement with fields and escaped values extracted from the given object
 * @param payload The record to generate field, value pairs from
 * @param table The table to insert data to
 * @returns A sql statement
 */
export function generateInsertQuery<Payload extends Record<string, any>>(
	payload: Payload,
	table: string
) {
	// Storing all the fields and their corresponding values in array
	// So that we can join them later
	const entries = Object.entries(payload);
	const fields: string[] = [],
		values: (string | number)[] = [];
	entries.forEach(([field, value]) => {
		fields.push(`\`${field}\``);
		// Escaping all values to prevent SQL injection
		values.push(mysql.escape(value));
	});

	return `INSERT INTO ${table}(${fields.join(',')}) VALUES(${values.join(',')});`;
}

export function generateScalarClauses(
	andFilters: Record<string, PrimitiveValues | SqlFilterOperators>,
	namespace?: string
) {
	const innerWhereClauses: string[] = [];
	Object.entries(andFilters).forEach(([key, value]) => {
		if (value !== undefined) {
			const formattedKey = `${namespace ? `${namespace}.` : ''}\`${key}\``;
			if (Object.prototype.hasOwnProperty.call(value, '$lt')) {
				innerWhereClauses.push(
					`${formattedKey}<${mysql.escape((value as SqlFilterLtOperator).$lt)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$in')) {
				innerWhereClauses.push(
					`${formattedKey} IN(${(value as SqlFilterInOperator).$in
						.map((operand) => mysql.escape(operand))
						.join(',')})`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$lte')) {
				innerWhereClauses.push(
					`${formattedKey}<=${mysql.escape((value as SqlFilterLteOperator).$lte)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$is')) {
				innerWhereClauses.push(
					`${formattedKey} IS ${mysql.escape((value as SqlFilterIsOperator).$is)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$gte')) {
				innerWhereClauses.push(
					`${formattedKey}>=${mysql.escape((value as SqlFilterGteOperator).$gte)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$gt')) {
				innerWhereClauses.push(
					`${formattedKey}>${mysql.escape((value as SqlFilterGtOperator).$gt)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$eq')) {
				innerWhereClauses.push(
					`${formattedKey}=${mysql.escape((value as SqlFilterEqOperator).$eq)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$neq')) {
				innerWhereClauses.push(
					`${formattedKey}!=${mysql.escape((value as SqlFilterNeqOperator).$neq)}`
				);
			} else {
				innerWhereClauses.push(`${formattedKey}=${mysql.escape(value)}`);
			}
		}
	});

	return innerWhereClauses.length !== 0 ? `(${innerWhereClauses.join(' AND ')})` : '';
}

export function generateLogicalOperationClauses(
	andFilters: SqlFilter,
	logicalOperator: 'OR' | 'AND',
	depth: number,
	namespace?: string
) {
	const clauses: string[] = [];
	andFilters.forEach((andFilter) => {
		if ((andFilter as SqlFilterOr).$or) {
			const orClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterOr).$or,
				'OR',
				depth + 1,
				namespace
			);
			if (orClauses) {
				clauses.push(orClauses);
			}
		} else if ((andFilter as SqlFilterAnd).$and) {
			const andClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterAnd).$and,
				'AND',
				depth + 1,
				namespace
			);
			if (andClauses) {
				clauses.push(andClauses);
			}
		} else {
			const scalarClauses = generateScalarClauses(
				andFilter as Record<string, PrimitiveValues | SqlFilterOperators>,
				namespace
			);
			if (scalarClauses) {
				clauses.push(scalarClauses);
			}
		}
	});

	const clause = clauses.join(` ${logicalOperator} `);

	if (clauses.length !== 0) {
		if (clauses.length !== 1) {
			return `(${clause})`;
		}
		return clause;
	}
	return '';
}

export function generateWhereClause(sqlFilters: SqlFilter, namespace?: string) {
	const whereClauses = generateLogicalOperationClauses(sqlFilters, 'AND', 0, namespace);
	return whereClauses.length !== 0 ? `WHERE ${whereClauses}` : '';
}

export function generateOrderbyClause(sorts: SqlClause['sort'], namespace?: string) {
	const sortClauses: string[] = [];
	sorts?.forEach(([sortKey, sortOrder]) => {
		sortClauses.push(
			`${namespace ? `${namespace}.` : ''}\`${sortKey}\` ${sortOrder === -1 ? 'DESC' : 'ASC'}`
		);
	});
	return sortClauses.length !== 0 ? `ORDER BY ${sortClauses.join(', ')}` : '';
}

export function generateLimitClause(limit: number) {
	return `LIMIT ${limit}`;
}

export function generateSetClause(payload: Record<string, any>) {
	return `SET ${Object.entries(payload)
		.map(([field, value]) => `\`${field}\`=${mysql.escape(value)}`)
		.join(',')}`;
}

export function generateJoinClause(joins: SqlJoins) {
	const tablesSet: Set<string> = new Set();

	return joins.length !== 0
		? joins
				.map(([leftTable, rightTable, leftTableAttribute, rightTableAttribute, joinType]) => {
					const joinClauseChunks: string[] = [];
					if (!tablesSet.has(leftTable)) {
						joinClauseChunks.push(`${leftTable} as ${leftTable}`);
					}

					joinClauseChunks.push(joinType ? `${joinType} JOIN` : 'INNER JOIN');
					joinClauseChunks.push(rightTable);
					if (!tablesSet.has(rightTable)) {
						joinClauseChunks.push(`as ${rightTable}`);
					}

					joinClauseChunks.push(
						`on ${leftTable}.${leftTableAttribute} = ${rightTable}.${rightTableAttribute}`
					);
					tablesSet.add(leftTable);
					tablesSet.add(rightTable);
					return joinClauseChunks.join(' ');
				})
				.join(' ')
		: '';
}

export function generateGroupClause(groups: string[]) {
	if (groups.length !== 0) {
		return `GROUP BY ${groups.map((group) => `\`${group}\``).join(',')}`;
	}
	return '';
}

export function generateSelectClause(selects: SqlSelect, hasJoins: boolean) {
	const attributes: string[] = [];

	selects.forEach((select) => {
		if (typeof select === 'string') {
			if (hasJoins) {
				attributes.push(`${select} as \`${select}\``);
			} else {
				attributes.push(`\`${select}\``);
			}
		} else {
			let expression = `\`${select.attribute}\``;
			if (hasJoins && select.namespace) {
				expression = `${select.namespace}.\`${select.attribute}\``;
			}
			for (let index = 0; index < select.aggregation.length; index += 1) {
				expression = `${select.aggregation[index]}(${expression})`;
			}
			if (select.alias) {
				attributes.push(`${expression} as \`${select.alias}\``);
			} else if (select.namespace) {
				attributes.push(`${expression} as \`${select.namespace}.${select.attribute}\``);
			} else {
				attributes.push(`${expression} as \`${select.attribute}\``);
			}
		}
	});

	return attributes.join(',');
}

export function generateSelectQuery(sqlClause: SqlClause, table: string) {
	const clauses: string[] = [];
	const hasJoins = Boolean(sqlClause.joins && sqlClause.joins.length !== 0);
	if (sqlClause.filter)
		clauses.push(generateWhereClause(sqlClause.filter, hasJoins ? table : undefined));
	if (sqlClause.groups) clauses.push(generateGroupClause(sqlClause.groups));

	if (sqlClause.sort)
		clauses.push(generateOrderbyClause(sqlClause.sort, hasJoins ? table : undefined));
	if (sqlClause.limit) clauses.push(generateLimitClause(sqlClause.limit));

	return `SELECT ${
		sqlClause.select ? generateSelectClause(sqlClause.select, hasJoins) : '*'
	} FROM ${hasJoins ? generateJoinClause(sqlClause.joins!) : table} ${clauses.join(' ')};`;
}

export function generateCountQuery(filterQuery: SqlFilter, table: string) {
	return `SELECT COUNT(*) as count FROM ${table} ${generateWhereClause(filterQuery)};`;
}

export function generateUpdateQuery(
	filterQuery: SqlFilter,
	payload: Record<string, any>,
	table: string
) {
	return `UPDATE ${table} ${generateSetClause(payload)} ${generateWhereClause(filterQuery)};`;
}

export function generateDeleteQuery(filterQuery: SqlFilter, table: string) {
	return `DELETE FROM ${table} ${generateWhereClause(filterQuery)};`;
}
