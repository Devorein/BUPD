import {
	ApiResponse,
	DeletePolicePayload,
	DeletePoliceResponse,
	GetPoliceResponse,
	GetPolicesPayload,
	GetPolicesResponse,
	PoliceJwtPayload,
	UpdatePolicePayload,
	UpdatePoliceProfilePayload,
	UpdatePoliceProfileResponse,
	UpdatePoliceResponse,
} from '@bupd/types';
import { IPolicePopulated } from '@bupd/types/src/entities';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { generatePoliceJwtToken, handleError, logger, removeFields } from '../utils';
import { convertPoliceFilter } from '../utils/convertClientQuery';
import { getPoliceAttributes } from '../utils/generateAttributes';
import { inflateObject } from '../utils/inflateObject';
import Logger from '../utils/logger';

const PoliceController = {
	async updateProfile(
		req: Request<any, any, UpdatePoliceProfilePayload>,
		res: Response<ApiResponse<UpdatePoliceProfileResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const [police] = await PoliceModel.find({
				filter: [{ nid: jwtPayload.nid }],
				select: ['password'],
			});
			if (!police) {
				handleError(res, 404, `No Police exists with nid ${jwtPayload.nid}`);
			} else {
				// Check if the password matches
				const isCorrectPassword = await argon2.verify(police.password, payload.password);
				if (!isCorrectPassword) {
					handleError(res, 401, 'Incorrect password!');
				} else {
					// If the user wants to set a new password hash it first
					const password = payload.new_password
						? await argon2.hash(payload.new_password, {
								hashLength: 100,
								timeCost: 5,
								salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
						  })
						: police.password;
					await PoliceModel.update(
						[
							{
								nid: payload.nid,
							},
						],
						{
							...removeFields(payload, ['new_password', 'password']),
							password,
						}
					);
					res.json({
						status: 'success',
						data: {
							...removeFields(
								{
									...police,
									...payload,
								},
								['password', 'new_password']
							),
							token: generatePoliceJwtToken({
								...police,
								...payload,
							}),
						},
					});
				}
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update your profile");
		}
	},
	async update(
		req: Request<{ nid: number }, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const payload = req.body;
			const [police] = await PoliceModel.find({ filter: [{ nid: req.params.nid }] });
			if (!police) {
				handleError(res, 404, `No Police exists with nid ${req.params.nid}`);
			} else {
				await PoliceModel.update(
					[
						{
							nid: req.params.nid,
						},
					],
					removeFields(payload, ['email'])
				);
				res.json({
					status: 'success',
					data: {
						...removeFields(
							{
								...police,
								...payload,
							},
							['password']
						),
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update your profile");
		}
	},
	async findMany(
		req: Request<any, any, any, GetPolicesPayload>,
		res: Response<GetPolicesResponse>
	) {
		try {
			res.json({
				status: 'success',
				data: await paginate<IPolicePopulated>(
					{
						limit: req.query.limit,
						next: req.query.next,
						sort: req.query.sort ? [req.query.sort] : [],
						filter: convertPoliceFilter(req.query.filter),
						// Custom select to remove password field
						select: [
							...getPoliceAttributes('Police', ['password']),
							{
								aggregation: ['COUNT'],
								attribute: 'case_no',
								alias: 'reported_cases',
								namespace: 'Casefile',
							},
						],
						joins: [['Police', 'Casefile', 'nid', 'police_nid', 'LEFT']],
						groups: ['Police.nid'],
					},
					'Police',
					'nid',
					(rows) =>
						rows.map((row) => {
							const inflatedObject = inflateObject<IPolicePopulated>(row, 'Police');
							return {
								...inflatedObject,
								reported_cases: row.reported_cases,
							};
						})
				),
			});
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async delete(req: Request<DeletePolicePayload, any>, res: Response<DeletePoliceResponse>) {
		try {
			const police = await PoliceModel.findByNid(req.params.nid);
			if (police) {
				const result = await PoliceModel.delete(req.params.nid);
				if (result) {
					res.json({
						status: 'success',
						data: removeFields(police, ['password']),
					});
				}
			} else {
				handleError(res, 404, 'No valid polices given to delete');
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async getOnNid(req: Request<{ nid: number }>, res: Response<GetPoliceResponse>) {
		try {
			const police = await PoliceModel.findByNid(req.params.nid);
			if (police) {
				res.json({
					status: 'success',
					data: removeFields(police, ['password']),
				});
			} else {
				handleError(res, 404, `No police with nid, ${req.params.nid} found`);
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
};

export default PoliceController;
