import { NextFunction, Request, Response } from 'express';
import { ErrorApiResponse } from '../types';

export default function isAuthorized(roles: string[]) {
	return (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		if (!req.jwt_payload) {
			res.json({
				status: 'error',
				message: 'Not authorized',
			});
		} else {
			if (!roles.includes(req.jwt_payload.role)) {
				res.json({
					status: 'error',
					message: 'Not authorized',
				});
			} else {
				next();
			}
		}
	};
}
