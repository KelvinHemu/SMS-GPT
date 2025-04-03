import { GoogleGenAI, Content } from "@google/genai"; // Google's AI SDK for Gemini API
import { env } from '../config/env'; // My env config file where I store API keys
import { AIServiceResponse } from '../types'; // My custom type for AI responses

// Extending my base AIServiceResponse to include history tracking
export interface AIServiceResponseWithHistory extends AIServiceResponse {
  newHistoryEntry?: Content; // The AI's response to add to conversation history
}

// My initial setup for how the AI should behave - like a warm SMS assistant
const INITIAL_PERSONA_HISTORY: Content[] = [
  {
    role: "user",
    parts: [{ text: "You are SMS GPT, an AI assistant accessed via SMS. Respond concisely and clearly, suitable for text messages. Assume users have limited internet. Start conversations warmly." }]
  },
  {
    role: "model",
    parts: [{ text: "Hello! I'm SMS GPT, ready to help via SMS. How can I assist you today?" }]
  }
];

class GeminiService {
  private genAI: GoogleGenAI; // My instance of Google's AI client
  private modelName: string = "gemini-2.0-flash"; // The specific Gemini model I’m using

  constructor() {
    // Make sure I’ve set the API key in my env file, or this won’t work
    if (!env.googleApiKey) {
      throw new Error("Google API Key is missing. Please set it in the environment variables.");
    }
    // Set up the Google AI client with my API key
    this.genAI = new GoogleGenAI({ apiKey: env.googleApiKey });
  }

  /**
   * Generates an AI response for a user’s SMS message, using their convo history
   * @param message The text the user sent me via SMS
   * @param history Previous messages in this convo (user/model pairs), defaults to empty
   * @returns My custom response object with the AI’s answer and history entry
   */
  async generateResponse(
    message: string,
    history: Content[] = []
  ): Promise<AIServiceResponseWithHistory> {
    try {
      // Build the full convo context: my persona setup + user’s history + new message
      const fullConversationHistory: Content[] = [
        ...INITIAL_PERSONA_HISTORY, // Start with my assistant’s personality
        ...history,                // Add whatever’s already happened in this convo
        { role: "user", parts: [{ text: message }] } // Tack on the user’s latest SMS
      ];

      // Hit up the Gemini API with my request
      const result = await this.genAI.models.generateContent({
        model: this.modelName, // Which model I’m using
        contents: fullConversationHistory, // The whole convo to process
        config: { // My settings for how the AI responds
          maxOutputTokens: 300, // Don’t let it ramble past 300 tokens
          temperature: 0.7,    // Keep it creative but not too wild
        }
      });

      // Grab the AI’s response text, or use a fallback if it’s empty
      const responseText = result.text;
      const content = responseText?.trim() || "I received your message, but I couldn't generate a specific response.";

      // Package up the AI’s response to save in history later
      const newModelHistoryEntry: Content = { 
        role: 'model', 
        parts: [{ text: content }] 
      };

      // Send back a success response with the AI’s answer and history entry
      return {
        content, // What I’ll send back via SMS
        newHistoryEntry: newModelHistoryEntry, // For tracking this convo
        success: true
      };

    } catch (error: unknown) {
      // Something went wrong - log it so I can debug later
      console.error('Error generating AI response with Gemini:', error);

      // Figure out what to tell the user based on the error
      let errorMessage = 'An unknown error occurred while contacting the AI service.';
      if (error instanceof Error) {
        errorMessage = error.message; // Use the error’s message if it’s an Error object
      } else if (typeof error === 'string') {
        errorMessage = error; // Or just the string if that’s what I got
      }

      // Send back a failure response so the user knows something’s up
      return {
        content: "Sorry, I encountered a problem processing your request. Please try again in a moment.",
        success: false,
        error: errorMessage // Stash the details for my own troubleshooting
      };
    }
  }
}

// Export one instance so I can reuse it everywhere without making new ones
export default new GeminiService();