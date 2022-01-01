import {
	AdminJwtPayload,
	ApiResponse,
	GetCurrentUserResponse,
	IAdmin,
	IPolice,
	LoginPayload,
	LoginResponse,
	RegisterPolicePayload,
	RegisterPoliceResponse,
} from '@bupd/types';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { AdminModel, PoliceModel } from '../models';
import { generatePoliceJwtToken, logger, removeFields, signToken } from '../utils';

const AuthController = {
	login: async (
		req: Request<any, any, LoginPayload>,
		res: Response<ApiResponse<LoginResponse>>
	) => {
		try {
			const payload = req.body;
			if (payload.as === 'police') {
				const [police] = await PoliceModel.find({
					filter: { email: payload.email },
					select: ['password'],
				});

				if (!police) {
					res.json({
						status: 'error',
						message: 'No police exists with that email',
					});
				} else {
					const isCorrectPassword = await argon2.verify(police.password, payload.password);
					if (!isCorrectPassword) {
						res.json({
							status: 'error',
							message: 'Incorrect password',
						});
					} else {
						const passwordRemovedPolice = removeFields<IPolice & { password: string }, IPolice>(
							police,
							['password']
						);
						res.json({
							status: 'success',
							data: {
								...passwordRemovedPolice,
								token: generatePoliceJwtToken(police),
							},
						});
					}
				}
			} else if (payload.as === 'admin') {
				const [admin] = await AdminModel.find({ email: payload.email });
				if (!admin) {
					res.json({
						status: 'error',
						message: 'No admin exists with that email',
					});
				} else {
					const isCorrectPassword = await argon2.verify(admin.password, payload.password);
					if (!isCorrectPassword) {
						res.json({
							status: 'error',
							message: 'Incorrect password',
						});
					} else {
						const passwordRemovedAdmin = removeFields<IAdmin & { password: string }, IAdmin>(
							admin,
							['password']
						);
						const adminJwtPayload: AdminJwtPayload = {
							type: 'admin',
							...passwordRemovedAdmin,
						};
						const jwtToken = signToken(adminJwtPayload);
						res.json({
							status: 'success',
							data: {
								...passwordRemovedAdmin,
								token: jwtToken,
							},
						});
					}
				}
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: 'Something went wrong. Please try again.',
			});
		}
	},
	register: async (
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<RegisterPoliceResponse>>
	) => {
		try {
			const payload = req.body;
			const hashedPassword = await argon2.hash(payload.password, {
				hashLength: 100,
				timeCost: 5,
				salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
			});

			await PoliceModel.create({
				...payload,
				password: hashedPassword,
			});

			res.json({
				status: 'success',
				// We should not return password to the client
				data: removeFields(payload, ['password']),
			});
		} catch (err) {
			logger.error(err);
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
	},
	async currentUser(
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<GetCurrentUserResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload!;
			if (jwtPayload.type === 'admin') {
				const [admin] = await AdminModel.find({
					email: jwtPayload.email,
				});
				if (!admin) {
					res.json({
						status: 'error',
						message: "Admin doesn't exist",
					});
				} else {
					res.json({
						status: 'success',
						data: {
							...removeFields<IAdmin, Exclude<IAdmin, 'password'>>(admin, ['password']),
							type: 'admin',
						},
					});
				}
			} else if (jwtPayload.type === 'police') {
				const [police] = await PoliceModel.find({
					filter: {
						email: jwtPayload.email,
						nid: jwtPayload.nid,
					},
				});
				if (!police) {
					res.json({
						status: 'error',
						message: "Police doesn't exist",
					});
				} else {
					res.json({
						status: 'success',
						data: {
							...removeFields<IPolice, Exclude<IPolice, 'password'>>(police, ['password']),
							type: 'police',
						},
					});
				}
			} else {
				res.json({
					status: 'error',
					message: 'Invalid token used',
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: 'Something went wrong. Please try again.',
			});
		}
	},
};

export default AuthController;
