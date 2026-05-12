import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Bot, User, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { EmotionBadge } from './EmotionBadge';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isThisMessageSpeaking, setIsThisMessageSpeaking] = useState(false);
  
  const { speak, stop, pause, resume, isSpeaking, isPaused, isSupported } = useTextToSpeech({
    rate: 0.95,
    pitch: 1,
  });

  // Track if this specific message is the one being spoken
  useEffect(() => {
    if (!isSpeaking) {
      setIsThisMessageSpeaking(false);
    }
  }, [isSpeaking]);

  const handleSpeak = () => {
    if (isThisMessageSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      // Stop any other message and start this one
      stop();
      setIsThisMessageSpeaking(true);
      speak(message.content);
    }
  };

  const handleStop = () => {
    stop();
    setIsThisMessageSpeaking(false);
  };

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in-up group',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-primary/20 to-accent text-primary'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-soft relative',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-card text-card-foreground rounded-tl-md border border-border/50'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        {/* Show emotion badge for user messages */}
        {isUser && message.analysis && (
          <div className="mt-2 pt-2 border-t border-primary-foreground/20">
            <EmotionBadge emotion={message.analysis.primary} size="sm" />
          </div>
        )}

        {/* Footer with timestamp and TTS */}
        <div className={cn(
          'flex items-center gap-2 mt-2',
          isUser ? 'justify-end' : 'justify-between'
        )}>
          {/* TTS controls for AI messages */}
          {!isUser && isSupported && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={handleSpeak}
                title={isThisMessageSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Read aloud'}
              >
                {isThisMessageSpeaking ? (
                  isPaused ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </Button>
              
              {isThisMessageSpeaking && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={handleStop}
                  title="Stop"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}

          {/* Timestamp */}
          <p
            className={cn(
              'text-xs opacity-60',
              isUser ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        
        {/* Speaking indicator */}
        {isThisMessageSpeaking && !isPaused && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
            <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
}
