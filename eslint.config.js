let customConfig = [];
let hasIgnoresFile = false;

try {
  require.resolve('./eslint.ignores.js');
  hasIgnoresFile = true;
} catch {
  // eslint.ignores.js doesn't exist
}

if (hasIgnoresFile) {
  const ignores = require('./eslint.ignores.js');
  customConfig = [{ignores}];
}

module.exports = [
  ...customConfig,
  ...require('gts'),
  {
    plugins: {
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
    },
    rules: {
      'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 1}],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: 'return', next: '*'},
      ],

      // Comma spacing
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      // Trailing commas
      'comma-dangle': ['error', 'always-multiline'],

      // Space before blocks
      'space-before-blocks': ['error', 'always'],

      // 2-space indentation
      indent: ['error', 2],

      // Single quotes
      quotes: ['error', 'single'],

      // Semicolons required
      semi: ['error', 'always'],

      // Ignore unused variables starting with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // No trailing whitespace
      'no-trailing-spaces': 'error',
    },
  },
];
