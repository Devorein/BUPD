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
	hasAccess('criminal', 'update'),
	CriminalController.update
);
CriminalRouter.delete(
	'/',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', 'delete'),
	CriminalController.delete
);

export default CriminalRouter;
