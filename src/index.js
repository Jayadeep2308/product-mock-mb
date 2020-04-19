const mb = require('mountebank');
const settings = require('./settings');
const healthCheckService = require('./health-check-service');
const productMockService = require('./product-mock-service');

const mbServerInstance = mb.create({
    port: settings.port,
    pidfile: '../mb.pid',
    logfile: '../mb.log',
    protofile: '../protofile.json',
    ipWhitelist: ['*']
});

mbServerInstance.then(function () {
    healthCheckService.injectMock();
    productMockService.injectMock();
});