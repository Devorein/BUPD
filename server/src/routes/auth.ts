import express from 'express';
import { AuthController } from '../controllers';
import { isAuthenticated } from '../middlewares';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', isAuthenticated, AuthController.register);

export default AuthRouter;
