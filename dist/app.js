"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sms_controller_1 = __importDefault(require("./controllers/sms.controller"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Routes
app.post('/sms', sms_controller_1.default.handleIncomingMessage);
// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('SMS GPT Service is running');
});
// Error handling middleware (should be after all routes)
app.use(error_middleware_1.errorHandler);
exports.default = app;
