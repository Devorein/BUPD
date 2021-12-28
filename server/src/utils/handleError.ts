import { Response } from 'express';
import { ErrorApiResponse } from '../types';

const handleError = (res: Response<ErrorApiResponse>, statusCode?: number, message?: string) => {
	res.status(statusCode === undefined ? 404 : statusCode).json({
		status: 'error',
		message: message === undefined ? 'Something went wrong, please try again!' : message,
	});
};

export default handleError;
