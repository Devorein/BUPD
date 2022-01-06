import { blue, grey, red } from '@mui/material/colors';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export function generateTheme() {
	const text: {
		primary: string;
		secondary: string;
	} = {
		primary: grey[900],
		secondary: grey[800],
	};

	text.primary = grey[900];
	text.secondary = grey[700];

	const themeOptions: ThemeOptions = {
		palette: {
			error: {
				main: red[500],
			},
			text: {
				primary: text.primary,
				secondary: text.secondary,
			},
			background: {
				default: grey[200],
			},
			primary: {
				main: grey[900],
			},
			secondary: {
				main: blue[900],
			},
		},
		typography: {
			fontFamily: 'Rubik, sans-serif',
			fontSize: 14,
			body1: {
				fontWeight: 400,
				fontSize: '1em',
			},
			body2: {
				fontWeight: 400,
				fontSize: '0.85em',
			},
			subtitle1: {
				fontSize: '1em',
				fontWeight: 400,
				color: text.secondary,
			},
			subtitle2: {
				fontSize: '0.85em',
				fontWeight: 300,
				color: text.secondary,
			},
			h3: {
				fontWeight: 900,
			},
			h4: {
				fontWeight: 800,
			},
			h5: {
				fontSize: '1.75em',
				fontWeight: 700,
			},
			h6: {
				fontSize: '1.25em',
				fontWeight: 600,
			},
			caption: {
				fontSize: '1em',
				fontWeight: 700,
			},
		},
		components: {
			MuiList: {
				styleOverrides: {
					root: {
						'&.MuiMenu-list': {
							padding: 0,
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					input: {
						padding: 10,
					},
					root: {
						'&.MuiInputBase-multiline': {
							padding: 0,
						},
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 0,
					},
				},
			},
			MuiFormHelperText: {
				styleOverrides: {
					root: {
						'&.Mui-error': {
							fontWeight: 600,
							margin: 0,
							fontSize: '0.857rem',
							lineHeight: '1.25rem',
						},
					},
				},
			},
			MuiTab: {
				styleOverrides: {
					textColorPrimary: {
						'&.MuiButtonBase-root.Mui-selected': {
							color: 'white',
							backgroundColor: grey[900],
							fontWeight: 600,
						},
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&.Mui-selected,&.Mui-selected:hover': {
							backgroundColor: blue[900],
							color: 'white',
							fontWeight: 500,
						},
						'&:hover': {
							backgroundColor: grey[900],
							color: 'white',
						},
					},
				},
			},
			MuiCheckbox: {
				styleOverrides: {
					root: {
						padding: 0,
						marginRight: '5px',
					},
				},
			},
		},
	};

	return createTheme(themeOptions);
}
