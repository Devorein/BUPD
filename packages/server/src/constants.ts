import { IAccess, ICasefile, ICriminal, IPolice } from '@bupd/types';

export const policeAttributes: (keyof IPolice)[] = [
	'address',
	'designation',
	'email',
	'name',
	'nid',
	'password',
	'phone',
	'rank',
];

export const accessAttributes: (keyof IAccess)[] = [
	'access_id',
	'admin_id',
	'approved',
	'case_no',
	'criminal_id',
	'permission',
	'police_nid',
	'type',
];

export const casefileAttributes: (keyof ICasefile)[] = [
	'case_no',
	'location',
	'police_nid',
	'priority',
	'status',
	'time',
];

export const criminalAttributes: (keyof ICriminal)[] = ['criminal_id', 'name', 'photo'];
