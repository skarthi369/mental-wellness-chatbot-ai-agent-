import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wind, X, Play, Pause } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_DURATIONS = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  rest: 2000,
};

const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest',
};

export function BreathingExercise({ isOpen, onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive || !isOpen) return;

    const phaseDuration = PHASE_DURATIONS[phase];
    const intervalDuration = 1000;
    let elapsed = 0;

    const countdownInterval = setInterval(() => {
      elapsed += intervalDuration;
      const remaining = Math.ceil((phaseDuration - elapsed) / 1000);
      setCountdown(Math.max(1, remaining));

      if (elapsed >= phaseDuration) {
        clearInterval(countdownInterval);

        // Move to next phase
        const phases: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
        const currentIndex = phases.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phases.length;

        if (nextIndex === 0) {
          setCycleCount(prev => prev + 1);
        }

        setPhase(phases[nextIndex]);
        setCountdown(PHASE_DURATIONS[phases[nextIndex]] / 1000);
      }
    }, intervalDuration);

    return () => clearInterval(countdownInterval);
  }, [isActive, phase, isOpen]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCycleCount(0);
    setCountdown(4);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleClose = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    onClose();
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-100';
      case 'hold':
        return 'scale-100';
      case 'exhale':
        return 'scale-75';
      case 'rest':
        return 'scale-75';
      default:
        return 'scale-75';
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-primary/60 to-primary';
      case 'hold':
        return 'from-emotion-calm/60 to-emotion-calm';
      case 'exhale':
        return 'from-secondary to-primary/40';
      case 'rest':
        return 'from-muted to-secondary';
      default:
        return 'from-primary/60 to-primary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-primary" />
            Breathing Exercise
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-8 space-y-8">
          {/* Breathing Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${getCircleColor()} opacity-20 blur-xl transition-transform duration-[4s] ease-in-out ${isActive ? getCircleScale() : 'scale-75'}`}
            />

            {/* Main breathing circle */}
            <div
              className={`absolute inset-4 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-lg transition-transform duration-[4s] ease-in-out ${isActive ? getCircleScale() : 'scale-75'}`}
            />

            {/* Inner circle with countdown */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-card/90 backdrop-blur flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-bold text-foreground">{countdown}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {isActive ? PHASE_LABELS[phase] : 'Ready'}
              </span>
            </div>

            {/* Animated rings */}
            {isActive && (
              <>
                <div
                  className={`absolute inset-2 rounded-full border-2 border-primary/30 transition-transform duration-[4s] ease-in-out ${getCircleScale()}`}
                  style={{ animationDelay: '0.5s' }}
                />
                <div
                  className={`absolute inset-0 rounded-full border border-primary/20 transition-transform duration-[4s] ease-in-out ${getCircleScale()}`}
                  style={{ animationDelay: '1s' }}
                />
              </>
            )}
          </div>

          {/* Phase indicator */}
          <div className="flex gap-2">
            {(['inhale', 'hold', 'exhale', 'rest'] as BreathPhase[]).map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${phase === p && isActive
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30'
                  }`}
              />
            ))}
          </div>

          {/* Cycle counter */}
          {cycleCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Completed cycles: <span className="font-medium text-foreground">{cycleCount}</span>
            </p>
          )}

          {/* Instructions */}
          {!isActive && (
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              This 4-4-4-2 breathing technique helps reduce anxiety and promote calm.
              Follow the circle's rhythm.
            </p>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {!isActive ? (
              <Button onClick={handleStart} className="gap-2">
                <Play className="w-4 h-4" />
                Start Exercise
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" className="gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
