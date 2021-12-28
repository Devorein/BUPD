import express from 'express';
import { CriminalController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put('/', isAuthenticated, isAuthorized(['police']), CriminalController.update);

export default CriminalRouter;
