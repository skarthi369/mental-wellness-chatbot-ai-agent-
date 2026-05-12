import { Message, Language, EmotionAnalysis } from '@/types/chat';
import { getSystemPrompt, Persona } from '@/lib/prompts';

const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma4:e2b';

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface ChatServiceResult {
  response: string;
  analysis: EmotionAnalysis;
}

export const chatService = {
  async *sendMessageStreaming(
    content: string,
    history: Message[],
    language: Language,
    persona: Persona = 'doctor'
  ): AsyncGenerator<string> {
    const systemPrompt = getSystemPrompt(language, persona);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content }
    ];

    try {
      const url = `${OLLAMA_API_URL}/api/chat`;
      console.log('[Ollama Service] Sending request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages,
          stream: true,
          options: {
            temperature: 0.7,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Ollama Service] HTTP Error:', response.status, errorText);
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const json = JSON.parse(line) as OllamaChatResponse;
            if (json.message?.content) {
              yield json.message.content;
            }
          } catch (e) {
            console.error('[Ollama Service] Error parsing stream chunk:', e);
          }
        }
      }
    } catch (error) {
      console.error('[Ollama Service] Connection Error:', error);
      throw error;
    }
  },

  parseJsonFields(text: string): { message: string, analysis: EmotionAnalysis } {
    try {
      // 1. Clean up potential markdown stuff around the JSON
      let cleaned = text.trim();
      
      // If the model wrapped it in code blocks ```json ... ``` or ``` ... ```
      const markdownJsonMatch = cleaned.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (markdownJsonMatch) {
        cleaned = markdownJsonMatch[1];
      } else {
        // If it's just raw JSON but maybe has some text before/after
        const curlyMatch = cleaned.match(/\{[\s\S]*\}/);
        if (curlyMatch) {
          cleaned = curlyMatch[0];
        }
      }

      const parsed = JSON.parse(cleaned);

      return {
        message: parsed.message || 'I hear you. Could you tell me more?',
        analysis: {
          primary: (parsed.analysis?.primary_emotion as EmotionAnalysis['primary']) || 'neutral',
          confidence: 0.9,
          indicators: parsed.analysis?.emotions || [],
          riskLevel: parsed.analysis?.risk_level || 'low',
          severityScore: parsed.analysis?.severity_score || 0,
          safeSuggestions: parsed.analysis?.safe_suggestions || [],
          possibleConditions: parsed.analysis?.possible_conditions || [],
        }
      };
    } catch (e) {
      console.warn('[Ollama Service] Failed to parse model response as JSON, using raw text:', e);
      
      // Fallback: If it's not JSON, it might just be the message text.
      // We still try to filter out bits of JSON if they leaked into the text.
      let filteredText = text.replace(/\{[\s\S]*\}/g, '').trim();
      if (!filteredText) filteredText = text.trim();

      return {
        message: filteredText,
        analysis: {
          primary: 'neutral',
          confidence: 0.1,
          indicators: [],
          riskLevel: 'low',
          severityScore: 0,
        }
      };
    }
  }
};
