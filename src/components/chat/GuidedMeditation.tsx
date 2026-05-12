import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidedMeditationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeditationStep {
  instruction: string;
  duration: number; // in seconds
  breathe?: 'inhale' | 'exhale' | 'hold';
}

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // total minutes
  steps: MeditationStep[];
}

const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: 'calm-mind',
    title: 'Calm Mind',
    description: 'A gentle meditation to quiet your thoughts',
    duration: 3,
    steps: [
      { instruction: 'Find a comfortable position and close your eyes', duration: 8 },
      { instruction: 'Take a deep breath in...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold gently...', duration: 4, breathe: 'hold' },
      { instruction: 'Slowly exhale...', duration: 6, breathe: 'exhale' },
      { instruction: 'Notice any tension in your body', duration: 8 },
      { instruction: 'Breathe in peace and calm...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold...', duration: 4, breathe: 'hold' },
      { instruction: 'Release any worries as you exhale...', duration: 6, breathe: 'exhale' },
      { instruction: 'Let your shoulders drop and relax', duration: 8 },
      { instruction: 'Deep breath in...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold...', duration: 4, breathe: 'hold' },
      { instruction: 'Exhale slowly...', duration: 6, breathe: 'exhale' },
      { instruction: 'Feel the weight of your body being supported', duration: 10 },
      { instruction: 'Inhale tranquility...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold...', duration: 4, breathe: 'hold' },
      { instruction: 'Exhale stress...', duration: 6, breathe: 'exhale' },
      { instruction: 'Your mind is becoming still like a calm lake', duration: 10 },
      { instruction: 'One more deep breath in...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold...', duration: 4, breathe: 'hold' },
      { instruction: 'And release...', duration: 6, breathe: 'exhale' },
      { instruction: 'When ready, slowly open your eyes', duration: 8 },
      { instruction: 'Carry this peace with you', duration: 6 },
    ],
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    description: 'Release tension throughout your body',
    duration: 5,
    steps: [
      { instruction: 'Lie down or sit comfortably', duration: 8 },
      { instruction: 'Close your eyes and take three deep breaths', duration: 12 },
      { instruction: 'Bring awareness to the top of your head', duration: 10 },
      { instruction: 'Notice any sensations without judgment', duration: 8 },
      { instruction: 'Move your attention to your forehead', duration: 8 },
      { instruction: 'Let go of any tension you find there', duration: 8 },
      { instruction: 'Relax your eyes and cheeks', duration: 10 },
      { instruction: 'Unclench your jaw, let your mouth soften', duration: 10 },
      { instruction: 'Feel your neck and shoulders', duration: 10 },
      { instruction: 'Breathe into any tightness...', duration: 4, breathe: 'inhale' },
      { instruction: 'And release it...', duration: 6, breathe: 'exhale' },
      { instruction: 'Move down to your arms and hands', duration: 10 },
      { instruction: 'Let them become heavy and relaxed', duration: 10 },
      { instruction: 'Bring attention to your chest and heart', duration: 10 },
      { instruction: 'Deep breath in...', duration: 4, breathe: 'inhale' },
      { instruction: 'Slow exhale...', duration: 6, breathe: 'exhale' },
      { instruction: 'Relax your stomach and lower back', duration: 12 },
      { instruction: 'Feel your hips and legs becoming heavy', duration: 12 },
      { instruction: 'All the way down to your feet and toes', duration: 10 },
      { instruction: 'Your whole body is now deeply relaxed', duration: 12 },
      { instruction: 'Take a final deep breath...', duration: 4, breathe: 'inhale' },
      { instruction: 'And slowly return to the room', duration: 10 },
    ],
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Cultivate appreciation and positivity',
    duration: 4,
    steps: [
      { instruction: 'Settle into a comfortable position', duration: 8 },
      { instruction: 'Take a deep, cleansing breath...', duration: 4, breathe: 'inhale' },
      { instruction: 'And exhale fully...', duration: 6, breathe: 'exhale' },
      { instruction: 'Think of something simple you\'re grateful for today', duration: 12 },
      { instruction: 'Perhaps the warmth of sunlight or a kind word', duration: 10 },
      { instruction: 'Breathe in that feeling of appreciation...', duration: 4, breathe: 'inhale' },
      { instruction: 'Let it fill your heart...', duration: 4, breathe: 'hold' },
      { instruction: 'Exhale with a soft smile...', duration: 6, breathe: 'exhale' },
      { instruction: 'Now think of a person who has helped you', duration: 12 },
      { instruction: 'Send them silent thanks', duration: 10 },
      { instruction: 'Deep breath of gratitude...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold this warmth...', duration: 4, breathe: 'hold' },
      { instruction: 'Share it as you exhale...', duration: 6, breathe: 'exhale' },
      { instruction: 'Finally, appreciate yourself', duration: 10 },
      { instruction: 'You are doing your best, and that is enough', duration: 12 },
      { instruction: 'One last grateful breath in...', duration: 4, breathe: 'inhale' },
      { instruction: 'Hold...', duration: 4, breathe: 'hold' },
      { instruction: 'And release with joy...', duration: 6, breathe: 'exhale' },
      { instruction: 'Carry this gratitude with you today', duration: 10 },
    ],
  },
];

