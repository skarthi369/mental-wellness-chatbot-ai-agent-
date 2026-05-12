import { Language, EmotionType, EmotionAnalysis, RiskAssessment, MentalHealthReport, Message } from '@/types/chat';

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Emotion keywords for detection (simplified)
const emotionKeywords: Record<EmotionType, string[]> = {
  sad: ['sad', 'depressed', 'unhappy', 'crying', 'hopeless', 'lonely', 'down', 'miserable', 'grief', 'loss', 'empty', 'distress', 'broken'],
  anxious: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'tense', 'restless', 'overwhelmed', 'dread', 'unsettled'],
  stressed: ['stressed', 'pressure', 'burnout', 'exhausted', 'overworked', 'tired', 'frustrated', 'angry', 'irritated', 'workload', 'burden'],
  happy: ['happy', 'joy', 'excited', 'grateful', 'blessed', 'wonderful', 'amazing', 'good', 'great', 'love'],
  hopeful: ['hopeful', 'optimistic', 'better', 'improving', 'progress', 'forward', 'positive', 'healing'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'balanced', 'centered'],
  neutral: [],
};

// Risk keywords
const riskKeywords = {
  high: ['suicide', 'kill myself', 'end it all', 'no reason to live', 'want to die', 'self harm', 'hurt myself'],
  medium: ['hopeless', 'can\'t go on', 'no point', 'giving up', 'worthless', 'burden', 'nobody cares'],
};

