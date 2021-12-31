import { PoliceRequest } from '@bupd/validation';
import express from 'express';
import { PoliceController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';
import validateQuery from '../middlewares/validateQuery';

const PoliceRouter = express.Router();

PoliceRouter.put(
	'/',
	validatePayload(PoliceRequest.update),
	isAuthenticated,
	isAuthorized(['police']),
	PoliceController.update
);
PoliceRouter.get(
	'/',
	validateQuery(PoliceRequest.get),
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	PoliceController.get
);
PoliceRouter.delete(
	'/',
	validatePayload(PoliceRequest.delete),
	isAuthenticated,
	isAuthorized(['admin']),
	PoliceController.delete
);

export default PoliceRouter;
