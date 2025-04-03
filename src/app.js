"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var sms_controller_1 = require("./controllers/sms.controller");
var error_middleware_1 = require("./middleware/error.middleware");
var app = express();
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Routes
app.post('/sms', sms_controller_1.default.handleIncomingMessage);
// Simple health check endpoint
app.get('/', function (req, res) {
    res.send('SMS GPT Service is running');
});
// Error handling middleware (should be after all routes)
app.use(error_middleware_1.errorHandler);
exports.default = app;
