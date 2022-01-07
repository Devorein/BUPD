import { AuthPayload } from '@bupd/validation';
import express from 'express';
import { AuthController } from '../controllers';
import { isAuthenticated, isAuthorized, validatePayload } from '../middlewares';

const AuthRouter = express.Router();

AuthRouter.post('/login', validatePayload(AuthPayload.login), AuthController.login);
AuthRouter.post('/register', validatePayload(AuthPayload.register), AuthController.register);
AuthRouter.get(
	'/currentUser',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	AuthController.currentUser
);

export default AuthRouter;
