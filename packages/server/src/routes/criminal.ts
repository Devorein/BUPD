import { CriminalPayload } from '@bupd/validation';
import express from 'express';
import { CriminalController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put(
	'/',
	validatePayload(CriminalPayload.update),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['update', 'delete']),
	CriminalController.update
);
CriminalRouter.delete(
	'/',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['delete']),
	CriminalController.delete
);
CriminalRouter.put(
	'/:criminal_id',
	// TODO validatePayload(),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['update', 'delete']),
	CriminalController.updateOnCriminalId
);
CriminalRouter.delete(
	'/:criminal_id',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['delete']),
	CriminalController.deleteOnCriminalId
);

export default CriminalRouter;
