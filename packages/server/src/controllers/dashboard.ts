import {
	GetDashboardResponse,
	IAccess,
	IDashboard,
	TAccessPermission,
	TAccessType,
	TCasefilePriority,
	TCasefileStatus,
} from '@bupd/types';
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

			const accessTypesCount: { type: TAccessType; total: number }[] = await find(
				generateAggregateGroupByQuery('type'),
				'Access'
			);

			const accessPermissionsCount: { permission: TAccessPermission; total: number }[] = await find(
				generateAggregateGroupByQuery('permission'),
				'Access'
			);

			const accessApprovalsCount: { approved: IAccess['approved']; total: number }[] = await find(
				generateAggregateGroupByQuery('approved'),
				'Access'
			);

			const accessApprovalsRecord: IDashboard['accesses']['approval'] = {
				0: 0,
				1: 0,
				2: 0,
			};

			accessApprovalsCount.forEach((accessApprovalCount) => {
				accessApprovalsRecord[accessApprovalCount.approved] = accessApprovalCount.total;
			});

			const accessTypesRecord: IDashboard['accesses']['type'] = {
				case: 0,
				criminal: 0,
			};

			accessTypesCount.forEach((accessTypeCount) => {
				accessTypesRecord[accessTypeCount.type] = accessTypeCount.total;
			});

			const accessPermissionsRecord: IDashboard['accesses']['permission'] = {
				delete: 0,
				read: 0,
				update: 0,
				write: 0,
			};

			accessPermissionsCount.forEach((accessPermissionCount) => {
				accessPermissionsRecord[accessPermissionCount.permission] = accessPermissionCount.total;
			});

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

			const crimeCategoriesRecord: IDashboard['crimes']['category'] = {};
			crimeCategoriesCount.forEach((crimeCategoryCount) => {
				crimeCategoriesRecord[crimeCategoryCount.category] = crimeCategoryCount.total;
			});

			const crimeWeaponsRecord: IDashboard['crimes']['weapon'] = {};
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
						category: crimeCategoriesRecord,
						weapon: crimeWeaponsRecord,
					},
					criminals: totalCriminals[0].total,
					victims: totalVictims[0].total,
					accesses: {
						permission: accessPermissionsRecord,
						type: accessTypesRecord,
						approval: accessApprovalsRecord,
					},
				},
			});
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't generate dashboard");
		}
	},
};
