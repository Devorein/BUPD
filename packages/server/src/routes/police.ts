import { GetPoliceAccessesPayload } from '@bupd/types';
import { AccessPayload, PoliceRequest } from '@bupd/validation';
import express from 'express';
import { AccessController, PoliceController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';
import validateQuery from '../middlewares/validateQuery';

const PoliceRouter = express.Router();

PoliceRouter.get(
	'/',
	validateQuery(PoliceRequest.get),
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	PoliceController.findMany
)
	.get<any, any, any, GetPoliceAccessesPayload>(
		'/access',
		validateQuery(AccessPayload.get),
		isAuthenticated,
		isAuthorized(['police']),
		AccessController.findForPolice
	)
	.delete('/:nid', isAuthenticated, isAuthorized(['admin']), PoliceController.delete)
	.get(
		'/:nid',
		validateQuery(PoliceRequest.get),
		isAuthenticated,
		isAuthorized(['admin', 'police']),
		PoliceController.getOnNid
	)
	.put(
		'/:nid',
		validatePayload(PoliceRequest.update('server')),
		isAuthenticated,
		isAuthorized(['admin', 'police']),
		PoliceController.update
	);

export default PoliceRouter;
