"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const env_1 = require("../config/env");
class TwilioService {
    constructor() {
        this.MAX_SMS_LENGTH = 160;
        this.client = new twilio_1.default.Twilio(env_1.env.twilioAccountSid, env_1.env.twilioAuthToken);
        this.phoneNumber = env_1.env.twilioPhoneNumber;
    }
    sendSMS(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Split long messages into multiple SMS if needed
                const messages = this.splitLongMessage(message);
                const messageIds = [];
                for (const msgPart of messages) {
                    const response = yield this.client.messages.create({
                        body: msgPart,
                        from: this.phoneNumber,
                        to: to
                    });
                    messageIds.push(response.sid);
                }
                return {
                    success: true,
                    messageIds
                };
            }
            catch (error) {
                console.error('Error sending SMS:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    // Split messages longer than 160 characters
    splitLongMessage(message) {
        if (message.length <= this.MAX_SMS_LENGTH) {
            return [message];
        }
        const messages = [];
        let currentIndex = 0;
        while (currentIndex < message.length) {
            // Find a good break point (space character)
            let endIndex = Math.min(currentIndex + this.MAX_SMS_LENGTH, message.length);
            if (endIndex < message.length) {
                // Look for the last space character within the limit
                const lastSpaceIndex = message.lastIndexOf(' ', endIndex);
                if (lastSpaceIndex > currentIndex) {
                    endIndex = lastSpaceIndex;
                }
            }
            messages.push(message.substring(currentIndex, endIndex));
            currentIndex = endIndex + 1;
        }
        return messages;
    }
    // For Twilio webhook responses
    getTwimlResponse() {
        const MessagingResponse = twilio_1.default.twiml.MessagingResponse;
        const twiml = new MessagingResponse();
        return twiml.toString();
    }
}
exports.default = new TwilioService();
