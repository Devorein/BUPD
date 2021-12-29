import jwt from 'jsonwebtoken';
import { IPolice, PoliceJwtPayload } from '../types';
import removeFields from './removeFields';

export function signToken(payload: Record<string, any>) {
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn: '1d',
	});
}

export function generatePoliceJwtToken(police: IPolice) {
	const passwordRemovedPolice = removeFields<IPolice & { password: string }, IPolice>(police, [
		'password',
	]);
	const policeJwtToken = {
		// Removing fields that are confidential and should not be present in the jwt
		...removeFields<IPolice, PoliceJwtPayload>(passwordRemovedPolice, [
			'password',
			'address',
			'designation',
			'name',
			'phone',
		]),
		type: 'police',
	};
	return signToken(policeJwtToken);
}
