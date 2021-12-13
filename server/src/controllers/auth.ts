import argon2 from 'argon2';
import { Request, Response } from 'express';
import { AdminModel, PoliceModel } from '../models';
import {
	AdminJwtPayload,
	ApiResponse,
	IAdmin,
	IPolice,
	LoginPayload,
	PoliceJwtPayload,
	RegisterPolicePayload,
} from '../types';
import { checkForFields, removeFields, signToken, validateEmail, validatePassword } from '../utils';

export default {
	login: async (
		req: Request<any, any, LoginPayload>,
		res: Response<ApiResponse<(IPolice | IAdmin) & { token: string }>>
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
		} else if (!req.body.as) {
			res.json({
				status: 'error',
				message: 'As field is required',
			});
		} else if (req.body.as !== 'admin' && req.body.as !== 'police') {
			res.json({
				status: 'error',
				message: 'You can only login as admin or police',
			});
		} else {
			const payload = req.body;
			if (payload.as === 'police') {
				const queryResponse = await PoliceModel.findByEmail(payload.email);
				if (!queryResponse) {
					res.json({
						status: 'error',
						message: 'No police exists with that email',
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
							role: 'police',
							nid: queryResponse.nid,
							email: queryResponse.email,
						});
						res.json({
							status: 'success',
							data: {
								email: queryResponse.email,
								name: queryResponse.name,
								nid: queryResponse.nid,
								token: jwtToken,
							},
						});
					}
				}
			} else if (payload.as === 'admin') {
				const queryResponse = await AdminModel.findByEmail(payload.email);
				if (!queryResponse) {
					res.json({
						status: 'error',
						message: 'No admin exists with that email',
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
							role: 'admin',
							email: queryResponse.email,
							id: queryResponse.id,
						} as AdminJwtPayload);
						res.json({
							status: 'success',
							data: {
								email: queryResponse.email,
								id: queryResponse.id,
								token: jwtToken,
							},
						});
					}
				}
			}
		}
	},
	register: async (
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<IPolice & { token: string }>>
	) => {
		const payload = req.body;
		const nonExistentFields = checkForFields(payload, [
			'nid',
			'address',
			'designation',
			'name',
			'password',
			'phone',
			'rank',
		]);
		if (nonExistentFields.length !== 0) {
			res.json({
				status: 'error',
				message: `${nonExistentFields[0]} is required`,
			});
		} else if (!validatePassword(payload.password)) {
			res.json({
				status: 'error',
				message: 'Weak password',
			});
		} else if (!validateEmail(payload.email)) {
			res.json({
				status: 'error',
				message: 'Invalid email',
			});
		} else {
			try {
				const hashedPassword = await argon2.hash(payload.password, {
					hashLength: 100,
					timeCost: 5,
					salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
				});

				const jwtToken = signToken({
					role: 'police',
					nid: payload.nid,
					email: payload.email,
				} as PoliceJwtPayload);

				await PoliceModel.create({
					...payload,
					password: hashedPassword,
				});

				res.json({
					status: 'success',
					data: {
						// We should not return password to the client
						...removeFields(payload, ['password']),
						token: jwtToken,
					},
				});
			} catch (err) {
				// This error is thrown when unique constraint is violated
				// Since we are adding this constraint to both email and nid
				// We should detect which field is violating this constraint
				// and send appropriate response error message
				if (err.code === 'ER_DUP_ENTRY') {
					const isDuplicateEmail = err.sqlMessage.includes('email');
					res.json({
						status: 'error',
						message: `A police already exists with this ${isDuplicateEmail ? 'email' : 'NID'}`,
					});
				} else {
					res.json({
						status: 'error',
						message: 'Something went wrong. Please try again',
					});
				}
			}
		}
	},
};
