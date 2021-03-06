import { CriminalPayload } from '@bupd/validation';
import express from 'express';
import { CriminalController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put(
	'/:criminal_id',
	validatePayload(CriminalPayload.update),
	isAuthenticated,
	isAuthorized(['police', 'admin']),
	hasAccess('criminal', ['update', 'delete']),
	CriminalController.update
).delete(
	'/:criminal_id',
	isAuthenticated,
	isAuthorized(['police', 'admin']),
	hasAccess('criminal', ['delete']),
	CriminalController.delete
);

CriminalRouter.get(
	'/',
	isAuthenticated,
	isAuthorized(['police', 'admin']),
	CriminalController.findMany
);
export default CriminalRouter;
