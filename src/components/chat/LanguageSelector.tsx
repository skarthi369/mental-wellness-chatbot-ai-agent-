import { Language } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex rounded-lg bg-muted p-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              'h-7 px-3 text-xs rounded-md transition-all',
              currentLanguage === lang.code
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
            )}
          >
            {lang.native}
          </Button>
        ))}
      </div>
    </div>
  );
}
