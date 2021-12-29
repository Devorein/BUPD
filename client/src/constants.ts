import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';
import { TCasefilePriority, TCasefileStatus } from '@shared';

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