// Empathetic responses based on detected emotion
const emotionalResponses: Record<Language, Record<EmotionType, string[]>> = {
  en: {
    sad: [
      "I hear you, and I want you to know that your feelings are valid. Sadness can feel heavy, but you don't have to carry it alone. What's been weighing on your heart lately?",
      "It sounds like you're going through a difficult time. Remember, it's okay to not be okay. Would you like to share more about what's making you feel this way?",
      "I'm here with you in this moment. Sadness often comes when something important to us is affected. What matters most to you right now?",
    ],
    anxious: [
      "I can sense that you're feeling anxious. Let's take this one step at a time. Can you tell me what's on your mind right now?",
      "Anxiety can feel overwhelming, but you're safe here. Take a deep breath with me. What specific thoughts are troubling you?",
      "It's understandable to feel worried sometimes. Your mind is trying to protect you. What would help you feel more grounded right now?",
    ],
    stressed: [
      "It sounds like you're under a lot of pressure. Remember, it's important to take care of yourself too. What's been the biggest source of stress for you?",
      "I understand that stress can feel exhausting. You're doing your best, and that matters. Would you like to talk about what's overwhelming you?",
      "When we're stressed, everything can feel urgent. Let's pause together and identify what truly needs your attention right now?",
    ],
    happy: [
      "It's wonderful to hear that you're feeling good! What's bringing you joy today?",
      "That's beautiful! Positive moments are worth cherishing. Would you like to share more about what's making you happy?",
      "I'm glad you're in a good place right now. What contributed to this feeling?",
    ],
    hopeful: [
      "Hope is such a powerful feeling. It sounds like you're seeing light ahead. What's giving you this sense of hope?",
      "That's encouraging to hear! What positive changes have you noticed?",
      "Hope can be a beautiful compass. What are you looking forward to?",
    ],
    calm: [
      "It's lovely that you're feeling peaceful. How are you maintaining this sense of calm?",
      "Inner peace is a gift. What practices help you stay centered?",
      "That's wonderful. Would you like to explore ways to nurture this calm feeling?",
    ],
    neutral: [
      "I'm here to listen. How are you feeling today? Take your time to share whatever's on your mind.",
      "Thank you for reaching out. What brings you here today?",
      "I'm glad you're here. Is there anything specific you'd like to talk about?",
    ],
  },
  ta: {
    sad: [
      "உங்கள் வருத்தத்தை என்னால் உணர முடிகிறது. மனது பாரமாக இருக்கும்போது பேசுவது நல்லது. எதைப் பற்றி கவலைப்படுகிறீர்கள்?",
      "நீங்கள் ஒரு கடினமான நேரத்தை கடந்து கொண்டிருக்கிறீர்கள் என்று தெரிகிறது. கவலைப்படாதீர்கள், நான் இருக்கிறேன்.",
    ],
    anxious: [
      "நீங்கள் பதட்டமாக இருப்பதை என்னால் உணர முடிகிறது. மெதுவாக மூச்சை உள்ளிழுங்கள். எதைப் பற்றி பயப்படுகிறீர்கள்?",
      "பதட்டம் உங்களை வாட்டலாம், ஆனால் நீங்கள் இங்கே பாதுகாப்பாக இருக்கிறீர்கள்.",
    ],
    stressed: [
      "நீங்கள் அதிக அழுத்தத்தில் இருப்பதாகத் தெரிகிறது. சிறிது ஓய்வு எடுத்துக் கொள்ளுங்கள். உங்களை எது அதிகம் அழுத்துகிறது?",
    ],
    happy: [
      "நீங்கள் மகிழ்ச்சியாக இருப்பதை அறிந்து நான் மிகவும் சந்தோஷப்படுகிறேன்! அந்த மகிழ்ச்சிக்கு காரணம் என்ன?",
    ],
    hopeful: [
      "நம்பிக்கை ஒரு பெரிய பலம். உங்களுக்கு புதிய வழி பிறக்கும். உங்கள் அடுத்த திட்டம் என்ன?",
    ],
    calm: [
      "நீங்கள் அமைதியாக இருப்பது மகிழ்ச்சி அளிக்கிறது. இந்த அமைதியை எப்படி உணருகிறீர்கள்?",
    ],
    neutral: [
      "நான் உங்கள் பேச்சை கேட்க தயாராக இருக்கிறேன். இன்று உங்கள் மனநிலை எப்படி இருக்கிறது?",
      "தொடர்பு கொண்டதற்கு நன்றி. நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    ],
  },
  hi: {
    sad: [
      "मैं आपकी बात समझ सकता हूं। कभी-कभी उदास महसूस करना सामान्य है। क्या आप इसके बारे में और बताना चाहेंगे?",
      "ऐसा लग रहा है कि आप मुश्किल दौर से गुजर रहे हैं। हिम्मत मत हारिए, मैं आपके साथ हूं।",
    ],
    anxious: [
      "मुझे लग रहा है कि आप घबराए हुए हैं। गहरी सांस लें। आपको किस बात की चिंता सता रही है?",
    ],
    stressed: [
      "लगता है आप पर बहुत दबाव है। थोड़ा आराम करें। आपको सबसे ज्यादा तनाव किस बात से हो रहा है?",
    ],
    happy: [
      "यह सुनकर बहुत अच्छा लगा कि आप खुश हैं! आपकी इस खुशी का राज क्या है?",
    ],
    hopeful: [
      "उम्मीद एक बहुत बड़ी शक्ति है। आपको क्या लगता है कि आगे क्या बेहतर होगा?",
    ],
    calm: [
      "आप शांत महसूस कर रहे हैं, यह जानकर अच्छा लगा। आप अपनी शांति कैसे बनाए रखते हैं?",
    ],
    neutral: [
      "मैं आपकी बात सुनने के लिए तैयार हूं। आज आप कैसा महसूस कर रहे हैं?",
      "मुझसे बात करने के लिए धन्यवाद। मैं आपकी क्या मदद कर सकता हूं?",
    ],
  },
};

// Tamil translations for common phrases
const tamilResponses: Record<string, string> = {
  greeting: "வணக்கம்! நான் உங்கள் மனநல உதவியாளர். நீங்கள் எப்படி உணர்கிறீர்கள் என்று பகிர்ந்து கொள்ளுங்கள்.",
};

// Hindi translations for common phrases
const hindiResponses: Record<string, string> = {
  greeting: "नमस्ते! मैं आपका मानसिक स्वास्थ्य सहायक हूं। कृपया बताएं कि आप कैसा महसूस कर रहे हैं।",
};

// Detect primary emotion from text
function detectEmotion(text: string): EmotionAnalysis {
  const lowerText = text.toLowerCase();
  const emotionScores: Record<EmotionType, number> = {
    sad: 0,
    anxious: 0,
    stressed: 0,
    happy: 0,
    hopeful: 0,
    calm: 0,
    neutral: 0,
  };

  // Count keyword matches
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        emotionScores[emotion as EmotionType] += 1;
      }
    });
  });

  // Find primary and secondary emotions
  const sorted = Object.entries(emotionScores)
    .filter(([emotion]) => emotion !== 'neutral')
    .sort(([, a], [, b]) => b - a);

  const primary = sorted[0]?.[1] > 0 ? sorted[0][0] as EmotionType : 'neutral';
  const secondary = sorted[1]?.[1] > 0 ? sorted[1][0] as EmotionType : undefined;

  const maxScore = sorted[0]?.[1] || 0;
  const confidence = maxScore > 0 ? Math.min(0.9, 0.5 + maxScore * 0.1) : 0.3;

  const indicators: string[] = [];
  if (primary !== 'neutral') {
    indicators.push(...emotionKeywords[primary].filter(k => lowerText.includes(k)).slice(0, 3));
  }

  return {
    primary,
    secondary,
    confidence,
    indicators,
  };
}

