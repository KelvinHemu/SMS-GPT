"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var env_1 = require("./config/env");
var database_1 = require("./config/database");
// Connect to MongoDB
(0, database_1.connectDB)().catch(console.error);
// Start server
var server = app_1.default.listen(env_1.env.port, function () {
    console.log("SMS GPT server listening on port ".concat(env_1.env.port, " in ").concat(env_1.env.nodeEnv, " mode"));
});
// Handle graceful shutdown
process.on('SIGTERM', function () {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(function () {
        console.log('HTTP server closed');
    });
});
