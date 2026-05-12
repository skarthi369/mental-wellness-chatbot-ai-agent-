export type Language = 'en' | 'ta' | 'hi';

export type EmotionType = 'calm' | 'happy' | 'sad' | 'anxious' | 'stressed' | 'hopeful' | 'neutral';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface EmotionAnalysis {
  primary: EmotionType;
  secondary?: EmotionType;
  confidence: number;
  indicators: string[];
  riskLevel?: RiskLevel;
  severityScore?: number;
  safeSuggestions?: string[];
  possibleConditions?: string[];
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-10
  factors: string[];
  suggestions: string[];
}

export interface MentalHealthReport {
  sessionSummary: string;
  modeUsed: string;
  emotions: EmotionAnalysis;
  risk: RiskAssessment;
  interventions: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: Language;
  analysis?: EmotionAnalysis;
}

export interface ConversationState {
  messages: Message[];
  currentLanguage: Language;
  isTyping: boolean;
  latestReport?: MentalHealthReport;
}
