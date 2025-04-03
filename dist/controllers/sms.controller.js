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
const openai_services_1 = __importDefault(require("../services/openai.services"));
const twilio_services_1 = __importDefault(require("../services/twilio.services"));
const message_model_1 = require("../models/message.model");
class SMSController {
    handleIncomingMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Body, From } = req.body;
                console.log(`Received message from ${From}: ${Body}`);
                // Generate AI response
                const aiResponse = yield openai_services_1.default.generateResponse(Body);
                // Send response back via SMS
                if (aiResponse.success) {
                    yield twilio_services_1.default.sendSMS(From, aiResponse.content);
                    // Log conversation to database
                    yield message_model_1.Message.create({
                        phoneNumber: From,
                        userMessage: Body,
                        aiResponse: aiResponse.content
                    });
                }
                else {
                    // Send error message if AI generation failed
                    yield twilio_services_1.default.sendSMS(From, "Sorry, I couldn't process your request. Please try again later.");
                }
                // Respond to Twilio with empty TwiML
                const twiml = twilio_services_1.default.getTwimlResponse();
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml);
            }
            catch (error) {
                console.error('Error handling SMS:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
}
exports.default = new SMSController();
