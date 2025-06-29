import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HealingMateContent {
  id: string;
  type: 'music' | 'meditation' | 'breathing' | 'sound-therapy';
  title: string;
  description: string;
  duration: number; // minutes
  fileUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isOfflineAvailable?: boolean;
  instructor?: string;
  series?: string;
}

export interface UserPreferences {
  favoriteTypes: string[];
  preferredDuration: number;
  completedSessions: string[];
  moodCorrelations: Record<string, string[]>;
  favorites: string[];
  lastPlayedPosition: Record<string, number>; // Track playback position for resume
}

export interface PlaybackState {
  currentContent: HealingMateContent | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
}

interface HealingMateContextType {
  // Content
  allContent: HealingMateContent[];
  filteredContent: HealingMateContent[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (difficulty: string | null) => void;
  
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  addToFavorites: (contentId: string) => void;
  removeFromFavorites: (contentId: string) => void;
  isFavorite: (contentId: string) => boolean;
  markAsCompleted: (contentId: string) => void;
  
  // Playback
  playbackState: PlaybackState;
  setPlaybackState: (state: Partial<PlaybackState>) => void;
  playContent: (content: HealingMateContent) => void;
  pauseContent: () => void;
  resumeContent: () => void;
  stopContent: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Recommendations
  getPersonalizedRecommendations: (mood?: string, limit?: number) => HealingMateContent[];
  getSimilarContent: (contentId: string, limit?: number) => HealingMateContent[];
  getContinueWatching: () => HealingMateContent[];
  
  // Progress tracking
  saveProgress: (contentId: string, progress: number, completed?: boolean) => void;
  getProgress: (contentId: string) => number;
}

const HealingMateContext = createContext<HealingMateContextType | undefined>(undefined);

export const useHealingMate = () => {
  const context = useContext(HealingMateContext);
  if (context === undefined) {
    throw new Error('useHealingMate must be used within a HealingMateProvider');
  }
  return context;
};

// Mock content data
const mockContent: HealingMateContent[] = [
  // Music Therapy
  {
    id: 'music-1',
    type: 'music',
    title: 'Peaceful Piano Collection',
    description: 'Gentle piano melodies for relaxation and stress relief',
    duration: 25,
    fileUrl: '/audio/peaceful-piano.mp3',
    thumbnailUrl: '/images/peaceful-piano.jpg',
    tags: ['piano', 'classical', 'relaxation', 'sleep'],
    difficulty: 'beginner',
    category: 'Instrumental',
    instructor: 'Dr. Sarah Chen',
    series: 'Piano Therapy Collection'
  },
  {
    id: 'music-2',
    type: 'music',
    title: 'Nature Sounds Harmony',
    description: 'Forest sounds blended with soft ambient music',
    duration: 30,
    fileUrl: '/audio/nature-harmony.mp3',
    thumbnailUrl: '/images/nature-sounds.jpg',
    tags: ['nature', 'ambient', 'forest', 'birds'],
    difficulty: 'beginner',
    category: 'Nature',
    instructor: 'Michael Rivers',
    series: 'Natural Healing'
  },
  {
    id: 'music-3',
    type: 'music',
    title: 'Binaural Beats Focus',
    description: 'Scientifically designed frequencies for enhanced concentration',
    duration: 20,
    fileUrl: '/audio/binaural-focus.mp3',
    thumbnailUrl: '/images/binaural-beats.jpg',
    tags: ['binaural', 'focus', 'productivity', 'alpha-waves'],
    difficulty: 'intermediate',
    category: 'Binaural',
    instructor: 'Dr. Emma Thompson',
    series: 'Brainwave Entrainment'
  },
  
  // Guided Meditation
  {
    id: 'meditation-1',
    type: 'meditation',
    title: 'Morning Mindfulness',
    description: 'Start your day with clarity and positive intention',
    duration: 15,
    fileUrl: '/audio/morning-mindfulness.mp3',
    thumbnailUrl: '/images/morning-meditation.jpg',
    tags: ['morning', 'mindfulness', 'intention', 'clarity'],
    difficulty: 'beginner',
    category: 'Mindfulness',
    instructor: 'Zen Master Lin',
    series: 'Daily Mindfulness'
  },
  {
    id: 'meditation-2',
    type: 'meditation',
    title: 'Deep Sleep Journey',
    description: 'Guided visualization for peaceful sleep and rest',
    duration: 35,
    fileUrl: '/audio/deep-sleep.mp3',
    thumbnailUrl: '/images/sleep-meditation.jpg',
    tags: ['sleep', 'relaxation', 'visualization', 'rest'],
    difficulty: 'beginner',
    category: 'Sleep',
    instructor: 'Luna Starlight',
    series: 'Sleep Support'
  },
  {
    id: 'meditation-3',
    type: 'meditation',
    title: 'Anxiety Relief Practice',
    description: 'Breathing techniques and mindfulness for anxiety management',
    duration: 18,
    fileUrl: '/audio/anxiety-relief.mp3',
    thumbnailUrl: '/images/anxiety-relief.jpg',
    tags: ['anxiety', 'breathing', 'calm', 'stress-relief'],
    difficulty: 'intermediate',
    category: 'Therapeutic',
    instructor: 'Dr. Calm Waters',
    series: 'Mental Health Support'
  },
  
  // Breathing Exercises
  {
    id: 'breathing-1',
    type: 'breathing',
    title: '4-7-8 Breathing Technique',
    description: 'Ancient breathing pattern for relaxation and sleep',
    duration: 8,
    fileUrl: '/audio/478-breathing.mp3',
    thumbnailUrl: '/images/breathing-exercise.jpg',
    tags: ['breathing', '4-7-8', 'relaxation', 'technique'],
    difficulty: 'beginner',
    category: 'Breathing',
    instructor: 'Breathwork Master',
    series: 'Fundamental Breathing'
  },
  {
    id: 'breathing-2',
    type: 'breathing',
    title: 'Box Breathing Method',
    description: 'Military-grade breathing technique for stress and focus',
    duration: 12,
    fileUrl: '/audio/box-breathing.mp3',
    thumbnailUrl: '/images/box-breathing.jpg',
    tags: ['box-breathing', 'military', 'stress', 'focus'],
    difficulty: 'intermediate',
    category: 'Breathing',
    instructor: 'Commander Zen',
    series: 'Advanced Breathing'
  },
  
  // Sound Therapy
  {
    id: 'sound-1',
    type: 'sound-therapy',
    title: 'Tibetan Singing Bowls',
    description: 'Traditional healing sounds for chakra alignment',
    duration: 22,
    fileUrl: '/audio/tibetan-bowls.mp3',
    thumbnailUrl: '/images/singing-bowls.jpg',
    tags: ['tibetan', 'singing-bowls', 'chakra', 'healing'],
    difficulty: 'beginner',
    category: 'Traditional',
    instructor: 'Master Tenzin',
    series: 'Ancient Healing Sounds'
  },
  {
    id: 'sound-2',
    type: 'sound-therapy',
    title: 'Crystal Bowl Frequencies',
    description: 'Pure crystal tones for energy cleansing and healing',
    duration: 28,
    fileUrl: '/audio/crystal-bowls.mp3',
    thumbnailUrl: '/images/crystal-bowls.jpg',
    tags: ['crystal', 'frequencies', 'energy', 'cleansing'],
    difficulty: 'intermediate',
    category: 'Crystal Healing',
    instructor: 'Crystal Sage',
    series: 'Vibrational Therapy'
  }
];

export const HealingMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allContent] = useState<HealingMateContent[]>(mockContent);
  const [filteredContent, setFilteredContent] = useState<HealingMateContent[]>(mockContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteTypes: [],
    preferredDuration: 20,
    completedSessions: [],
    moodCorrelations: {},
    favorites: [],
    lastPlayedPosition: {}
  });
  
  const [playbackState, setPlaybackStateInternal] = useState<PlaybackState>({
    currentContent: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    playbackRate: 1.0,
    isLoading: false
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('healingmate_preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('healingmate_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Filter content based on search and filters
  useEffect(() => {
    let filtered = allContent;

    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        content.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(content => content.type === selectedType);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(content => content.difficulty === selectedDifficulty);
    }

    setFilteredContent(filtered);
  }, [allContent, searchQuery, selectedType, selectedDifficulty]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const addToFavorites = (contentId: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: [...prev.favorites.filter(id => id !== contentId), contentId]
    }));
  };

  const removeFromFavorites = (contentId: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.filter(id => id !== contentId)
    }));
  };

  const isFavorite = (contentId: string) => {
    return preferences.favorites.includes(contentId);
  };

  const markAsCompleted = (contentId: string) => {
    setPreferences(prev => ({
      ...prev,
      completedSessions: [...prev.completedSessions.filter(id => id !== contentId), contentId]
    }));
  };

  const setPlaybackState = (state: Partial<PlaybackState>) => {
    setPlaybackStateInternal(prev => ({ ...prev, ...state }));
  };

  const playContent = (content: HealingMateContent) => {
    setPlaybackState({
      currentContent: content,
      isPlaying: true,
      isLoading: true,
      currentTime: preferences.lastPlayedPosition[content.id] || 0
    });
  };

  const pauseContent = () => {
    setPlaybackState({ isPlaying: false });
    // Save current position
    if (playbackState.currentContent) {
      setPreferences(prev => ({
        ...prev,
        lastPlayedPosition: {
          ...prev.lastPlayedPosition,
          [playbackState.currentContent!.id]: playbackState.currentTime
        }
      }));
    }
  };

  const resumeContent = () => {
    setPlaybackState({ isPlaying: true });
  };

  const stopContent = () => {
    setPlaybackState({
      currentContent: null,
      isPlaying: false,
      currentTime: 0,
      isLoading: false
    });
  };

  const seekTo = (time: number) => {
    setPlaybackState({ currentTime: time });
  };

  const setVolume = (volume: number) => {
    setPlaybackState({ volume });
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackState({ playbackRate: rate });
  };

  const getPersonalizedRecommendations = (mood?: string, limit: number = 5): HealingMateContent[] => {
    // Simple recommendation algorithm based on preferences and mood
    let recommendations = allContent.filter(content => {
      // Prioritize favorite types
      if (preferences.favoriteTypes.includes(content.type)) return true;
      
      // Mood-based recommendations
      if (mood) {
        const moodTags = preferences.moodCorrelations[mood] || [];
        if (content.tags.some(tag => moodTags.includes(tag))) return true;
        
        // Default mood mappings
        if (mood === 'stressed' && content.tags.includes('relaxation')) return true;
        if (mood === 'anxious' && content.tags.includes('calm')) return true;
        if (mood === 'tired' && content.tags.includes('sleep')) return true;
        if (mood === 'unfocused' && content.tags.includes('focus')) return true;
      }
      
      return false;
    });

    // If no specific recommendations, fall back to popular content
    if (recommendations.length === 0) {
      recommendations = allContent.filter(content => 
        content.difficulty === 'beginner' || content.tags.includes('relaxation')
      );
    }

    // Sort by user preferences and randomize
    recommendations = recommendations
      .sort((a, b) => {
        // Prefer content close to preferred duration
        const aDiff = Math.abs(a.duration - preferences.preferredDuration);
        const bDiff = Math.abs(b.duration - preferences.preferredDuration);
        return aDiff - bDiff;
      })
      .slice(0, limit);

    return recommendations;
  };

  const getSimilarContent = (contentId: string, limit: number = 4): HealingMateContent[] => {
    const content = allContent.find(c => c.id === contentId);
    if (!content) return [];

    return allContent
      .filter(c => c.id !== contentId)
      .filter(c => 
        c.type === content.type || 
        c.category === content.category ||
        c.tags.some(tag => content.tags.includes(tag))
      )
      .slice(0, limit);
  };

  const getContinueWatching = (): HealingMateContent[] => {
    return Object.keys(preferences.lastPlayedPosition)
      .filter(contentId => {
        const progress = preferences.lastPlayedPosition[contentId];
        const content = allContent.find(c => c.id === contentId);
        if (!content) return false;
        // Only show if progress is between 10% and 90%
        const progressPercent = (progress / (content.duration * 60)) * 100;
        return progressPercent >= 10 && progressPercent < 90;
      })
      .map(contentId => allContent.find(c => c.id === contentId)!)
      .filter(Boolean)
      .slice(0, 3);
  };

  const saveProgress = (contentId: string, progress: number, completed: boolean = false) => {
    setPreferences(prev => ({
      ...prev,
      lastPlayedPosition: {
        ...prev.lastPlayedPosition,
        [contentId]: progress
      },
      completedSessions: completed ? 
        [...prev.completedSessions.filter(id => id !== contentId), contentId] :
        prev.completedSessions
    }));
  };

  const getProgress = (contentId: string): number => {
    return preferences.lastPlayedPosition[contentId] || 0;
  };

  const value: HealingMateContextType = {
    // Content
    allContent,
    filteredContent,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    
    // User preferences
    preferences,
    updatePreferences,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    markAsCompleted,
    
    // Playback
    playbackState,
    setPlaybackState,
    playContent,
    pauseContent,
    resumeContent,
    stopContent,
    seekTo,
    setVolume,
    setPlaybackRate,
    
    // Recommendations
    getPersonalizedRecommendations,
    getSimilarContent,
    getContinueWatching,
    
    // Progress tracking
    saveProgress,
    getProgress
  };

  return (
    <HealingMateContext.Provider value={value}>
      {children}
    </HealingMateContext.Provider>
  );
};