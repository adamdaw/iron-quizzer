const lwcRecommended = require('@salesforce/eslint-config-lwc/recommended');

module.exports = [
    ...lwcRecommended,
    {
        rules: {
            '@lwc/lwc/no-async-operation': 'warn',
            '@lwc/lwc/no-inner-html': 'warn',
            '@lwc/lwc/no-document-query': 'warn'
        }
    },
    {
        files: ['**/__tests__/**/*.js', '**/*.spec.js'],
        rules: {
            'no-await-in-loop': 'off'
        }
    },
    {
        ignores: ['dist/', 'lib/']
    }
];