// Ambient sound generator using Web Audio API
const useAmbientSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAmbient = useCallback(() => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 2);
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;

    // Create soft ambient tones (binaural-like frequencies)
    const frequencies = [174, 285, 396]; // Healing frequencies
    
    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const oscGain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscGain.gain.setValueAtTime(0.03 - i * 0.008, audioContext.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      oscillatorsRef.current.push(osc);
    });
  }, []);

  const stopAmbient = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
    }
    
    setTimeout(() => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      oscillatorsRef.current = [];
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      gainNodeRef.current = null;
    }, 1100);
  }, []);

  return { startAmbient, stopAmbient };
};

export function GuidedMeditation({ isOpen, onClose }: GuidedMeditationProps) {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const { startAmbient, stopAmbient } = useAmbientSound();

  const currentStep = selectedSession?.steps[currentStepIndex];

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const resetSession = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
    stopAmbient();
  }, [clearTimers, stopAmbient]);

  const handleClose = useCallback(() => {
    resetSession();
    setSelectedSession(null);
    onClose();
  }, [resetSession, onClose]);

  // Progress through steps
  useEffect(() => {
    if (!isPlaying || !selectedSession || !currentStep) return;

    const stepDuration = currentStep.duration * 1000;
    const progressInterval = 50;

    setStepProgress(0);
    
    progressRef.current = setInterval(() => {
      setStepProgress(prev => Math.min(prev + (progressInterval / stepDuration) * 100, 100));
    }, progressInterval);

    timerRef.current = setTimeout(() => {
      if (currentStepIndex < selectedSession.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Session complete
        setIsPlaying(false);
        stopAmbient();
      }
    }, stepDuration);

    return () => clearTimers();
  }, [isPlaying, currentStepIndex, selectedSession, currentStep, clearTimers, stopAmbient]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAmbient();
    } else {
      setIsPlaying(true);
      if (!isMuted) startAmbient();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      if (isPlaying) startAmbient();
    } else {
      stopAmbient();
    }
    setIsMuted(!isMuted);
  };

  const selectSession = (session: MeditationSession) => {
    resetSession();
    setSelectedSession(session);
  };

  const goBack = () => {
    resetSession();
    setSelectedSession(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Guided Meditation
          </DialogTitle>
        </DialogHeader>

        {!selectedSession ? (
          // Session Selection
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Choose a meditation to begin your journey to inner peace.
            </p>
            {MEDITATION_SESSIONS.map(session => (
              <button
                key={session.id}
                onClick={() => selectSession(session)}
                className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {session.duration} min
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Active Meditation
          <div className="py-4">
            {/* Visual Animation */}
            <div className="relative h-48 flex items-center justify-center mb-6">
              {/* Outer glow */}
              <div
                className={cn(
                  "absolute w-40 h-40 rounded-full bg-primary/10 transition-all duration-1000",
                  currentStep?.breathe === 'inhale' && "scale-125 opacity-80",
                  currentStep?.breathe === 'exhale' && "scale-75 opacity-40",
                  currentStep?.breathe === 'hold' && "scale-110 opacity-60"
                )}
              />
              
              {/* Middle ring */}
              <div
                className={cn(
                  "absolute w-28 h-28 rounded-full bg-primary/20 transition-all duration-1000",
                  currentStep?.breathe === 'inhale' && "scale-125",
                  currentStep?.breathe === 'exhale' && "scale-75",
                  currentStep?.breathe === 'hold' && "scale-100"
                )}
              />
              
              {/* Inner circle with icon */}
              <div
                className={cn(
                  "relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center transition-all duration-1000 shadow-lg",
                  isPlaying && "animate-pulse",
                  currentStep?.breathe === 'inhale' && "scale-110",
                  currentStep?.breathe === 'exhale' && "scale-90"
                )}
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Breathing indicator */}
              {currentStep?.breathe && (
                <div className="absolute -bottom-2 text-xs font-medium text-primary capitalize">
                  {currentStep.breathe === 'inhale' ? 'Breathe In' : 
                   currentStep.breathe === 'exhale' ? 'Breathe Out' : 'Hold'}
                </div>
              )}
            </div>

            {/* Instruction */}
            <div className="text-center mb-6 min-h-[60px] flex items-center justify-center">
              <p className="text-lg font-medium text-foreground animate-fade-in">
                {currentStep?.instruction || 'Session complete. Namaste. 🙏'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            {/* Overall progress */}
            <div className="text-center text-xs text-muted-foreground mb-4">
              Step {currentStepIndex + 1} of {selectedSession.steps.length}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={goBack}
                className="rounded-full"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlay}
                className="rounded-full w-14 h-14"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
