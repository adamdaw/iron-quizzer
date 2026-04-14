module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^quiz/(.+)$': '<rootDir>/src/modules/quiz/$1/$1'
    },
    collectCoverageFrom: ['src/modules/**/*.js', '!src/modules/__utam__/**'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
