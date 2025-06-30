// Mood tracker related types
export interface MoodEntry {
  id: string;
  userId: string;
  moodLevel: number; // 1-5 scale
  emoji: string;
  notes?: string;
  activities?: string[];
  timestamp: Date;
  reflectionPrompts?: string[];
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  streak: number;
  moodDistribution: Record<number, number>;
  recentTrend: 'improving' | 'declining' | 'stable';
}

export interface MoodFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  moodLevels: number[];
  hasNotes: boolean;
}

export interface MoodInsight {
  type: 'pattern' | 'streak' | 'improvement' | 'concern';
  title: string;
  description: string;
  actionSuggestion?: string;
}

// Mood level configuration
export const MOOD_LEVELS = [
  { level: 1, emoji: '😢', label: 'Very Sad', color: '#8B4513' },
  { level: 2, emoji: '😟', label: 'Sad', color: '#A0522D' },
  { level: 3, emoji: '😐', label: 'Neutral', color: '#CD853F' },
  { level: 4, emoji: '😊', label: 'Happy', color: '#D2B48C' },
  { level: 5, emoji: '😄', label: 'Very Happy', color: '#F4A460' },
];

// Activity suggestions
export const ACTIVITY_SUGGESTIONS = [
  'Exercise', 'Meditation', 'Reading', 'Music', 'Socializing',
  'Nature Walk', 'Journaling', 'Cooking', 'Creative Work', 'Rest'
];

// Reflection prompts
export const REFLECTION_PROMPTS = [
  "What three things am I grateful for today?",
  "What helped me feel better today?",
  "What challenged me today, and how did I handle it?",
  "What would make tomorrow better?",
  "What patterns do I notice in my mood?",
  "How did my sleep affect my mood today?",
  "What activities brought me joy today?",
  "What would I tell a friend feeling the same way?",
];