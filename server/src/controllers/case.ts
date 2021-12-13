import { Request, Response } from 'express';
import { CaseModel } from '../models';
import {
	ApiResponse,
	CreateCasePayload,
	CreateCaseResponse,
	PoliceJwtPayload,
} from '../shared.types';
import { checkForFields } from '../utils';

const CaseController = {
	async create(
		req: Request<any, any, CreateCasePayload>,
		res: Response<ApiResponse<CreateCaseResponse>>
	) {
		try {
			const payload = req.body;
			const nonExistentFields = checkForFields(payload, [
				'crime_categories',
				'location',
				'crime_time',
				'weapons',
			]);
			if (nonExistentFields.length !== 0) {
				res.json({
					status: 'error',
					message: `${nonExistentFields[0]} is required`,
				});
			} else {
				const jwtPayload = req.jwt_payload as PoliceJwtPayload;
				const createdCase = await CaseModel.create({ ...payload, police_nid: jwtPayload.nid });
				res.json({
					status: 'success',
					data: createdCase,
				});
			}
		} catch (_) {
			res.json({
				status: 'error',
				message: "Couldn't create case. Please try again.",
			});
		}
	},
};

export default CaseController;
