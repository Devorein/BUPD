import argon2 from 'argon2';
import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { ApiResponse, IPolice, RegisterPolicePayload } from '../types';
import { validatePassword } from '../utils';

export default {
	login: (_: Request, res: Response) => {
		res.json({
			status: 'success',
			data: {
				username: 'username',
			},
		});
	},
	register: async (
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<IPolice>>
	) => {
		if (!req.body.nid) {
			res.json({
				status: 'error',
				message: 'NID is required',
			});
		} else if (!req.body.name) {
			res.json({
				status: 'error',
				message: 'Name is required',
			});
		} else if (!req.body.password) {
			res.json({
				status: 'error',
				message: 'Password is required',
			});
		} else if (!validatePassword(req.body.password)) {
			res.json({
				status: 'error',
				message: 'Weak password',
			});
		}
		// TODO: create jsonwebtoken
		// TODO: store hashed password
		try {
			const hashedPassword = await argon2.hash(req.body.password, {
				hashLength: 100,
				timeCost: 5,
				salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
			});

			const police = await PoliceModel.create({
				...req.body,
				password: hashedPassword,
			});

			res.json({
				status: 'success',
				data: police,
			});
		} catch (err) {
			res.json({
				status: 'error',
				message: err.message,
			});
		}
	},
};
