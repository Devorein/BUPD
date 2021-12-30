import {
	ApiResponse,
	CreateCasefilePayload,
	CreateCasefileResponse,
	DeleteCasefilePayload,
	DeleteCasefileResponse,
	ICrimeCategory,
	ICrimeWeapon,
	ICriminal,
	IVictim,
	PoliceJwtPayload,
	UpdateCasefilePayload,
	UpdateCasefileResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { CasefileModel, CrimeCategoryModel, CriminalModel, VictimModel } from '../models';
import CasefileCriminalModel from '../models/CasefileCriminal';
import CrimeWeaponModel from '../models/CrimeWeapon';
import { handleError, logger, pool, removeFields } from '../utils';

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
				categories: ICrimeCategory[] = [],
				weapons: ICrimeWeapon[] = [];
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
          casefile;
      `)) as RowDataPacket[];

			const maxCaseNo = maxCaseNoQueryData[0][0].max_case_no ?? 1;

			const maxCriminalIdQueryData = (await connection.query(`
        SELECT
          MAX(criminal_id) as max_criminal_id
        from
          criminal;
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
				const weapon = await CrimeWeaponModel.create(
					{
						case_no: maxCaseNo,
						weapon: payload.weapons[index],
					},
					connection
				);
				weapons.push(weapon);
			}

			for (let index = 0; index < payload.categories.length; index += 1) {
				const category = await CrimeCategoryModel.create(
					{
						case_no: maxCaseNo,
						category: payload.categories[index],
					},
					connection
				);
				categories.push(category);
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

			const joinedData = (await connection.query(`
        SELECT
          CR.name,
          CR.photo,
          CR.criminal_id
        from
          casefile as CF
          left join casefile_criminal as CFC on CFC.case_no = ${maxCaseNo}
          left join criminal as CR on CR.criminal_id = CFC.criminal_id
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
					criminals: joinedData[0] as ICriminal[],
				},
			});
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't create case file. Please try again.",
			});
		}
	},
	async update(
		req: Request<any, any, UpdateCasefilePayload>,
		res: Response<ApiResponse<UpdateCasefileResponse>>
	) {
		try {
			const payload = req.body;
			const [casefile] = await CasefileModel.find({ filter: { case_no: payload.case_no } });
			if (!casefile) {
				res.json({
					status: 'error',
					message: "Casefile doesn't exist",
				});
			} else {
				await CasefileModel.update(
					{
						case_no: payload.case_no,
					},
					removeFields(payload, ['case_no'])
				);
				res.json({
					status: 'success',
					data: {
						...casefile,
						...payload,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't update the casefile",
			});
		}
	},
	async delete(
		req: Request<any, any, DeleteCasefilePayload>,
		res: Response<DeleteCasefileResponse>
	) {
		const file = await CasefileModel.findByCaseNo(req.body.case_no);
		if (file[0]) {
			const result = await CasefileModel.delete(req.body);
			if (result) {
				res.json({
					status: 'success',
					data: file[0],
				});
			}
		} else {
			res.json({
				status: 'error',
				message: 'No valid case files given to delete',
			});
		}
	},
	async deleteOnCaseNo(req: Request<any, any, undefined>, res: Response<DeleteCasefileResponse>) {
		const file = await CasefileModel.findByCaseNo(req.params.case_no);
		if (file[0]) {
			const result = await CasefileModel.delete({ case_no: req.params.case_no });
			if (result) {
				res.json({
					status: 'success',
					data: file[0],
				});
			}
		} else {
			handleError(res, 404, 'No valid case files found to delete');
		}
	},
	async updateOnCaseNo(
		req: Request<any, any, UpdateCasefilePayload>,
		res: Response<ApiResponse<UpdateCasefileResponse>>
	) {
		try {
			const payload = req.body;
			const [casefile] = await CasefileModel.find({ filter: { case_no: req.params.case_no } });
			if (!casefile) {
				handleError(res, 404, "Casefile doesn't exist");
			} else {
				await CasefileModel.update(
					{
						case_no: req.params.case_no,
					},
					payload
				);
				res.json({
					status: 'success',
					data: {
						...casefile,
						...payload,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update the casefile");
		}
	},
};

export default CasefileController;
