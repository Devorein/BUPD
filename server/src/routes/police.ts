import express from 'express';
import { PoliceController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const PoliceRouter = express.Router();

PoliceRouter.put('/', isAuthenticated, isAuthorized(['police']), PoliceController.update);
PoliceRouter.get('/', isAuthenticated, isAuthorized(['admin', 'police']), PoliceController.get);
PoliceRouter.delete('/', isAuthenticated, isAuthorized(['admin']), PoliceController.delete);

export default PoliceRouter;
