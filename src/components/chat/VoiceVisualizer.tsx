import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps {
    isListening: boolean;
    className?: string;
}

export function VoiceVisualizer({ isListening, className }: VoiceVisualizerProps) {
    const [heights, setHeights] = useState<number[]>([40, 60, 50, 70, 45]);

    useEffect(() => {
        if (!isListening) return;

        const interval = setInterval(() => {
            setHeights(prev => prev.map(() => Math.random() * 60 + 40));
        }, 150);

        return () => clearInterval(interval);
    }, [isListening]);

    if (!isListening) return null;

    return (
        <div className={cn("flex items-center gap-1 h-6", className)}>
            {heights.map((height, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-1 bg-destructive rounded-full transition-all duration-150 ease-in-out",
                        isListening && "animate-pulse"
                    )}
                    style={{
                        height: `${height}%`,
                        transitionDelay: `${i * 30}ms`
                    }}
                />
            ))}
        </div>
    );
}
