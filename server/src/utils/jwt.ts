import jwt from 'jsonwebtoken';

export function signToken(payload: Record<string, any>) {
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn: '1d',
	});
}
