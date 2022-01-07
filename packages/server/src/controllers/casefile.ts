import {
	ApiResponse,
	CreateCasefilePayload,
	CreateCasefileResponse,
	DeleteCasefileResponse,
	GetCasefileResponse,
	GetCasefilesPayload,
	GetCasefilesResponse,
	ICasefileIntermediate,
	ICasefilePopulated,
	ICriminal,
	IPolice,
	IVictim,
	PoliceJwtPayload,
	TAccessPermission,
	UpdateCasefileResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql2';
import {
	AccessModel,
	CasefileModel,
	CrimeCategoryModel,
	CriminalModel,
	VictimModel,
} from '../models';
import CasefileCriminalModel from '../models/CasefileCriminal';
import CrimeWeaponModel from '../models/CrimeWeapon';
import { paginate } from '../models/utils/paginate';
import { SqlSelect } from '../types';
import { handleError, logger, pool, query } from '../utils';
import { convertCaseFilter } from '../utils/convertClientQuery';
import { getCasefileAttributes, getPoliceAttributes } from '../utils/generateAttributes';
import { generatePermissionRecord } from '../utils/generatePermissionRecord';
import { inflateObject } from '../utils/inflateObject';
import Logger from '../utils/logger';

const CasefileController = {
	async create(
		req: Request<any, any, CreateCasefilePayload>,
		res: Response<ApiResponse<CreateCasefileResponse>>
	) {
		try {
			const payload = req.body;
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const connection = await pool.getConnection();
			// Extracting the criminal ids passed
			const existingCriminalIds: number[] = [];
			// We need to filter the criminals so that we only add the new criminals
			const newCriminalPayloads: Omit<ICriminal, 'criminal_id'>[] = [];
			const allCriminalIds: number[] = [];
			const victims: IVictim[] = [],
				categories: string[] = [],
				weapons: string[] = [];
			payload.criminals.forEach((criminal) => {
				if ('id' in criminal) {
					existingCriminalIds.push(criminal.id);
					allCriminalIds.push(criminal.id);
				} else {
					newCriminalPayloads.push({ name: criminal.name, photo: criminal.photo ?? null });
				}
			});

			await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
			await connection.beginTransaction();
			// Get the maximum case number from db
			const maxCaseNoQueryData = (await connection.query(`
        SELECT
          MAX(case_no) + 1 as max_case_no
        from
          Casefile;
      `)) as RowDataPacket[];

			const maxCaseNo = maxCaseNoQueryData[0][0].max_case_no ?? 1;

			const maxCriminalIdQueryData = (await connection.query(`
        SELECT
          MAX(criminal_id) as max_criminal_id
        from
          Criminal;
      `)) as RowDataPacket[];

			const maxCriminalId = maxCriminalIdQueryData[0][0].max_criminal_id ?? 0;

			const casefile = await CasefileModel.create(
				{
					...payload,
					case_no: maxCaseNo,
					police_nid: jwtPayload.nid,
				},
				connection
			);

			for (let index = 0; index < payload.weapons.length; index += 1) {
				await CrimeWeaponModel.create(
					{
						case_no: maxCaseNo,
						weapon: payload.weapons[index],
					},
					connection
				);
				weapons.push(payload.weapons[index]);
			}

			for (let index = 0; index < payload.categories.length; index += 1) {
				await CrimeCategoryModel.create(
					{
						case_no: maxCaseNo,
						category: payload.categories[index],
					},
					connection
				);
				categories.push(payload.categories[index]);
			}

			for (let index = 0; index < payload.victims.length; index += 1) {
				const victim = await VictimModel.create(
					{
						...payload.victims[index],
						case_no: maxCaseNo,
					},
					connection
				);
				victims.push(victim);
			}

			for (let index = 0; index < newCriminalPayloads.length; index += 1) {
				const newCriminal = newCriminalPayloads[index];
				allCriminalIds.push(maxCriminalId + index + 1);
				await CriminalModel.create(
					{
						...newCriminal,
						criminal_id: maxCriminalId + index + 1,
					},
					connection
				);
			}

			for (let index = 0; index < allCriminalIds.length; index += 1) {
				const criminalId = allCriminalIds[index];
				await CasefileCriminalModel.create(
					{
						case_no: maxCaseNo,
						criminal_id: criminalId,
					},
					connection
				);
			}

			// The reporting officer should have read, update and delete access to the casefile
			const accessData = {
				admin_id: null,
				approved: 1,
				case_no: maxCaseNo,
				criminal_id: null,
				police_nid: jwtPayload.nid,
				type: 'case',
			} as const;

			await AccessModel.create(
				{
					...accessData,
					permission: 'read',
				},
				connection
			);

			await AccessModel.create(
				{
					...accessData,
					permission: 'update',
				},
				connection
			);

			await AccessModel.create(
				{
					...accessData,
					permission: 'delete',
				},
				connection
			);

			const joinedData = (await connection.query(`
        SELECT
          CR.name,
          CR.photo,
          CR.criminal_id
        from
          Casefile as CF
          left join Casefile_Criminal as CFC on CFC.case_no = ${maxCaseNo}
          left join Criminal as CR on CR.criminal_id = CFC.criminal_id
        where
          CF.case_no = ${maxCaseNo};
      `)) as [RowDataPacket[], FieldPacket[]];
			await connection.commit();
			connection.release();
			res.json({
				status: 'success',
				data: {
					...casefile,
					categories,
					victims,
					weapons,
					criminals: allCriminalIds.length !== 0 ? (joinedData[0] as ICriminal[]) : [],
				},
			});
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't create case file. Please try again.");
		}
	},

	async delete(req: Request<{ case_no: number }>, res: Response<DeleteCasefileResponse>) {
		try {
			const file = await CasefileModel.findByCaseNo(req.params.case_no);
			if (file) {
				const result = await CasefileModel.delete(req.params.case_no);
				if (result) {
					res.json({
						status: 'success',
						data: file,
					});
				}
			} else {
				handleError(res, 404, 'No valid case files found to delete');
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},

	async update(
		req: Request<{ case_no: number }>,
		res: Response<ApiResponse<UpdateCasefileResponse>>
	) {
		try {
			const payload = req.body;
			const casefile = await CasefileModel.update([{ case_no: req.params.case_no }], {
				...payload,
				case_no: req.params.case_no,
			});

			if (!casefile) {
				handleError(res, 404, "Casefile doesn't exist");
			} else {
				res.json({
					status: 'success',
					data: casefile,
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update casefile");
		}
	},
	async get(req: Request<{ case_no: number }>, res: Response<GetCasefileResponse>) {
		try {
			const casefile = await CasefileModel.findByCaseNo(req.params.case_no);
			if (casefile) {
				// Get the criminals associated with the case
				const [criminals] = (await query(
					`SELECT Criminal.criminal_id as \`Criminal.criminal_id\`,Criminal.name as \`Criminal.name\`,Criminal.photo as \`Criminal.photo\` FROM Casefile as Casefile LEFT JOIN Casefile_Criminal as Casefile_Criminal on Casefile.case_no = Casefile_Criminal.case_no LEFT JOIN Criminal as Criminal on Casefile_Criminal.criminal_id = Criminal.criminal_id WHERE (Casefile.\`case_no\`=${req.params.case_no});`
				)) as RowDataPacket[];
				casefile.criminals = (criminals as ICriminal[]).map((criminal) => {
					const inflatedObject = inflateObject<ICriminal>(criminal, 'Criminal');
					return inflatedObject;
				});

				// Get all the approved access request of this case
				const [polices] = (await query(
					`select ${getPoliceAttributes('Police', ['password']).join(
						','
					)}, Access.permission from Access as Access left join Police as Police on Police.nid = Access.police_nid where approved = 1 AND case_no = ${
						req.params.case_no
					};`
				)) as RowDataPacket[];

				// Get victims of the case
				const [victims] = (await query(
					`select name, address, age, phone_no, description, case_no from victim where case_no = ${req.params.case_no};`
				)) as RowDataPacket[];
				casefile.victims = victims as IVictim[];

				res.json({
					status: 'success',
					data: {
						...casefile,
						polices: polices as (IPolice & { permission: TAccessPermission })[],
					},
				});
			} else {
				handleError(res, 404, `Casefile doesn't exist`);
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async findMany(
		req: Request<any, any, any, GetCasefilesPayload>,
		res: Response<GetCasefilesResponse>
	) {
		const select: SqlSelect = [];
		if (req.jwt_payload!.type === 'police') {
			select.push({
				raw: `(SELECT GROUP_CONCAT(CONCAT(permission, " ", approved)) from Access where Access.case_no = Casefile.\`case_no\` AND police_nid = ${
					(req.jwt_payload as PoliceJwtPayload).nid
				}) as permissions`,
			});
		}

		select.push(
			...getCasefileAttributes('Casefile'),
			{
				aggregation: ['DISTINCT', 'GROUP_CONCAT'],
				attribute: 'weapon',
				namespace: 'Crime_Weapon',
			},
			{
				aggregation: ['DISTINCT', 'GROUP_CONCAT'],
				attribute: 'category',
				namespace: 'Crime_Category',
			}
		);
		try {
			res.json({
				status: 'success',
				data: await paginate<ICasefilePopulated, ICasefileIntermediate>(
					{
						filter: convertCaseFilter(req.query.filter),
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						next: req.query.next,
						select,
						joins: [
							['Casefile', 'Crime_Weapon', 'case_no', 'case_no', 'LEFT'],
							['Casefile', 'Crime_Category', 'case_no', 'case_no', 'LEFT'],
						],
						groups: ['Casefile.case_no'],
					},
					'Casefile',
					'case_no',
					(rows) =>
						rows.map((row) => {
							const { permissions } = row;
							const inflatedObject = inflateObject<ICasefileIntermediate>(row, 'Casefile');
							return {
								case_no: inflatedObject.case_no,
								location: inflatedObject.location,
								priority: inflatedObject.priority,
								status: inflatedObject.status,
								police_nid: inflatedObject.police_nid,
								time: inflatedObject.time,
								categories: inflatedObject.crime_category.category?.split(',') ?? [],
								criminals: [],
								victims: [],
								weapons: inflatedObject.crime_weapon.weapon?.split(',') ?? [],
								permissions: permissions ? generatePermissionRecord(permissions) : undefined,
							} as ICasefilePopulated;
						})
				),
			});
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
};

export default CasefileController;
