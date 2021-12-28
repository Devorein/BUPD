import { NextFunction, Request, Response } from 'express';
import { AccessModel } from '../models';
import { handleError } from '../utils';
import { ErrorApiResponse, TAccessType, AccessPermission } from '../types';

const hasAccess =
	(accessType: TAccessType, accessPermission: AccessPermission) =>
	async (req: Request, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			if (!req.jwt_payload) {
				handleError(res, 401, 'Not Authenticated');
			} else if (req.jwt_payload.type === 'admin') {
				next();
			} else {
				let filter;
				switch (accessType) {
					case 'case':
						filter = {
							police_nid: req.jwt_payload.nid,
							type: accessType,
							permission: accessPermission,
							case_no: req.body.case_no,
						};
						break;
					default:
						filter = {
							police_nid: req.jwt_payload.nid,
							type: accessType,
							permission: accessPermission,
							criminal_id: req.body.criminal_id,
						};
						break;
				}
				const test = await AccessModel.find({ filter });
				console.log(filter, test);

				if (Array.isArray(test[0]) ? test[0].length > 0 : Object.keys(test[0]).length > 0) next();
				else handleError(res, 403, 'Not Authorized');
			}
		} catch (_) {
			handleError(res, 403, 'Not Authorized');
		}
	};

export default hasAccess;
