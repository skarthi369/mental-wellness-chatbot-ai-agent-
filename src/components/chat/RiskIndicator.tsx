import { RiskLevel } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskIndicatorProps {
  level: RiskLevel;
  score: number;
  showDetails?: boolean;
}

const riskConfig: Record<RiskLevel, {
  label: string;
  icon: typeof Shield;
  colorClass: string;
  bgClass: string;
  description: string;
}> = {
  low: {
    label: 'Low Risk',
    icon: Shield,
    colorClass: 'text-risk-low',
    bgClass: 'bg-risk-low/10',
    description: 'No immediate concerns detected',
  },
  medium: {
    label: 'Moderate',
    icon: AlertTriangle,
    colorClass: 'text-risk-medium',
    bgClass: 'bg-risk-medium/10',
    description: 'Some signs of distress detected',
  },
  high: {
    label: 'High Risk',
    icon: AlertOctagon,
    colorClass: 'text-risk-high',
    bgClass: 'bg-risk-high/10',
    description: 'Please consider reaching out for support',
  },
};

export function RiskIndicator({ level, score, showDetails = false }: RiskIndicatorProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-xl p-4', config.bgClass)}>
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', config.bgClass)}>
          <Icon className={cn('w-5 h-5', config.colorClass)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={cn('font-medium', config.colorClass)}>
              {config.label}
            </span>
            <span className={cn('text-sm font-medium', config.colorClass)}>
              {score}/10
            </span>
          </div>
          {showDetails && (
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 bg-background/50 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', {
            'bg-risk-low': level === 'low',
            'bg-risk-medium': level === 'medium',
            'bg-risk-high': level === 'high',
          })}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
