import { NextFunction, Request, Response } from 'express';
import { BaseSchema } from 'yup';
import { ErrorApiResponse } from '../types';
import { handleError, logger } from '../utils';

const validatePayload =
	(resourceSchema: BaseSchema) =>
	async (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			// throws an error if not valid
			const validatedPayload = await resourceSchema.validate(req.body);
			req.body = validatedPayload;
			next();
		} catch (err) {
			logger.error(err);
			handleError(res, 400, 'Bad Request');
		}
	};

export default validatePayload;
