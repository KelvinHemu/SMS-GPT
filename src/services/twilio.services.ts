import twilio from 'twilio';
import { env } from '../config/env';
import { SMSServiceResponse } from '../types';

class TwilioService {
  private client: twilio.Twilio;
  private phoneNumber: string;
  private readonly MAX_SMS_LENGTH = 160;

  constructor() {
    this.client = new twilio.Twilio(
      env.twilioAccountSid,
      env.twilioAuthToken
    );
    this.phoneNumber = env.twilioPhoneNumber;
  }

  async sendSMS(to: string, message: string): Promise<SMSServiceResponse> {
    try {
      // Split long messages into multiple SMS if needed
      const messages = this.splitLongMessage(message);
      const messageIds: string[] = [];
      
      for (const msgPart of messages) {
        const response = await this.client.messages.create({
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
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Split messages longer than 160 characters
  private splitLongMessage(message: string): string[] {
    if (message.length <= this.MAX_SMS_LENGTH) {
      return [message];
    }

    const messages: string[] = [];
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
  getTwimlResponse(): string {
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    return twiml.toString();
  }
}

export default new TwilioService();