/* eslint-disable camelcase */

import { ICriminal, UpdateCriminalPayload } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import { SqlClause, SqlFilter } from '../types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const CriminalModel = sequelize.define("Criminal", {
  criminal_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  photo: DataTypes.STRING,
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
})

export {
  CriminalModel
};

const Criminal = {
	find(sqlClause: SqlClause) {
		return find<ICriminal>(sqlClause, 'Criminal');
	},

	async create(criminalData: ICriminal, connection?: PoolConnection) {
		const criminal: ICriminal = {
			criminal_id: criminalData.criminal_id,
			name: criminalData.name,
			photo: criminalData.photo ?? null,
		};

		await useQuery(generateInsertQuery(criminal, 'Criminal'), connection);
		return criminal;
	},

	findByCriminalID(criminal_id: number) {
		return find<ICriminal>(
			{
				filter: [{ criminal_id }],
			},
			'Criminal'
		);
	},

	async update(filterQuery: SqlFilter, payload: UpdateCriminalPayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Criminal'));
			// return the payload if the update operation was successful
			return payload as Partial<ICriminal>;
		} else {
			return null;
		}
	},

	async delete(criminalId: number) {
		await query(generateDeleteQuery([{ criminal_id: criminalId }], 'Criminal'));
		return true;
	},
};

export default Criminal;
