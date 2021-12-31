import { ErrorApiResponse } from '@bupd/types';
import { NextFunction, Request, Response } from 'express';
import { BaseSchema } from 'yup';
import { handleError, logger } from '../utils';

const validateData =
	(validationSchema: BaseSchema, checkQuery?: boolean) =>
	async (req: Request<any, any, any, any>, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			// throws an error if not valid
			const validatedData = await validationSchema.validate(checkQuery ? req.query : req.body);
			if (checkQuery) {
				req.query = validatedData;
			} else {
				req.body = validatedData;
			}
			next();
		} catch (err) {
			logger.error(err);
			handleError(res, 400, 'Bad Request');
		}
	};

export default validateData;
