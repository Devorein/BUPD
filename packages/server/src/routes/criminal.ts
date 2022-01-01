import { CriminalPayload } from '@bupd/validation';
import express from 'express';
import { CriminalController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put(
	'/:criminal_id',
	validatePayload(CriminalPayload.update),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['update', 'delete']),
	CriminalController.update
).delete(
	'/:criminal_id',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('criminal', ['delete']),
	CriminalController.delete
);

export default CriminalRouter;
