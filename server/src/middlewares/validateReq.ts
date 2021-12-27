import { NextFunction, Request, Response } from 'express';
import { BaseSchema } from 'yup';
import { ErrorApiResponse } from '../types';

const validateReq =
	(resourceSchema: BaseSchema) =>
	async (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			// throws an error if not valid
			const validatedReq = await resourceSchema.validate(req.body);
			req.body = validatedReq;
			next();
		} catch (err) {
			res.status(400).json({
				status: 'error',
				message: 'Bad Request',
			});
		}
	};

export default validateReq;
