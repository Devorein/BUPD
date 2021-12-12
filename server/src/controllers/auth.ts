import { Request, Response } from 'express';
import { RegisterPolicePayload } from '../types';
import { query } from '../utils';

export default {
	login: (_: Request, res: Response) => {
		res.json({
			status: 'success',
			data: {
				username: 'username',
			},
		});
	},
	register: async (req: Request<any, any, RegisterPolicePayload>, res: Response) => {
		try {
			await query(`
        INSERT INTO police(nid, name) VALUES(${req.body.nid}, "${req.body.name}");
      `);
			res.json({
				status: 'success',
				data: null,
			});
		} catch (err) {
			res.json({
				status: 'error',
				message: err.message,
			});
		}
	},
};
