import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(__dirname, '../../.env') });

interface Environment {
  nodeEnv: string;
  port: number;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  googleApiKey: string;
  mongodbUri: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'GOOGLE_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
}

export const env: Environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID!,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN!,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER!,
  googleApiKey: process.env.GOOGLE_API_KEY!,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sms-gpt'
};