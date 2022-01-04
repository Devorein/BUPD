import { PoliceRequest } from '@bupd/validation';
import express from 'express';
import { PoliceController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';
import validateQuery from '../middlewares/validateQuery';

const PoliceRouter = express.Router();

PoliceRouter.get(
	'/',
	validateQuery(PoliceRequest.get),
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	PoliceController.get
);

PoliceRouter.delete('/:nid', isAuthenticated, isAuthorized(['admin']), PoliceController.delete)
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
