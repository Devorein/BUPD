import express from 'express';
import { VictimController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const VictimRouter = express.Router();

VictimRouter.get(
	'/',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	VictimController.findMany
);
