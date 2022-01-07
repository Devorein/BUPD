import { CasefilePayload } from '@bupd/validation';
import express from 'express';
import { CasefileController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const CasefileRouter = express.Router();

CasefileRouter.post(
	'/',
	validatePayload(CasefilePayload.create('server')),
	isAuthenticated,
	isAuthorized(['police']),
	CasefileController.create
).get(
	'/',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	validatePayload(CasefilePayload.get),
	CasefileController.findMany
);

CasefileRouter.delete<{ case_no: number }>(
	'/:case_no',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	hasAccess('case', ['delete']),
	CasefileController.delete
)
	.put(
		'/:case_no',
		validatePayload(CasefilePayload.update),
		isAuthenticated,
		isAuthorized(['police', 'admin']),
		hasAccess('case', ['update']),
		CasefileController.update
	)
	.get(
		'/:case_no',
		isAuthenticated,
		isAuthorized(['police', 'admin']),
		hasAccess('case', ['read']),
		CasefileController.get
	);

export default CasefileRouter;
