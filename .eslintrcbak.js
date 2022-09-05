module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'next',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['.next/*', '.eslintrc.js', 'next.config.js', '*.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {},
    },
  },
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'prettier/prettier': 'error',
    'react/forbid-prop-types': [
      1,
      { forbid: [''], checkContextTypes: false, checkChildContextTypes: false },
    ],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'react/destructuring-assignment': [1, 'always', { ignoreClassFields: false }],
    'react/react-in-jsx-scope': 0,
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 1,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        tsx: 'never',
        ts: 'never',
        // json: 'never',
      },
    ],
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        // NOTE: If this error triggers, either disable it or add
        // your custom components, labels and attributes via these options
        // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        controlComponents: ['Input'],
      },
    ],
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-unused-vars': 0,
    'no-use-before-define': 0,
    'prefer-template': 2,
    // 'react/destructuring-assignment': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-closing-tag-location': 0,
    // 'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    // 'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    // 'redux-saga/no-yield-in-race': 2,
    // 'redux-saga/yield-effects': 2,
    'require-yield': 0,
    'no-shadow': 'off',
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-curly-newline': 0,
    // indent: ['error', 2],
    'react/prop-types': [0],

    // '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { classes: false, functions: false, variables: false },
    ],
    'object-curly-newline': 'off',
    '@typescript-eslint/semi': [0],
    'operator-linebreak': 'off',
    '@typescript-eslint/no-unused-vars': 0,
    // '@typescript-eslint/no-unused-vars-experimental': 1,
    // '@typescript-eslint/no-unused-vars': ['error'],
    '@next/next/no-html-link-for-pages': 0,
  },
  // overrides: [
  //   {
  //     files: ['**/*.ts', '**/*.tsx'],
  //     rules: {
  //       camelcase: ['off'],
  //     },
  //   },
  // ],
}