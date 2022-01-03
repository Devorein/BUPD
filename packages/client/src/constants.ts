import { IAccessSort, IPoliceSort, TCasefilePriority, TCasefileStatus } from '@bupd/types';
import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000/v1';
export const JWT_LS_KEY = 'bupd.jwt.token';
export const CRIME_CATEGORIES = ['Murder', 'Robbery', 'Assault', 'Arson', 'Burglary', 'Theft'];
export const CASEFILE_PRIORITIES: TCasefilePriority[] = ['high', 'low', 'medium'];
export const CASEFILE_STATUSES: TCasefileStatus[] = ['open', 'closed', 'solved'];
export const CASEFILE_WEAPONS: TCasefileStatus[] = ['open', 'closed', 'solved'];
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

export const svgIconSx: SxProps<Theme> = {
	'&': {
		transition: 'transform 150ms ease-in-out',
	},
	'&:hover': {
		transform: `scale(1.25)`,
		transition: 'transform 150ms ease-in-out',
	},
};

export const accessSortLabelRecord: Record<`${IAccessSort[0]}.${IAccessSort[1]}`, string> = {
	'approved.-1': 'Unapproved first',
	'approved.1': 'Disapproved first',
	'case_no.-1': 'Case first',
	'criminal_id.-1': 'Criminal first',
	'permission.-1': 'Permission desc',
	'permission.1': 'Permission asc',
} as any;

export const policeSortLabelRecord: Record<`${IPoliceSort[0]}.${IPoliceSort[1]}`, string> = {
	'designation.-1': 'Designation desc',
	'designation.1': 'Designation asc',
	'name.-1': 'Name desc',
	'name.1': 'Name asc',
	'rank.-1': 'Rank desc',
	'rank.1': 'Rank asc',
};
