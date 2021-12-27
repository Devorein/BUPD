import express from 'express';
import { AuthController, AuthRequest } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const AuthRouter = express.Router();

AuthRouter.post('/login', validatePayload(AuthRequest.login), AuthController.login);
AuthRouter.post('/register', validatePayload(AuthRequest.register), AuthController.register);
AuthRouter.get(
	'/currentUser',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	AuthController.currentUser
);

export default AuthRouter;
