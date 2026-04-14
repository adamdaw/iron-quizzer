const { UtamWdioService } = require('wdio-utam-service');

exports.config = {
    runner: 'local',
    specs: ['./tests/**/*.spec.js'],
    maxInstances: 1,
    capabilities: [
        {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['-headless']
            }
        }
    ],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://localhost:8000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['geckodriver', [UtamWdioService, {}]],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};
