import argon2 from 'argon2';
import { Request, Response } from 'express';
import { AdminModel, PoliceModel } from '../models';
import {
	AdminJwtPayload,
	ApiResponse,
	IAdmin,
	IPolice,
	LoginPayload,
	LoginResponse,
	PoliceJwtPayload,
	RegisterPolicePayload,
	RegisterPoliceResponse,
} from '../types';
import { checkForFields, removeFields, signToken, validateEmail, validatePassword } from '../utils';

export default {
	login: async (
		req: Request<any, any, LoginPayload>,
		res: Response<ApiResponse<LoginResponse>>
	) => {
		const payload = req.body;
		const nonExistentFields = checkForFields(payload, ['as', 'email', 'password']);
		if (nonExistentFields.length !== 0) {
			res.json({
				status: 'error',
				message: `${nonExistentFields[0]} is required`,
			});
		} else {
			// Wrapping everything in try/catch block
			// As an error might be thrown when using argon2 or jwt
			try {
				if (req.body.as !== 'admin' && req.body.as !== 'police') {
					res.json({
						status: 'error',
						message: 'You can only login as admin or police',
					});
				} else {
					if (payload.as === 'police') {
						const police = await PoliceModel.find({ email: payload.email });
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
								const policeJwtToken = {
									...removeFields<IPolice, PoliceJwtPayload>(passwordRemovedPolice, [
										'address',
										'designation',
										'name',
										'phone',
									]),
									type: 'police',
								};
								const jwtToken = signToken(policeJwtToken);
								res.json({
									status: 'success',
									data: {
										...passwordRemovedPolice,
										token: jwtToken,
									},
								});
							}
						}
					} else if (payload.as === 'admin') {
						const admin = await AdminModel.find({ email: payload.email });
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
				}
			} catch (_) {
				res.json({
					status: 'error',
					message: 'Something went wrong. Please try again.',
				});
			}
		}
	},
	register: async (
		req: Request<any, any, RegisterPolicePayload>,
		res: Response<ApiResponse<RegisterPoliceResponse>>
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
