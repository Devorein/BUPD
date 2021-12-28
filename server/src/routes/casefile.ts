import express from 'express';
import { CasefileController, CasefilePayload } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CasefileRouter = express.Router();

CasefileRouter.post(
	'/',
	validatePayload(CasefilePayload.create),
	isAuthenticated,
	isAuthorized(['police']),
	CasefileController.create
);

export default CasefileRouter;
