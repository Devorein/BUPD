import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import * as yup from 'yup';
import { PoliceModel } from '../models';
import {
	ApiResponse,
	DeletePolicePayload,
	DeletePoliceResponse,
	GetPolicesPayload,
	GetPolicesResponse,
	PoliceJwtPayload,
	UpdatePolicePayload,
	UpdatePoliceResponse,
} from '../types';
import {
	generateCountQuery,
	generatePoliceJwtToken,
	logger,
	query,
	removeFields,
	validateEmail,
} from '../utils';

const PoliceRequest = {
	update: yup
		.object({
			email: yup.string().test((email) => (email === undefined ? true : validateEmail(email))),
			phone: yup.string().nullable(),
			address: yup.string().nullable(),
			designation: yup.string().nullable(),
			name: yup.string(),
			rank: yup.string(),
		})
		.strict()
		.noUnknown(),
	get: yup
		.object({
			filter: yup.object({
				designation: yup.string(),
				rank: yup.string(),
			}),
			sort: yup
				.array()
				.test(
					(arr) =>
						arr === undefined ||
						(arr.length === 2 &&
							arr[0].match(/^(designation|rank|name)$/) &&
							(arr[1] === -1 || arr[1] === 1))
				),
			limit: yup.number(),
		})
		.strict()
		.noUnknown(),
	delete: yup
		.object({
			nid: yup.number().min(10000).required(),
		})
		.strict()
		.noUnknown(),
};

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const [police] = await PoliceModel.find({ filter: { email: jwtPayload.email } });
			if (!police) {
				res.json({
					status: 'error',
					message: "Police doesn't exist",
				});
			} else {
				await PoliceModel.update(
					{
						nid: jwtPayload.nid,
						email: jwtPayload.email,
					},
					payload
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
						token: generatePoliceJwtToken(police),
					},
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't update your profile",
			});
		}
	},
	async get(req: Request<any, any, GetPolicesPayload>, res: Response<GetPolicesResponse>) {
		const polices = await PoliceModel.find(req.body);
		const policeCount = (await query(
			generateCountQuery({ filter: req.body?.filter }, 'Police')
		)) as RowDataPacket[];

		if (polices) {
			res.json({
				status: 'success',
				data: {
					items: polices,
					next: null,
					total: policeCount[0][0]?.count,
				},
			});
		}
	},
	async delete(req: Request<any, any, DeletePolicePayload>, res: Response<DeletePoliceResponse>) {
		const police = await PoliceModel.findByNid(req.body.nid);
		if (police[0]) {
			const result = await PoliceModel.delete(req.body);
			if (result) {
				res.json({
					status: 'success',
					data: police[0], // need to change it to ipolice
				});
			}
		} else {
			res.json({
				status: 'error',
				message: 'No valid polices given to delete',
			});
		}
	},
};

export { PoliceRequest, PoliceController };
