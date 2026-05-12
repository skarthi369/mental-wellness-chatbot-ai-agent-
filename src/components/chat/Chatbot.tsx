import { useState, useRef, useEffect } from 'react';
import { Message, Language, EmotionAnalysis } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ReportPanel } from './ReportPanel';
import { SettingsDialog } from './SettingsDialog';
import { BreathingExercise } from './BreathingExercise';
import { GuidedMeditation } from './GuidedMeditation';
import { CrisisResources } from './CrisisResources';
import { DailyAffirmation } from './DailyAffirmation';
import { TherapySuggestionBanner } from './TherapySuggestionBanner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/services/chatService';
import { Persona } from '@/lib/prompts';
import { getWelcomeMessage, generateReport } from '@/services/mockAIService';
import { getTherapyTrigger, TherapyTrigger, shouldSuggestAgain } from '@/lib/emotionTriggers';

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState<Persona>('doctor');
  const [latestReport, setLatestReport] = useState<any>();
  const [lastTherapyTrigger, setLastTherapyTrigger] = useState<TherapyTrigger>('none');
  const [lastTriggerIndex, setLastTriggerIndex] = useState(-1);
  
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isAffirmationOpen, setIsAffirmationOpen] = useState(false);
  const [showTherapySuggestion, setShowTherapySuggestion] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getWelcomeMessage(currentLanguage),
        timestamp: new Date(),
        language: currentLanguage,
      };
      setMessages([welcome]);
    }
  }, [currentLanguage]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const assistantMsgId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages(prev => [...prev, assistantMessage]);

    let fullResponse = '';
    try {
      const stream = chatService.sendMessageStreaming(content, messages, currentLanguage, persona);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: fullResponse } : m
        ));
      }

      // Finalize the message (parse JSON if model returned structured data)
      const parsed = chatService.parseJsonFields(fullResponse);
      const { message: finalContent, analysis } = parsed;

      const finalizedAssistantMessage: Message = {
        ...assistantMessage,
        content: finalContent,
        analysis,
      };

      setMessages(prev => {
        const updated = prev.map(m => m.id === assistantMsgId ? finalizedAssistantMessage : m);
        
        // Handle therapy triggers based on analysis
        if (analysis) {
          const emotionDetected = analysis.primary;
          const riskLevel = analysis.riskLevel;
          const userMessageCount = updated.filter(m => m.role === 'user').length;
          
          const triggerConfig = getTherapyTrigger(emotionDetected, riskLevel, userMessageCount);
          const canSuggestAgain = shouldSuggestAgain(
            triggerConfig.trigger,
            updated.length,
            lastTriggerIndex
          );

          if (canSuggestAgain && triggerConfig.auto) {
            setLastTherapyTrigger(triggerConfig.trigger);
            setLastTriggerIndex(updated.length - 1);
            setShowTherapySuggestion(true);
          }
        }
        
        return updated;
      });

      setIsTyping(false);

      // Generate report if enough messages
      const updatedMessages = [...messages, userMessage, finalizedAssistantMessage];
      const userMsgsCount = updatedMessages.filter(m => m.role === 'user').length;
      
      if (userMsgsCount >= 2) {
        const report = await generateReport(updatedMessages);
        setLatestReport(report);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, content: "I'm sorry, I'm having trouble connecting to my brain right now. Please make sure Ollama is running." } : m
      ));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-calm dark:bg-gradient-dark max-w-full overflow-hidden">
      <ChatHeader
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
        messageCount={messages.filter(m => m.role === 'user').length}
        hasApiKey={true} // For Ollama we assume it's "configured"
        persona={persona}
        onPersonaChange={setPersona}
        onOpenAffirmation={() => setIsAffirmationOpen(true)}
      />

      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && messages[messages.length - 1].content === '' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          placeholder={
            currentLanguage === 'ta'
              ? 'உங்கள் மனதில் என்ன இருக்கிறது?'
              : currentLanguage === 'hi'
              ? 'आपके मन में क्या है?'
              : "What's on your mind?"
          }
          onOpenCrisisResources={() => setIsCrisisOpen(true)}
        />
      </main>

      {/* Overlays */}
      <ReportPanel
        report={latestReport}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={""} // Not used for Ollama in this context, but required by component
        onSaveApiKey={() => {}}
        onClearApiKey={() => {}}
      />

      <BreathingExercise
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      <GuidedMeditation
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
      />

      <CrisisResources
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />

      <DailyAffirmation
        isOpen={isAffirmationOpen}
        onClose={() => setIsAffirmationOpen(false)}
        language={currentLanguage}
      />

      {showTherapySuggestion && lastTherapyTrigger !== 'none' && (
        <TherapySuggestionBanner
          trigger={lastTherapyTrigger}
          language={currentLanguage}
          onAccept={() => {
            setShowTherapySuggestion(false);
            if (lastTherapyTrigger === 'breathing') setIsBreathingOpen(true);
            if (lastTherapyTrigger === 'meditation') setIsMeditationOpen(true);
          }}
          onDismiss={() => setShowTherapySuggestion(false)}
        />
      )}
    </div>
  );
}
