import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X, RefreshCw } from "lucide-react";

interface DailyAffirmationProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const affirmations: Record<string, string[]> = {
  en: [
    "I am worthy of love and respect.",
    "My feelings are valid, and I am allowed to feel them.",
    "I am doing my best, and that is enough.",
    "I am resilient and can get through difficult times.",
    "I choose to be kind to myself today.",
    "I am in control of how I react to others.",
    "I am capable of achieving my goals.",
    "I deserve to take up space and have a voice.",
    "I am growing and learning every day.",
    "My peace is a priority."
  ],
  ta: [
    "நான் அன்புக்கும் மரியாதைக்கும் தகுதியானவன்.",
    "எனது உணர்வுகள் செல்லுபடியாகும், அவற்றை உணர எனக்கு உரிமை உண்டு.",
    "நான் எனது சிறந்த முயற்சியைச் செய்கிறேன், அதுவே போதுமானது.",
    "நான் நெகிழ்ச்சி உடையவன் மற்றும் கடினமான காலங்களைக் கடக்க முடியும்.",
    "இன்று எனக்கு நானே கனிவாக இருக்கத் தேர்வு செய்கிறேன்.",
    "பிறருக்கு நான் எப்படி எதிர்வினையாற்றுகிறேன் என்பதில் எனக்கு கட்டுப்பாடு உள்ளது."
  ],
  hi: [
    "मैं प्यार और सम्मान के योग्य हूँ।",
    "मेरी भावनाएं मान्य हैं, और मुझे उन्हें महसूस करने की अनुमति है।",
    "मैं अपना सर्वश्रेष्ठ कर रहा हूँ, और यही काफी है।",
    "मैं लचीला हूँ और कठिन समय से गुजर सकता हूँ।",
    "मैं आज अपने प्रति दयालु होना चुनता हूँ।",
    "मैं दूसरों के प्रति अपनी प्रतिक्रिया को नियंत्रित कर सकता हूँ।"
  ]
};

export function DailyAffirmation({ isOpen, onClose, language }: DailyAffirmationProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState(() => {
    const lang = language === 'ta' ? 'ta' : language === 'hi' ? 'hi' : 'en';
    const list = affirmations[lang];
    return list[Math.floor(Math.random() * list.length)];
  });

  if (!isOpen) return null;

  const refreshAffirmation = () => {
    const lang = language === 'ta' ? 'ta' : language === 'hi' ? 'hi' : 'en';
    const list = affirmations[lang];
    let next;
    do {
      next = list[Math.floor(Math.random() * list.length)];
    } while (next === currentAffirmation && list.length > 1);
    setCurrentAffirmation(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md bg-gradient-to-br from-primary/10 to-accent/20 border-primary/20 shadow-xl overflow-hidden relative animate-scale-in">
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="pt-10 pb-8 px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-3 rounded-full animate-breathe">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-primary">Daily Affirmation</h2>
          
          <p className="text-lg italic font-medium leading-relaxed text-foreground min-h-[5rem] flex items-center justify-center">
            "{currentAffirmation}"
          </p>
          
          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={refreshAffirmation} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> New One
            </Button>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Thank You
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
