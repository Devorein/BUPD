import { CasefilePayload } from '@bupd/validation';
import express from 'express';
import { CasefileController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CasefileRouter = express.Router();

CasefileRouter.put(
	'/',
	isAuthenticated,
	validatePayload(CasefilePayload.update),
	isAuthorized(['police']),
	hasAccess('case', 'update'),
	CasefileController.update
);
CasefileRouter.post(
	'/',
	validatePayload(CasefilePayload.create),
	isAuthenticated,
	isAuthorized(['police']),
	CasefileController.create
);
CasefileRouter.delete(
	'/',
	isAuthenticated,
	validatePayload(CasefilePayload.delete),
	isAuthorized(['police']),
	hasAccess('case', 'delete'),
	CasefileController.delete
);
CasefileRouter.delete(
	'/:case_no',
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('case', 'delete'),
	CasefileController.deleteOnCaseNo
);
CasefileRouter.put(
	'/:case_no',
	// TODO validatePayload(),
	isAuthenticated,
	isAuthorized(['police']),
	hasAccess('case', 'update'),
	CasefileController.updateOnCaseNo
);
export default CasefileRouter;
