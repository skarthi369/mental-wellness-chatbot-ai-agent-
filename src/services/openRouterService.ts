import { Message, Language, EmotionAnalysis } from '@/types/chat';
import { getSystemPrompt } from '@/lib/prompts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-3-flash-preview';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: Message[],
  language: Language,
  apiKey: string
): Promise<{ response: string; analysis: EmotionAnalysis }> {
  // Build messages array
  const messages: ConversationMessage[] = [
    { role: 'system', content: getSystemPrompt(language) },
  ];

  // Add conversation history
  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'MindfulChat - Mental Health Companion',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    const assistantContent = result.choices[0].message.content;

    try {
      const parsed = JSON.parse(assistantContent);

      // Map JSON analysis to EmotionAnalysis type
      const analysis: EmotionAnalysis = {
        primary: (parsed.analysis?.primary_emotion as EmotionAnalysis['primary']) || 'neutral',
        confidence: 0.9,
        indicators: parsed.analysis?.emotions || [],
        riskLevel: parsed.analysis?.risk_level as EmotionAnalysis['riskLevel'],
        severityScore: parsed.analysis?.severity_score,
        safeSuggestions: parsed.analysis?.safe_suggestions,
        possibleConditions: parsed.analysis?.possible_conditions,
      };

      return {
        response: parsed.message,
        analysis,
      };
    } catch (parseError) {
      console.warn('Failed to parse AI JSON response, falling back to regex/text extraction:', parseError);

      // Fallback: If it's not JSON, it might just be the message text
      return {
        response: assistantContent,
        analysis: analyzeEmotionFromContext(userMessage),
      };
    }
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
}

// Simple client-side emotion analysis (fallback)
function analyzeEmotionFromContext(text: string): EmotionAnalysis {
  const lowerText = text.toLowerCase();

  const emotionPatterns: Record<string, string[]> = {
    anxious: ['anxious', 'worried', 'nervous', 'panic', 'stress', 'overwhelm', 'fear'],
    sad: ['sad', 'depressed', 'down', 'hopeless', 'lonely', 'cry', 'grief', 'loss'],
    stressed: ['stressed', 'pressure', 'burden', 'exhausted', 'burned out'],
    happy: ['happy', 'great', 'wonderful', 'excited', 'grateful', 'joy', 'good'],
    calm: ['calm', 'peaceful', 'relaxed', 'content', 'okay', 'fine'],
    hopeful: ['hopeful', 'better', 'optimistic', 'looking forward'],
  };

  let primary: EmotionAnalysis['primary'] = 'neutral';
  let maxMatches = 0;
  const indicators: string[] = [];

  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    const matches = patterns.filter(p => lowerText.includes(p));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      primary = emotion as EmotionAnalysis['primary'];
      indicators.push(...matches);
    }
  }

  return {
    primary,
    confidence: maxMatches > 0 ? Math.min(0.5 + maxMatches * 0.15, 0.95) : 0.3,
    indicators: indicators.slice(0, 3),
  };
}
