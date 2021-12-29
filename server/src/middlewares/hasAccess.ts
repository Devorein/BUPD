import { NextFunction, Request, Response } from 'express';
import { AccessModel } from '../models';
import { AccessPermission, ErrorApiResponse, TAccessType } from '../types';
import { handleError, logger } from '../utils';

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
							approved: 1,
							police_nid: req.jwt_payload.nid,
							type: accessType,
							permission: accessPermission,
							case_no: req.body.case_no,
						};
						break;
					default:
						filter = {
							approved: 1,
							police_nid: req.jwt_payload.nid,
							type: accessType,
							permission: accessPermission,
							criminal_id: req.body.criminal_id,
						};
						break;
				}
				const test = await AccessModel.find({ filter });
				console.log(filter, test);
				if (Object.keys(test[0]).length > 0) next();
				else handleError(res, 403, `Not Authorized to ${accessPermission} ${accessType}`);
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 403, `Not Authorized to ${accessPermission} ${accessType}`);
		}
	};

export default hasAccess;
