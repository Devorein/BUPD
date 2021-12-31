import { GetAccessPayload } from '@bupd/types';
import { AccessPayload } from '@bupd/validation';
import express from 'express';
import { AccessController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';
import validateQuery from '../middlewares/validateQuery';

const AccessRouter = express.Router();
AccessRouter.post(
	'/',
	validatePayload(AccessPayload.create),
	isAuthenticated,
	isAuthorized(['police']),
	AccessController.create
).get<any, any, any, GetAccessPayload>(
	'/',
	validateQuery(AccessPayload.get),
	isAuthenticated,
	isAuthorized(['police']),
	AccessController.find
);

AccessRouter.put(
	'/',
	validatePayload(AccessPayload.update),
	isAuthenticated,
	isAuthorized(['admin']),
	AccessController.update
);

export default AccessRouter;
