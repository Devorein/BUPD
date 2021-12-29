import express from 'express';
import { CriminalController } from '../controllers';
import { isAuthenticated, isAuthorized, hasAccess } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put(
	'/',
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
