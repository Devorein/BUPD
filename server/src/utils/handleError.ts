import { Response } from 'express';
import { ErrorApiResponse } from '../types';

const handleError = (res: Response<ErrorApiResponse>, statusCode: number, message: string) => {
	res.status(statusCode).json({
		status: 'error',
		message,
	});
};

export default handleError;
