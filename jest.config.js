module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^quiz/(.+)$': '<rootDir>/src/modules/quiz/$1/$1'
    }
};
