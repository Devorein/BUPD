import { NextFunction, Request, Response } from 'express';
import { BaseSchema } from 'yup';
import { handleError } from '../utils';
import { ErrorApiResponse } from '../types';

const validatePayload =
	(resourceSchema: BaseSchema) =>
	async (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			// throws an error if not valid
			const validatedPayload = await resourceSchema.validate(req.body);
			req.body = validatedPayload;
			next();
		} catch (err) {
			handleError(res, 400, 'Bad Request');
		}
	};

export default validatePayload;
