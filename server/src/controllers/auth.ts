import { Request, Response } from 'express';

export default {
	login: (_: Request, res: Response) => {
		res.json({
			status: 'success',
			data: {
				username: 'username',
			},
		});
	},
	register: (_: Request, res: Response) => {
		res.json({
			status: 'success',
			data: {
				username: 'username',
			},
		});
	},
};
