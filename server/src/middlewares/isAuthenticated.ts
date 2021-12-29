import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError, logger } from '../utils';
import { ErrorApiResponse, JwtPayload } from '../types';

export default function isAuthenticated(
	req: Request,
	res: Response<ErrorApiResponse>,
	next: NextFunction
) {
	const { headers } = req;
	if (!headers.authorization) {
		handleError(res, 401, 'Not authenticated');
	} else {
		const [method, token] = headers.authorization!.split(' ');
		if (!token) {
			handleError(res, 401, 'Not authenticated');
		} else if (method !== 'Bearer') {
			handleError(res, 401, 'Not authenticated');
		} else {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
				req.jwt_payload = decoded;
				next();
			} catch (err) {
				logger.error(err);				
				console.log(err);
				handleError(res, 401, 'Not authenticated');
			}
		}
	}
}
