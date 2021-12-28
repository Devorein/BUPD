import express from 'express';
import { AccessController, AccessPayload } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const AccessRouter = express.Router();
AccessRouter.post(
	'/',
	validatePayload(AccessPayload.create),
	isAuthenticated,
	isAuthorized(['police']),
	AccessController.create
);
AccessRouter.get(
	'/',
	validatePayload(AccessPayload.get),
	isAuthenticated,
	isAuthorized(['police']),
	AccessController.find
);

export default AccessRouter;
