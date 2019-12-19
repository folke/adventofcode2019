module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    env: {
        node: true,
        browser: true,
        jest: true
    },
    plugins: ['@typescript-eslint', 'prettier', 'jest'],
    parserOptions: {
        ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        },
        project: './tsconfig.json',
        impliedStrict: true
    },
    rules: {
        'prettier/prettier': 'warn',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        '@typescript-eslint/explicit-function-return-type': 'off'
    }
}
