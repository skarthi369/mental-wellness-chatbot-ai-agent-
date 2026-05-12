import { EmotionType } from '@/types/chat';
import { cn } from '@/lib/utils';
import { 
  Smile, 
  Frown, 
  AlertCircle, 
  Zap, 
  Sun, 
  Leaf, 
  Circle 
} from 'lucide-react';

interface EmotionBadgeProps {
  emotion: EmotionType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const emotionConfig: Record<EmotionType, { 
  label: string; 
  icon: typeof Smile;
  colorClass: string;
  bgClass: string;
}> = {
  happy: {
    label: 'Happy',
    icon: Smile,
    colorClass: 'text-emotion-happy',
    bgClass: 'bg-emotion-happy/10',
  },
  sad: {
    label: 'Sad',
    icon: Frown,
    colorClass: 'text-emotion-sad',
    bgClass: 'bg-emotion-sad/10',
  },
  anxious: {
    label: 'Anxious',
    icon: AlertCircle,
    colorClass: 'text-emotion-anxious',
    bgClass: 'bg-emotion-anxious/10',
  },
  stressed: {
    label: 'Stressed',
    icon: Zap,
    colorClass: 'text-emotion-stressed',
    bgClass: 'bg-emotion-stressed/10',
  },
  hopeful: {
    label: 'Hopeful',
    icon: Sun,
    colorClass: 'text-emotion-hopeful',
    bgClass: 'bg-emotion-hopeful/10',
  },
  calm: {
    label: 'Calm',
    icon: Leaf,
    colorClass: 'text-emotion-calm',
    bgClass: 'bg-emotion-calm/10',
  },
  neutral: {
    label: 'Neutral',
    icon: Circle,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1 gap-1',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function EmotionBadge({ emotion, size = 'md', showLabel = true }: EmotionBadgeProps) {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bgClass,
        config.colorClass,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
