import argon2 from 'argon2';
import { Request, Response } from 'express';
import { RegisterPolicePayload } from '../types';
import { query, validatePassword } from '../utils';

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
		if (!req.body.nid) {
			res.json({
				status: 'error',
				message: 'NID is required',
			});
		} else if (!req.body.name) {
			res.json({
				status: 'error',
				message: 'Name is required',
			});
		} else if (!req.body.password) {
			res.json({
				status: 'error',
				message: 'Password is required',
			});
		} else if (!validatePassword(req.body.password)) {
			res.json({
				status: 'error',
				message: 'Weak password',
			});
		}
		// TODO: create jsonwebtoken
		// TODO: store hashed password
		try {
			const hashedPassword = await argon2.hash(req.body.password);
			await query(`
        INSERT INTO police(nid, name, password) VALUES(${req.body.nid}, "${req.body.name}", "${hashedPassword}");
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
