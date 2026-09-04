// SQL Schema & AI Config Type Definitions based on smfpphanx1sh_bot.sql

export interface KnowledgeBaseItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string;
  vector_array: number[]; // Serialized vector embedding (384 dimensions)
  sourceTable: 'knowledge_base';
}

export interface KnowledgeArticleItem {
  id: string;
  sourceId?: string;
  category: string;
  title: string;
  content: string;
  keywords: string;
  vector: number[]; // Serialized vector embedding
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sourceTable: 'knowledgearticle';
}

export type UnifiedKnowledgeItem = KnowledgeBaseItem | KnowledgeArticleItem;

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot' | 'admin';
  platform: 'web' | 'line' | 'admin';
  message: string;
  line_user_id: string;
  created_at: string;
  matchedScore?: number;
  matchedCategory?: string;
  aiModelUsed?: string;
}

export interface BroadcastLog {
  id: number;
  sender_id: number;
  sender_name: string;
  message: string;
  target_group: string;
  recipient_count: number;
  status: 'success' | 'pending' | 'failed';
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'superadmin' | 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface SQLTableSummary {
  tableName: string;
  includedInTraining: boolean;
  recordCount: number;
  purpose: string;
  statusNotes: string;
}

export type AIProvider = 'deepseek' | 'gemini' | 'groq' | 'openai';

export interface AIProviderConfig {
  activeProvider: AIProvider;
  deepseek: {
    model: string;
    apiKey: string;
  };
  gemini: {
    chatModel: string;
    embeddingModel: string;
    apiKey: string;
  };
  groq: {
    model: string;
    apiKey: string;
  };
  openai: {
    model: string;
    apiKey: string;
  };
  line: {
    channelSecret: string;
    accessToken: string;
    adminLineUserId: string;
  };
}
