import { Request, Response } from 'express';
import geminiService from '../services/gemini.services';
import twilioService from '../services/twilio.services';
import { Message } from '../models/message.model';
import { IncomingSMS } from '../types';

class SMSController {
  async handleIncomingMessage(req: Request, res: Response): Promise<void> {
    try {
      const { Body, From } = req.body as IncomingSMS;
      
      console.log(`Received message from ${From}: ${Body}`);
      
      // Generate AI response using Gemini
      const aiResponse = await geminiService.generateResponse(Body);
      
      // Send response back via SMS
      if (aiResponse.success) {
        await twilioService.sendSMS(From, aiResponse.content);
        
        // Log conversation to database
        await Message.create({
          phoneNumber: From,
          userMessage: Body,
          aiResponse: aiResponse.content
        });
      } else {
        // Send error message if AI generation failed
        await twilioService.sendSMS(From, "Sorry, I couldn't process your request. Please try again later.");
      }
      
      // Respond to Twilio with empty TwiML
      const twiml = twilioService.getTwimlResponse();
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml);
      
    } catch (error) {
      console.error('Error handling SMS:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}

export default new SMSController();