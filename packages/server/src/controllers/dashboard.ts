import { GetDashboardResponse, IDashboard, TCasefilePriority, TCasefileStatus } from '@bupd/types';
import { Request, Response } from 'express';
import { find } from '../models/utils';
import { SqlClause } from '../types';
import { handleError, logger } from '../utils';

function generateAggregateGroupByQuery(attribute: string): Partial<SqlClause> {
	return {
		select: [
			attribute,
			{
				aggregation: ['COUNT'],
				attribute,
				alias: 'total',
			},
		],
		groups: [attribute],
	};
}

export const Dashboard = {
	async get(_: Request, res: Response<GetDashboardResponse>) {
		try {
			const policeRanksCount: { rank: string; total: number }[] = await find(
				generateAggregateGroupByQuery('rank'),
				'Police'
			);

			const casefilePrioritiesCount: { priority: TCasefilePriority; total: number }[] = await find(
				generateAggregateGroupByQuery('priority'),
				'Casefile'
			);

			const casefileStatusesCount: { status: TCasefileStatus; total: number }[] = await find(
				generateAggregateGroupByQuery('status'),
				'Casefile'
			);

			const crimeCategoriesCount: { category: string; total: number }[] = await find(
				generateAggregateGroupByQuery('category'),
				'Crime_Category'
			);

			const crimeWeaponsCount: { weapon: string; total: number }[] = await find(
				generateAggregateGroupByQuery('weapon'),
				'Crime_Weapon'
			);

			const policeRecord: IDashboard['polices'] = {};
			policeRanksCount.forEach((policeRankCount) => {
				policeRecord[policeRankCount.rank] = policeRankCount.total;
			});

			const casefilePriorityRecord: IDashboard['casefiles']['priority'] = {} as any;
			casefilePrioritiesCount.forEach((casefilePriorityCount) => {
				casefilePriorityRecord[casefilePriorityCount.priority] = casefilePriorityCount.total;
			});

			const casefileStatusRecord: IDashboard['casefiles']['status'] = {} as any;
			casefileStatusesCount.forEach((casefileStatusCount) => {
				casefileStatusRecord[casefileStatusCount.status] = casefileStatusCount.total;
			});

			const crimeCategoriesRecord: IDashboard['crimes']['categories'] = {};
			crimeCategoriesCount.forEach((crimeCategoryCount) => {
				crimeCategoriesRecord[crimeCategoryCount.category] = crimeCategoryCount.total;
			});

			const crimeWeaponsRecord: IDashboard['crimes']['weapons'] = {};
			crimeWeaponsCount.forEach((crimeWeaponCount) => {
				crimeWeaponsRecord[crimeWeaponCount.weapon] = crimeWeaponCount.total;
			});

			const totalCriminals: { total: number }[] = await find(
				{
					select: [
						{
							aggregation: ['COUNT'],
							attribute: 'criminal_id',
							alias: 'total',
						},
					],
				},
				'Criminal'
			);

			const totalVictims: { total: number }[] = await find(
				{
					select: [
						{
							aggregation: ['COUNT'],
							attribute: 'name',
							alias: 'total',
						},
					],
				},
				'Victim'
			);

			res.json({
				status: 'success',
				data: {
					polices: policeRecord,
					casefiles: {
						priority: casefilePriorityRecord,
						status: casefileStatusRecord,
					},
					crimes: {
						categories: crimeCategoriesRecord,
						weapons: crimeWeaponsRecord,
					},
					criminals: totalCriminals[0].total,
					victims: totalVictims[0].total,
				},
			});
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't generate dashboard");
		}
	},
};
