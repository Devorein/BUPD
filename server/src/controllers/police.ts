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
import { generateCountQuery, generatePoliceJwtToken, query, removeFields } from '../utils';
import { VALID_REGEX } from '../utils/validate';

const PoliceRequest = {
	update: yup.object().shape({
		email: yup.string().email({ regex: VALID_REGEX }),
		phone: yup.string().nullable(),
		address: yup.string().nullable(),
		designation: yup.string().nullable(),
		nid: yup.number().min(10000),
		name: yup.string(),
		rank: yup.string(),
	}),
	get: yup.object().shape({
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
	}),
	delete: yup.object().shape({
		nid: yup.number().min(10000).required(),
	}),
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
