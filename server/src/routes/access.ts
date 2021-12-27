import express from 'express';
import { AccessController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const AccessRouter = express.Router();
AccessRouter.post('/', isAuthenticated, isAuthorized(['police']), AccessController.create);
AccessRouter.get('/', isAuthenticated, isAuthorized(['police']), AccessController.find);

export default AccessRouter;
