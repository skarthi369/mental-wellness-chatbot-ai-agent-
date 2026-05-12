import { useState, useEffect } from 'react';
import { X, Wind, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TherapyTrigger } from '@/lib/emotionTriggers';

interface TherapySuggestionBannerProps {
  trigger: TherapyTrigger;
  language: 'en' | 'ta' | 'hi';
  onAccept: () => void;
  onDismiss: () => void;
}

const SUGGESTION_MESSAGES = {
  breathing: {
    en: {
      title: 'Try Breathing Exercise',
      description: 'Grounded breathing can help you feel more centered and calm',
      button: 'Start Exercise',
    },
    ta: {
      title: 'மூச்சு பயிற்சி செய்யவும்',
      description: 'மூச்சு பயிற்சி உங்களை அமைதியாக உணர உதவும்',
      button: 'தொடங்கவும்',
    },
    hi: {
      title: 'सांस की व्यायाम आजमाएं',
      description: 'सांस की व्यायाम आपको शांत महसूस करने में मदद कर सकता है',
      button: 'शुरु करें',
    },
  },
  meditation: {
    en: {
      title: 'Try Guided Meditation',
      description: 'Deepen your peace with a guided meditation session',
      button: 'Start Meditation',
    },
    ta: {
      title: 'வழிகாட்டப்பட்ட தியானம் செய்யவும்',
      description: 'உங்கள் அமைதியை தியானத்துடன் வளர்த்துக்கொள்ளுங்கள்',
      button: 'தொடங்கவும்',
    },
    hi: {
      title: 'निर्देशित ध्यान आजमाएं',
      description: 'एक निर्देशित ध्यान सत्र के साथ अपनी शांति को गहरा करें',
      button: 'शुरु करें',
    },
  },
  none: {
    en: { title: '', description: '', button: '' },
    ta: { title: '', description: '', button: '' },
    hi: { title: '', description: '', button: '' },
  },
};

export function TherapySuggestionBanner({
  trigger,
  language,
  onAccept,
  onDismiss,
}: TherapySuggestionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (trigger === 'none') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [trigger]);

  if (!isVisible || trigger === 'none') {
    return null;
  }

  const messages = SUGGESTION_MESSAGES[trigger][language];
  const icon = trigger === 'breathing' ? 
    <Wind className="w-5 h-5 text-blue-500" /> : 
    <Sparkles className="w-5 h-5 text-purple-500" />;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div
      className={cn(
        'animate-slide-in-up fixed bottom-24 left-4 right-4 max-w-md mx-auto',
        'bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700',
        'p-4 flex items-start gap-3'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">{icon}</div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm text-foreground mb-1">
          {messages.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {messages.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="default"
          className="h-8 px-3 text-xs"
          onClick={onAccept}
        >
          {messages.button}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={handleDismiss}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
