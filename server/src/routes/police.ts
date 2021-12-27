import express from 'express';
import { PoliceController, PoliceRequest } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

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
	validatePayload(PoliceRequest.get),
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
