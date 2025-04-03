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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const env_1 = require("../config/env");
class OpenAIService {
    constructor() {
        this.openai = new openai_1.OpenAI({
            apiKey: env_1.env.openAiApiKey,
        });
    }
    generateResponse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const completion = yield this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are SMS GPT, a helpful assistant for rural users with limited internet access. Provide short, clear, and helpful responses appropriate for SMS (keeping in mind character limits)."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 300 // Limit token count for SMS-friendly responses
                });
                const content = ((_a = completion.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || "No response generated";
                return {
                    content,
                    success: true
                };
            }
            catch (error) {
                console.error('Error generating AI response:', error);
                return {
                    content: "Sorry, I couldn't process your request. Please try again later.",
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
}
exports.default = new OpenAIService();
