import { AccessPermission, ErrorApiResponse, IAccess, TAccessType } from '@bupd/types';
import { NextFunction, Request, Response } from 'express';
import { AccessModel } from '../models';
import { handleError, logger } from '../utils';

const hasAccess =
	(accessType: TAccessType, accessPermissions: AccessPermission[]) =>
	async (req: Request<any, any, any>, res: Response<ErrorApiResponse>, next: NextFunction) => {
		try {
			if (!req.jwt_payload) {
				handleError(res, 401, 'Not Authenticated');
			} else if (req.jwt_payload.type === 'admin') {
				next();
			} else {
				let filter;
				let test: IAccess[] = [];
				switch (accessType) {
					case 'case':
						for (let index = 0; index < accessPermissions.length; index += 1) {
							const accessPermission = accessPermissions[index];
							filter = [
								{
									approved: 1,
									police_nid: req.jwt_payload.nid,
									type: accessType,
									permission: accessPermission,
									case_no: req.params.case_no ? req.params.case_no : req.body.case_no,
								},
							];
							test = test.concat(await AccessModel.find({ filter }));
							if (test[0] && Object.keys(test[0]).length > 0) next();
						}
						break;
					case 'criminal':
						for (let index = 0; index < accessPermissions.length; index += 1) {
							const accessPermission = accessPermissions[index];
							filter = [
								{
									approved: 1,
									police_nid: req.jwt_payload.nid,
									type: accessType,
									permission: accessPermission,
									criminal_id: req.params.criminal_id ?? req.body.criminal_id,
								},
							];
							test = test.concat(await AccessModel.find({ filter }));
							if (test[0] && Object.keys(test[0]).length > 0) next();
						}
						break;
					default:
						handleError(res, 403, `Not Authorized to ${accessPermissions[0]} ${accessType}`);
				}
				// const test = await AccessModel.find({ filter });
				// if (Object.keys(test[0]).length > 0) next();
				// else handleError(res, 403, `Not Authorized to ${accessPermission} ${accessType}`);
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 403, `Not Authorized to ${accessPermissions[0]} ${accessType}`);
		}
	};

export default hasAccess;
