import { Language } from '@/types/chat';
import { Persona } from '@/lib/prompts';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { Heart, FileText, Moon, Sun, Settings, Wind, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChatHeaderProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onOpenReport: () => void;
  onOpenSettings: () => void;
  onOpenBreathing: () => void;
  onOpenMeditation: () => void;
  onOpenAffirmation: () => void;
  messageCount: number;
  hasApiKey: boolean;
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function ChatHeader({ 
  currentLanguage, 
  onLanguageChange, 
  onOpenReport,
  onOpenSettings,
  onOpenBreathing,
  onOpenMeditation,
  onOpenAffirmation,
  messageCount,
  hasApiKey,
  persona,
  onPersonaChange,
}: ChatHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center animate-breathe">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">MindfulChat</h1>
              <p className="text-xs text-muted-foreground">Your wellness companion</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            {/* Persona Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
              <Button
                variant={persona === 'doctor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPersonaChange('doctor')}
                className="h-7 px-3 text-xs rounded-md"
              >
                Doctor
              </Button>
              <Button
                variant={persona === 'friend' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPersonaChange('friend')}
                className="h-7 px-3 text-xs rounded-md"
              >
                Friend
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={onOpenBreathing}
              className="text-muted-foreground hover:text-foreground"
              title="Breathing Exercise"
            >
              <Wind className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={onOpenMeditation}
              className="text-muted-foreground hover:text-foreground"
              title="Guided Meditation"
            >
              <Sparkles className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={onOpenAffirmation}
              className="text-muted-foreground hover:text-foreground"
              title="Daily Affirmation"
            >
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={onOpenSettings}
              className={hasApiKey ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenReport}
              className="hidden sm:flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Report
              {messageCount > 2 && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
