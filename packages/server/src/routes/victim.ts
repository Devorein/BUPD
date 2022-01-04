import { VictimRequest } from '@bupd/validation';
import express from 'express';
import { VictimController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const VictimRouter = express.Router();

VictimRouter.get(
	'/',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	validatePayload(VictimRequest.get),
	VictimController.findMany
);

export default VictimRouter;
