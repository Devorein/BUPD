import {
	IAccess,
	ICasefile,
	ICriminal,
	IPolice,
	TCasefilePriority,
	TCasefileStatus,
} from '@bupd/types';

export const CRIME_CATEGORIES = ['Murder', 'Robbery', 'Assault', 'Arson', 'Burglary', 'Theft'];
export const CASEFILE_PRIORITIES: TCasefilePriority[] = [0, 1, 2];
export const PRIORITY_RECORD: Record<string | number, string> = {
	0: 'Low',
	1: 'Medium',
	2: 'High',
};

export const APPROVAL_RECORD: Record<string | number, string> = {
	0: 'Disapproved',
	1: 'Approved',
	2: 'Unapproved',
};
export const CASEFILE_STATUSES: TCasefileStatus[] = ['open', 'closed', 'solved'];
export const CRIME_WEAPONS = [
	'Machete',
	'Knife',
	'Pistol Auto 9mm 1A',
	'Submachine guns',
	'Bamboo Stick',
	'Hockey Stick',
	'Baseball bat',
	'Cricket bat',
];

export const POLICE_RANKS = [
	'Constable',
	'Nayek',
	'Assistant Sub Inspector',
	'Sergeant',
	'Sub Inspector',
	'Inspector',
	'Assistant Superintendent of Police',
	'Senior Assistant Superintendent of Police',
	'Additional Superintendent of Police',
	'Superintendent of Police',
	'Additional Deputy Inspector General of Police',
	'Deputy Inspector General of Police',
	'Additional Inspector General of Police',
	'Inspector General of Police',
];

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
