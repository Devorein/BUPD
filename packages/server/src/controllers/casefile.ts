import {
	ApiResponse,
	CreateCasefilePayload,
	CreateCasefileResponse,
	DeleteCasefilePayload,
	DeleteCasefileResponse,
	ICasefile,
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
import { CasefileModel } from '../models';
import { generateInsertQuery, handleError, logger, pool, removeFields } from '../utils';

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

			const casefile: ICasefile = {
				case_no: maxCaseNo,
				time: new Date(payload.time).toISOString().slice(0, 19).replace('T', ' '),
				status: payload.status ?? 'open',
				priority: payload.priority,
				location: payload.location,
				police_nid: jwtPayload.nid,
			};
			await connection.query(generateInsertQuery(casefile, 'Casefile'));

			for (let index = 0; index < payload.weapons.length; index += 1) {
				const weapon: ICrimeWeapon = {
					case_no: maxCaseNo,
					weapon: payload.weapons[index],
				};
				weapons.push(weapon);

				await connection.query(generateInsertQuery(weapon, 'Crime_Weapon'));
			}

			for (let index = 0; index < payload.categories.length; index += 1) {
				const category: ICrimeCategory = {
					case_no: maxCaseNo,
					category: payload.categories[index],
				};
				categories.push(category);

				await connection.query(generateInsertQuery(category, 'Crime_Category'));
			}

			for (let index = 0; index < payload.victims.length; index += 1) {
				const victimPayload = payload.victims[index];
				const victim: IVictim = {
					name: victimPayload.name,
					age: victimPayload.age ?? null,
					address: victimPayload.address ?? null,
					phone_no: victimPayload.phone_no ?? null,
					description: victimPayload.description ?? null,
					case_no: maxCaseNo,
				};
				victims.push(victim);
				await connection.query(generateInsertQuery(victim, 'Victim'));
			}

			for (let index = 0; index < newCriminalPayloads.length; index += 1) {
				const newCriminal = newCriminalPayloads[index];
				allCriminalIds.push(maxCriminalId + index + 1);
				await connection.query(
					generateInsertQuery(
						{
							criminal_id: maxCriminalId + index + 1,
							name: newCriminal.name,
							photo: newCriminal.photo ?? null,
						},
						'Criminal'
					)
				);
			}

			for (let index = 0; index < allCriminalIds.length; index += 1) {
				const criminalId = allCriminalIds[index];
				await connection.query(
					generateInsertQuery(
						{
							case_no: maxCaseNo,
							criminal_id: criminalId,
						},
						'Casefile_Criminal'
					)
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
