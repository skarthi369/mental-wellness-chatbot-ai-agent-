import { EmotionType, RiskLevel } from '@/types/chat';

export type TherapyTrigger = 'breathing' | 'meditation' | 'none';

export interface TriggerConfig {
  trigger: TherapyTrigger;
  message: string;
  auto: boolean; // whether to auto-open without user action
  delay: number; // delay in ms before showing
}

/**
 * Determines which therapeutic exercise to suggest based on emotion detected
 * @param emotion - Primary emotion detected from user message
 * @param riskLevel - Risk assessment level
 * @param conversationLength - Number of exchanges so far
 * @returns Config for which exercise to trigger and how
 */
export function getTherapyTrigger(
  emotion: EmotionType,
  riskLevel?: RiskLevel,
  conversationLength: number = 0
): TriggerConfig {
  // High-risk situations - prioritize breathing exercise
  if (riskLevel === 'high' || riskLevel === 'medium') {
    return {
      trigger: 'breathing',
      message: 'I sense you might be overwhelmed right now. Let\'s try some grounding breathing exercises to help you feel more centered.',
      auto: true,
      delay: 2000, // 2 seconds after message appears
    };
  }

  switch (emotion) {
    // Stress and anxiety - breathing exercise
    case 'anxious':
      return {
        trigger: 'breathing',
        message: 'I notice you\'re feeling anxious. A few minutes of guided breathing can help calm your nervous system. Would you like to try?',
        auto: true,
        delay: 2500,
      };

    case 'stressed':
      return {
        trigger: 'breathing',
        message: 'Stress can feel heavy. Let\'s use some breathing techniques to release that tension and find clarity.',
        auto: true,
        delay: 2500,
      };

    // Calm and peaceful states - meditation
    case 'calm':
      return {
        trigger: 'meditation',
        message: 'You\'re in a good mindset right now. Would you like to deepen this calm with a guided meditation session?',
        auto: false, // Ask permission when calm
        delay: 3000,
      };

    case 'happy':
      return {
        trigger: 'meditation',
        message: 'What a wonderful feeling! Consider a gratitude meditation to amplify this positive energy.',
        auto: false,
        delay: 3500,
      };

    // Mixed emotions
    case 'hopeful':
      return {
        trigger: 'meditation',
        message: 'Hope is powerful. Let\'s nurture this feeling with a calming meditation.',
        auto: false,
        delay: 3000,
      };

    case 'sad':
      return {
        trigger: 'breathing',
        message: 'Sadness is valid. Grounded breathing can help you process these feelings safely.',
        auto: true,
        delay: 2500,
      };

    case 'neutral':
    default:
      return {
        trigger: 'none',
        message: '',
        auto: false,
        delay: 0,
      };
  }
}

/**
 * Check if meditation was suggested in recent messages
 * Prevents suggesting same therapy too often
 */
export function shouldSuggestAgain(
  triggerType: TherapyTrigger,
  recentMessageCount: number,
  lastTriggerIndex: number
): boolean {
  // Don't suggest if we showed therapy in last 3 messages
  const minimumGap = 3;
  const messagesSinceLastTrigger = recentMessageCount - lastTriggerIndex;

  return triggerType !== 'none' && messagesSinceLastTrigger >= minimumGap;
}

/**
 * Get a meditation session recommendation based on emotion
 */
export function getMeditationSessionId(emotion: EmotionType): string {
  switch (emotion) {
    case 'calm':
    case 'happy':
      return 'gratitude'; // Gratitude meditation

    case 'stressed':
    case 'anxious':
      return 'body-scan'; // Body scan to release tension

    case 'sad':
      return 'body-scan'; // Body scan for comfort

    case 'hopeful':
      return 'calm-mind'; // Calm mind to nurture hope

    default:
      return 'calm-mind';
  }
}
