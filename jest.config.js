/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.app.json',
            useESM: true,
        }],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    globals: {
        'import.meta': {
            env: {
                VITE_GITHUB_TOKEN: '',
            },
        },
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
