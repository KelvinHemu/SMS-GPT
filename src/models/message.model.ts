import mongoose, { Document, Schema } from 'mongoose';
import { MessageLog } from '../types';

interface MessageDocument extends MessageLog, Document {}

const messageSchema = new Schema<MessageDocument>({
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

export const Message = mongoose.model<MessageDocument>('Message', messageSchema);