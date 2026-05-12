import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/hooks/use-toast';
import { VoiceVisualizer } from './VoiceVisualizer';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onOpenCrisisResources?: () => void;
}

export function ChatInput({ onSend, disabled, placeholder = "Share what's on your mind...", onOpenCrisisResources }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSpeechResult = useCallback((result: string) => {
    setMessage(prev => prev ? `${prev} ${result}` : result);
  }, []);

  const handleSpeechError = useCallback((error: string, code: string) => {
    // For 'no-speech', use a more subtle notification
    if (code === 'no-speech') {
      toast({
        title: 'Voice Input',
        description: 'No speech was detected. Tap the mic to try again.',
        variant: 'default',
      });
      return;
    }

    toast({
      title: 'Voice Input Error',
      description: error,
      variant: 'destructive',
    });
  }, [toast]);

  const { isListening, isSupported, transcript, toggleListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  // Update message with interim transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      // Show interim transcript as preview
    }
  }, [isListening, transcript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3">
          {/* Voice Input Button */}
          {isSupported && (
            <Button
              onClick={toggleListening}
              disabled={disabled}
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              className={cn(
                'h-12 w-12 rounded-xl transition-all',
                isListening && 'bg-destructive hover:bg-destructive/90 animate-pulse'
              )}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={isListening && transcript ? `${message} ${transcript}`.trim() : message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : placeholder}
              disabled={disabled || isListening}
              className={cn(
                'min-h-[48px] max-h-[120px] resize-none pr-12',
                'bg-background border-border/50 focus:border-primary/50',
                'rounded-xl text-sm',
                'placeholder:text-muted-foreground/60',
                isListening && 'border-destructive/50 bg-destructive/5'
              )}
              rows={1}
            />

            {isListening && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <VoiceVisualizer isListening={isListening} />
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled || isListening}
            size="icon"
            className={cn(
              'h-12 w-12 rounded-xl shadow-soft transition-all',
              'bg-primary hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          {isListening ? (
            <span className="text-destructive">🎙️ Speak now... tap mic to stop</span>
          ) : (
            <>
              This is a supportive tool, not a replacement for professional help.{' '}
              <button
                onClick={onOpenCrisisResources}
                className="text-primary hover:underline focus:outline-none"
              >
                Crisis resources
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
