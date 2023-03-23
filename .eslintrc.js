module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': [
			//or whatever plugin that is causing the clash
			'error',
			{
				useTabs: true,
			},
		],
		"padding-line-between-statements": [
			"error",

			// After directives (like 'use-strict'), except between directives
			{ "blankLine": "always", "prev": "directive", "next": "*" },
			{ "blankLine": "any", "prev": "directive", "next": "directive" },

			// After imports, except between imports
			{ "blankLine": "always", "prev": "import", "next": "*" },
			{ "blankLine": "any", "prev": "import", "next": "import" },

			// Before and after every sequence of variable declarations
			{ "blankLine": "always", "prev": "*", "next": ["const", "let", "var"] },
			{ "blankLine": "always", "prev": ["const", "let", "var"], "next": "*" },
			{ "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"] },

			// Before and after class declaration, if, while, switch, try
			{ "blankLine": "always", "prev": "*", "next": ["class", "if", "while", "switch", "try"] },
			{ "blankLine": "always", "prev": ["class", "if", "while", "switch", "try"], "next": "*" },

			// Before return statements
			{ "blankLine": "always", "prev": "*", "next": "return" }
		],
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				"checksVoidReturn": false
			}
		],
		"@typescript-eslint/unbound-method": "off",
		"@typescript-eslint/explicit-member-accessibility": "error",
		"@typescript-eslint/naming-convention": "error",
		"@typescript-eslint/lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }]
	},
};
