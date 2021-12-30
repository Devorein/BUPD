const path = require('path');
const eslintConfig = require('../../.eslintrc');

eslintConfig.parserOptions.project = [path.join(__dirname, './tsconfig.json')];

module.exports = eslintConfig;
