import express from 'express';
import { PoliceController, PoliceRequest } from '../controllers';
import { isAuthenticated, isAuthorized, validateReq } from '../middlewares';

const PoliceRouter = express.Router();

PoliceRouter.put(
	'/',
	validateReq(PoliceRequest.update),
	isAuthenticated,
	isAuthorized(['police']),
	PoliceController.update
);
PoliceRouter.get(
	'/',
	validateReq(PoliceRequest.get),
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	PoliceController.get
);
PoliceRouter.delete(
	'/',
	validateReq(PoliceRequest.delete),
	isAuthenticated,
	isAuthorized(['admin']),
	PoliceController.delete
);

export default PoliceRouter;
