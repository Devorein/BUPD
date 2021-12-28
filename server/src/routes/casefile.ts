import express from 'express';
import { CasefileController, CasefilePayload } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload, hasAccess } from '../middlewares';

const CasefileRouter = express.Router();

CasefileRouter.put('/', isAuthenticated, isAuthorized(['police']), CasefileController.update);
CasefileRouter.post(
	'/',
	validatePayload(CasefilePayload.create),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('case', 'update'),
	CasefileController.create
);
CasefileRouter.delete(
	'/',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('case', 'delete'),
	CasefileController.delete
);
export default CasefileRouter;
