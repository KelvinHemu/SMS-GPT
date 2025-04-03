"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
// Connect to MongoDB
(0, database_1.connectDB)().catch(console.error);
// Start server
const server = app_1.default.listen(env_1.env.port, () => {
    console.log(`SMS GPT server listening on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
});
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
