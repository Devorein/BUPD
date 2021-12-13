import express from 'express';
import { CaseFileController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const CaseFileRouter = express.Router();

CaseFileRouter.post('/', isAuthenticated, isAuthorized(['police']), CaseFileController.create);

export default CaseFileRouter;
