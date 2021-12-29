import express from 'express';
import { CriminalController, CriminalPayload } from '../controllers';
import { isAuthenticated, isAuthorized, hasAccess, validatePayload } from '../middlewares';

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
	validatePayload(CriminalPayload.delete),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', 'delete'),
	CriminalController.delete
);

export default CriminalRouter;
