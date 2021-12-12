import express from 'express';
import { PoliceController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const PoliceRouter = express.Router();

PoliceRouter.put('/', isAuthenticated, isAuthorized(['police']), PoliceController.update);

export default PoliceRouter;
