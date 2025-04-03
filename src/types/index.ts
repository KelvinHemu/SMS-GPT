// Request/Response types
export interface IncomingSMS {
    Body: string;
    From: string;
    To: string;
    MessageSid: string;
  }
  
  export interface SMSResponse {
    success: boolean;
    message?: string;
    error?: string;
  }
  
  // Service types
  export interface AIServiceResponse {
    content: string;
    success: boolean;
    error?: string;
  }
  
  export interface SMSServiceResponse {
    success: boolean;
    messageIds?: string[];
    error?: string;
  }
  
  // Message logging types
  export interface MessageLog {
    phoneNumber: string;
    userMessage: string;
    aiResponse: string;
    timestamp: Date;
  }