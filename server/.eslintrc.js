const path = require('path');

module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier', 'plugin:import/recommended', 'plugin:import/typescript'],
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['dist', 'tests', 'examples', 'experiment'],
	parserOptions: {
		project: [
			path.join(__dirname, './tsconfig.json'),
			path.join(__dirname, './seeder/tsconfig.json'),
		],
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	rules: {
		'no-await-in-loop': 'off',
		'import/prefer-default-export': 'off',
		'no-else-return': 'off',
		'one-var': 'off',
		'no-console': 'off',
		'import/extensions': 'off',
		'no-lonely-if': 'off',
	},
	overrides: [
		{
			files: ['./seeder/**/*.ts'],
			rules: {
				'import/no-unresolved': [
					2,
					{
						ignore: ['bupd-server'],
					},
				],
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
