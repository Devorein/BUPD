export default function validatePassword(password: string) {
	const errors: string[] = [];
	if (password.length < 8) {
		errors.push('Your password must be at least 8 characters');
	}
	if (password.search(/[a-z]/) < 0) {
		errors.push('Your password must contain at least one small letter.');
	}
	if (password.search(/[A-Z]/) < 0) {
		errors.push('Your password must contain at least one capital letter.');
	}
	if (password.search(/[0-9]/) < 0) {
		errors.push('Your password must contain at least one digit.');
	}
	if (errors.length > 0) {
		return false;
	}
	return true;
}
