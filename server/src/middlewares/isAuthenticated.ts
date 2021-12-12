import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorApiResponse } from '../types';

export default function isAuthenticated(
	req: Request,
	res: Response<ErrorApiResponse>,
	next: NextFunction
) {
	const { headers } = req;

	if (!headers.authorization) {
		res.json({
			status: 'error',
			message: 'Not authenticated',
		});
	} else {
		const [method, token] = headers.authorization!.split(' ');
		if (!token) {
			res.json({
				status: 'error',
				message: 'Not authenticated',
			});
		} else if (method !== 'Bearer') {
			res.json({
				status: 'error',
				message: 'Not authenticated',
			});
		} else {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!);
				req.jwt_payload = decoded;
				next();
			} catch (_) {
				res.json({
					status: 'error',
					message: 'Not authenticated',
				});
			}
		}
	}
}
