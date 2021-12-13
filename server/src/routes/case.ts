import express from 'express';
import { CaseController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const CaseRouter = express.Router();

CaseRouter.post('/', isAuthenticated, isAuthorized(['police']), CaseController.create);

export default CaseRouter;
