export interface ChatModel {
  at: number;
  content: string;
  role: 'user' | 'assistant' | 'system'
}
