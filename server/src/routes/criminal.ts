import express from 'express';
import { CriminalController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const CriminalRouter = express.Router();

CriminalRouter.put('/', isAuthenticated, isAuthorized(['police']), CriminalController.update);
CriminalRouter.delete('/', isAuthenticated, isAuthorized(['police']), CriminalController.delete);

export default CriminalRouter;
