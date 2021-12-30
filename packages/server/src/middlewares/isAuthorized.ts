import { ErrorApiResponse } from '@bupd/types';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '../utils';

export default function isAuthorized(roles: string[]) {
	return (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		if (!req.jwt_payload) {
			handleError(res, 403, 'Not authorized');
		} else {
			if (!roles.includes(req.jwt_payload.type) || !req.jwt_payload.type) {
				handleError(res, 403, 'Not authorized');
			} else {
				next();
			}
		}
	};
}
