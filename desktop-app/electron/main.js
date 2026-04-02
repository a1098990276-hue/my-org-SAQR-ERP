// Advanced Electron+API implementation

// Authentication module
const auth = require('./auth');

// Permissions module
const permissions = require('./permissions');

// Invoices module
const invoices = require('./invoices');

// Reports module
const reports = require('./reports');

// Sync module
const sync = require('./sync');

// Initialize application
function initApp() {
    auth.init();
    permissions.setup();
    invoices.load();
    reports.generate();
    sync.start();
}

// Start the application
initApp();
