module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^quiz/(.+)$': '<rootDir>/src/modules/quiz/$1/$1'
    },
    collectCoverageFrom: ['src/modules/**/*.js', '!src/modules/__utam__/**'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    }
};
