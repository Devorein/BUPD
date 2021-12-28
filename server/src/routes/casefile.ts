import express from 'express';
import { CasefileController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const CasefileRouter = express.Router();

CasefileRouter.post('/', isAuthenticated, isAuthorized(['police']), CasefileController.create);
CasefileRouter.put('/', isAuthenticated, isAuthorized(['police']), CasefileController.update);

export default CasefileRouter;
