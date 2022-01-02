import { NextFunction, Request, Response } from 'express';

function isObject(val: Record<string, any>) {
	return val.constructor === Object;
}

function isNumber(val: string) {
	return !Number.isNaN(parseFloat(val)) && Number.isFinite(Number('5'));
}

function isBoolean(val: boolean | string) {
	return val === 'false' || val === 'true';
}

function isArray(val: any[]) {
	return Array.isArray(val);
}

function parseArray(arr: any[]) {
	const result: any[] = [];
	for (let i = 0; i < arr.length; i += 1) {
		// eslint-disable-next-line
		result[i] = parseValue(arr[i]);
	}
	return result;
}

function parseNumber(val: number) {
	return Number(val);
}

function parseBoolean(val: string) {
	return val === 'true';
}

function parseValue(val: any) {
	if (typeof val === 'undefined' || val === '') {
		return null;
	} else if (isBoolean(val)) {
		return parseBoolean(val);
	} else if (isArray(val)) {
		return parseArray(val);
	} else if (isObject(val)) {
		// eslint-disable-next-line
		return parseObject(val);
	} else if (isNumber(val)) {
		return parseNumber(val);
	} else {
		return val;
	}
}

function parseObject(obj: Record<string, any>) {
	const result: Record<string, any> = {};
	Object.keys(obj).forEach((key) => {
		const val = parseValue(obj[key]);
		result[key] = val; // ignore null values
	});
	return result;
}

export function parseQueryTypes() {
	return (req: Request<any, any, any, any>, _: Response, next: NextFunction) => {
		req.query = parseObject(req.query);
		next();
	};
}
