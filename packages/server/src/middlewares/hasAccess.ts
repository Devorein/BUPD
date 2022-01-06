import { AccessPermission, ErrorApiResponse, TAccessType } from '@bupd/types';
import { NextFunction, Request, Response } from 'express';
import { AccessModel } from '../models';
import { handleError, logger } from '../utils';

const hasAccess =
	(accessType: TAccessType, accessPermissions: AccessPermission[]) =>
	async (req: Request<any, any, any>, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			if (!req.jwt_payload) {
				return handleError(res, 401, 'Not Authenticated');
			} else if (req.jwt_payload.type === 'admin') {
				return next();
			} else {
				const [row] = await AccessModel.find({
					filter: [
						{
							approved: 1,
							police_nid: req.jwt_payload.nid,
							type: accessType,
							permission: {
								$in: accessPermissions,
							},
							case_no: req.params.case_no ? req.params.case_no : req.body.case_no,
						},
					],
				});
				if (row) {
					return next();
				}
				return handleError(res, 403, `Not Authorized to ${accessPermissions[0]} ${accessType}`);
			}
		} catch (err) {
			logger.error(err);
			return handleError(res, 403, `Not Authorized to ${accessPermissions[0]} ${accessType}`);
		}
	};

export default hasAccess;
