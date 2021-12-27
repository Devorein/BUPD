import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'yup';
import { ErrorApiResponse } from '../types';

const validateReq =
	(resourceSchema: AnySchema) =>
	async (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			// throws an error if not valid
			await resourceSchema.validate(req.body);
			next();
		} catch (err) {
			res.json({
				status: 'error',
				message: err.message,
			});
		}
	};

export default validateReq;
