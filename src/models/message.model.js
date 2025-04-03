"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
        index: true
    },
    userMessage: {
        type: String,
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
exports.Message = mongoose_1.default.model('Message', messageSchema);
