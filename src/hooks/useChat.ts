import { useState, useCallback, useEffect } from 'react';
import { Message, Language, MentalHealthReport, ConversationState, EmotionAnalysis } from '@/types/chat';
import { generateResponse, generateReport, getWelcomeMessage } from '@/services/mockAIService';
import { generateAIResponse } from '@/services/openRouterService';
import { getTherapyTrigger, TherapyTrigger, shouldSuggestAgain } from '@/lib/emotionTriggers';

export interface ChatState extends ConversationState {
  lastTherapyTrigger?: TherapyTrigger;
  lastTriggerIndex?: number;
}

export function useChat(apiKey?: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    currentLanguage: 'en',
    isTyping: false,
    latestReport: undefined,
    lastTherapyTrigger: 'none',
    lastTriggerIndex: -1,
  });

  // Add welcome message on mount or language change
  useEffect(() => {
    // Only add welcome message if the conversation is empty
    if (state.messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getWelcomeMessage(state.currentLanguage),
        timestamp: new Date(),
        language: state.currentLanguage,
      };
      setState(prev => ({ ...prev, messages: [welcomeMessage] }));
    }
  }, [state.currentLanguage, state.messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      language: state.currentLanguage,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      let response: string;
      let analysis: EmotionAnalysis;

      // Use real AI if API key is available, otherwise use mock
      if (apiKey) {
        const aiResult = await generateAIResponse(
          content,
          state.messages,
          state.currentLanguage,
          apiKey
        );
        response = aiResult.response;
        analysis = aiResult.analysis;
      } else {
        const mockResult = await generateResponse(
          content,
          state.messages,
          state.currentLanguage
        );
        response = mockResult.response;
        analysis = mockResult.analysis;
      }
      const updatedUserMessage = { ...userMessage, analysis };

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language: state.currentLanguage,
      };

      // Build the complete updated messages array
      const updatedMessages = [...state.messages, updatedUserMessage, assistantMessage];

      // Determine if therapy should be triggered based on emotion analysis
      const emotionDetected = updatedUserMessage.analysis?.primary;
      const riskLevel = updatedUserMessage.analysis?.riskLevel;
      const userMessageCount = updatedMessages.filter(m => m.role === 'user').length;
      
      let newTrigger: TherapyTrigger = 'none';
      if (emotionDetected) {
        const triggerConfig = getTherapyTrigger(emotionDetected, riskLevel, userMessageCount);
        
        // Check if enough messages have passed since last suggestion
        const canSuggestAgain = shouldSuggestAgain(
          triggerConfig.trigger,
          updatedMessages.length,
          state.lastTriggerIndex || -1
        );

        if (canSuggestAgain && triggerConfig.auto) {
          newTrigger = triggerConfig.trigger;
          console.log('[Emotion Trigger]', emotionDetected, '→', newTrigger, 'Risk:', riskLevel);
        }
      }

      // Single state update with everything
      setState(prev => ({
        ...prev,
        messages: updatedMessages,
        isTyping: false,
        lastTherapyTrigger: newTrigger,
        lastTriggerIndex: updatedMessages.length - 1,
      }));

      // Generate report after a few exchanges
      if (updatedMessages.filter(m => m.role === 'user').length >= 2) {
        const report = await generateReport(updatedMessages);
        setState(prev => ({ ...prev, latestReport: report }));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setState(prev => ({ ...prev, isTyping: false }));
    }
  }, [state.messages, state.currentLanguage, state.lastTriggerIndex, apiKey]);

  const setLanguage = useCallback((language: Language) => {
    setState(prev => ({ ...prev, currentLanguage: language }));
  }, []);

  const refreshReport = useCallback(async () => {
    if (state.messages.length > 2) {
      const report = await generateReport(state.messages);
      setState(prev => ({ ...prev, latestReport: report }));
    }
  }, [state.messages]);

  return {
    messages: state.messages,
    currentLanguage: state.currentLanguage,
    isTyping: state.isTyping,
    latestReport: state.latestReport,
    lastTherapyTrigger: state.lastTherapyTrigger,
    sendMessage,
    setLanguage,
    refreshReport,
  };
}
