module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
        // "oclif",
        // "oclif-typescript"
    ],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    rules: {
        'prettier/prettier': 'error',
        'lines-between-class-members': [
            'error',
            'always',
            { exceptAfterSingleLine: true }
        ],
        '@typescript-eslint/explicit-function-return-type': 'off'
    }
}
