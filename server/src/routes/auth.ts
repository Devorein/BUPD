import express from 'express';
import { AuthController } from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', isAuthenticated, isAuthorized(['admin']), AuthController.register);

export default AuthRouter;
