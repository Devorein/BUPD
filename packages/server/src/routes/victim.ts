import { VictimRequest } from '@bupd/validation';
import express from 'express';
import { VictimController } from '../controllers';
import { hasAccess, isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const VictimRouter = express.Router();

VictimRouter.get(
	'/',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	validatePayload(VictimRequest.get),
	VictimController.findMany
);

VictimRouter.delete(
	'/',
	isAuthenticated,
	isAuthorized(['admin']),
	validatePayload(VictimRequest.delete),
	VictimController.delete
).put(
	'/',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	validatePayload(VictimRequest.update('server')),
	hasAccess('case', ['update']),
	VictimController.update
);

export default VictimRouter;