// Assess risk level
function assessRisk(messages: Message[]): RiskAssessment {
  const allText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  let score = 2; // Base score
  const factors: string[] = [];
  const suggestions: string[] = [];

  // Check for high-risk keywords
  riskKeywords.high.forEach(keyword => {
    if (allText.includes(keyword)) {
      score = Math.min(10, score + 3);
      factors.push(`Expression of concerning thoughts`);
    }
  });

  // Check for medium-risk keywords
  riskKeywords.medium.forEach(keyword => {
    if (allText.includes(keyword)) {
      score = Math.min(10, score + 1);
      factors.push(`Signs of emotional distress`);
    }
  });

  // Remove duplicate factors
  const uniqueFactors = [...new Set(factors)];

  // Determine risk level
  let level: 'low' | 'medium' | 'high';
  if (score >= 7) {
    level = 'high';
    suggestions.push(
      '🚨 Please consider reaching out to a crisis helpline immediately.',
      'iCall: 9152987821 (India)',
      'Vandrevala Foundation: 1860-2662-345',
      'You deserve professional support right now.'
    );
  } else if (score >= 4) {
    level = 'medium';
    suggestions.push(
      'Consider speaking with a mental health professional.',
      'Practice self-care activities like deep breathing.',
      'Reach out to a trusted friend or family member.',
    );
  } else {
    level = 'low';
    suggestions.push(
      'Continue practicing self-awareness.',
      'Maintain healthy routines and connections.',
      'Consider journaling your thoughts and feelings.',
    );
  }

  return {
    level,
    score,
    factors: uniqueFactors,
    suggestions,
  };
}

// Generate AI response
export async function generateResponse(
  userMessage: string,
  conversationHistory: Message[],
  language: Language
): Promise<{ response: string; analysis: EmotionAnalysis }> {
  // Simulate API delay (1-2 seconds)
  await delay(1000 + Math.random() * 1000);

  const analysis = detectEmotion(userMessage);

  // Get appropriate response based on language and emotion
  const langResponses = emotionalResponses[language] || emotionalResponses.en;
  const responses = langResponses[analysis.primary];
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];

  let response = baseResponse;

  // Add language-specific greeting if it's the first user message
  if (conversationHistory.filter(m => m.role === 'user').length === 0) {
    if (language === 'ta') {
      response = tamilResponses.greeting + '\n\n' + response;
    } else if (language === 'hi') {
      response = hindiResponses.greeting + '\n\n' + response;
    }
  }

  return { response, analysis };
}

// Generate mental health report
export async function generateReport(messages: Message[]): Promise<MentalHealthReport> {
  await delay(500);

  const userMessages = messages.filter(m => m.role === 'user');

  // Use the latest AI analysis if available
  const latestAnalysis = [...messages].reverse().find(m => m.role === 'user' && m.analysis)?.analysis;

  if (latestAnalysis) {
    const userMsgs = messages.filter(m => m.role === 'user');
    const lastUserMsg = userMsgs[userMsgs.length - 1]?.content || "";
    
    return {
      sessionSummary: `The user discussed: "${lastUserMsg.substring(0, 50)}${lastUserMsg.length > 50 ? '...' : ''}". Overall mood was ${latestAnalysis.primary}.`,
      modeUsed: messages.some(m => m.content.includes("Doctor Mode")) ? 'Doctor' : 'Friend', // Simplistic check
      emotions: latestAnalysis,
      risk: {
        level: latestAnalysis.riskLevel || 'low',
        score: latestAnalysis.severityScore || 2,
        factors: latestAnalysis.indicators || [],
        suggestions: latestAnalysis.safeSuggestions || [
          'Continue practicing self-awareness.',
          'Maintain healthy routines and connections.',
        ],
      },
      interventions: latestAnalysis.safeSuggestions?.slice(0, 2) || ["Supportive conversation", "Active listening"],
      recommendations: latestAnalysis.safeSuggestions || [
        'Regular mindfulness or meditation practice',
        'Maintain consistent sleep schedule',
        'Physical exercise',
        'Stay connected with supportive people',
      ],
      timestamp: new Date(),
    };
  }

  // Fallback to original mock logic
  const allText = userMessages.map(m => m.content).join(' ');
  const emotions = detectEmotion(allText);
  const risk = assessRisk(messages);

  const recommendations = [
    'Regular mindfulness or meditation practice',
    'Maintain consistent sleep schedule',
    'Physical exercise (even light walking helps)',
    'Stay connected with supportive people',
    'Consider professional counseling for personalized support',
  ];

  return {
    sessionSummary: `Conversation analysis for ${userMessages.length} messages. Primary emotion detected: ${emotions.primary}.`,
    modeUsed: 'Mixed',
    emotions,
    risk,
    interventions: [
      'Supportive dialogue',
      'Atmosphere of non-judgmental listening'
    ],
    recommendations,
    timestamp: new Date(),
  };
}

// Get welcome message based on language
export function getWelcomeMessage(language: Language): string {
  const messages = {
    en: "Hello! I'm your mental wellness companion. 🌿\n\nI'm here to listen and support you without judgment. How are you feeling today? Take your time to share whatever is on your mind.",
    ta: "வணக்கம்! நான் உங்கள் மனநல துணையாளர். 🌿\n\nநான் உங்களை தீர்ப்பு இல்லாமல் கேட்டு ஆதரிக்க இங்கே இருக்கிறேன். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
    hi: "नमस्ते! मैं आपका मानसिक स्वास्थ्य साथी हूं। 🌿\n\nमैं बिना किसी निर्णय के आपकी बात सुनने और सहायता करने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
  };
  return messages[language];
}
