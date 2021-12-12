import argon2 from 'argon2';
import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { ApiResponse, IPolice, LoginPayload, RegisterPolicePayload } from '../types';
import { signToken, validateEmail, validatePassword } from '../utils';

export default {
	login: async (
		req: Request<any, any, LoginPayload>,
		res: Response<ApiResponse<IPolice & { token: string }>>
	) => {
		if (!req.body.password) {
			res.json({
				status: 'error',
				message: 'Password is required',
			});
		} else if (!req.body.email) {
			res.json({
				status: 'error',
				message: 'Email is required',
			});
		}

		const payload = req.body;
		const queryResponse = await PoliceModel.findByEmail(payload.email);
		if (!queryResponse) {
			res.json({
				status: 'error',
				message: 'No police exists',
			});
		} else {
			const isCorrectPassword = await argon2.verify(queryResponse.password, payload.password);
			if (!isCorrectPassword) {
				res.json({
					status: 'error',
					message: 'Incorrect password',
				});
			} else {
				const jwtToken = signToken({
					type: 'police',
					nid: queryResponse.nid,
					email: queryResponse.email,
				});

				res.json({
					status: 'success',
					data: {
						...queryResponse,
						token: jwtToken,
					},
				});
			}
		}
	},
	register: async (
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<IPolice & { token: string }>>
	) => {
		if (!req.body.nid) {
			res.json({
				status: 'error',
				message: 'NID is required',
			});
		} else if (!req.body.email) {
			res.json({
				status: 'error',
				message: 'Email is required',
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
		} else if (!validateEmail(req.body.email)) {
			res.json({
				status: 'error',
				message: 'Invalid email',
			});
		}
		try {
			const hashedPassword = await argon2.hash(req.body.password, {
				hashLength: 100,
				timeCost: 5,
				salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
			});

			const jwtToken = signToken({
				type: 'police',
				nid: req.body.nid,
				email: req.body.email,
			});

			const police = await PoliceModel.create({
				...req.body,
				password: hashedPassword,
			});

			res.json({
				status: 'success',
				data: {
					...police,
					token: jwtToken,
				},
			});
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY') {
				const isDuplicateEmail = err.sqlMessage.includes('email');
				res.json({
					status: 'error',
					message: `A police already exists with this ${isDuplicateEmail ? 'email' : 'NID'}`,
				});
			} else {
				res.json({
					status: 'error',
					message: err.message,
				});
			}
		}
	},
};
