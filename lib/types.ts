export interface ChatbotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  error?: string;
  details?: string;
}

export interface ChatbotRequest {
  message: string;
  timestamp?: string;
  source?: string;
}