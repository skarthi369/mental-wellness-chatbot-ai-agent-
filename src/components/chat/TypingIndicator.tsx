import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent text-primary">
        <Bot className="w-5 h-5" />
      </div>

      {/* Typing bubble */}
      <div className="bg-card text-card-foreground rounded-2xl rounded-tl-md px-4 py-3 shadow-soft border border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}
