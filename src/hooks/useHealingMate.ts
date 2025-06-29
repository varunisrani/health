import { useCallback, useMemo } from 'react';
import { useHealingMate as useHealingMateContext } from '@/context/HealingMateContext';
import type { HealingMateContent } from '@/context/HealingMateContext';

// Additional hooks for specific HealingMate functionality
export const useHealingMate = () => {
  return useHealingMateContext();
};

// Hook for managing audio playback with HTML5 audio element
export const useAudioPlayer = () => {
  const { playbackState, setPlaybackState, saveProgress } = useHealingMateContext();

  const updateProgress = useCallback((currentTime: number, duration: number) => {
    setPlaybackState({ currentTime, duration });
    
    // Save progress every 10 seconds
    if (playbackState.currentContent && Math.floor(currentTime) % 10 === 0) {
      const completed = currentTime >= duration * 0.95; // 95% completion counts as finished
      saveProgress(playbackState.currentContent.id, currentTime, completed);
    }
  }, [playbackState.currentContent, setPlaybackState, saveProgress]);

  const handleLoadStart = useCallback(() => {
    setPlaybackState({ isLoading: true });
  }, [setPlaybackState]);

  const handleCanPlay = useCallback(() => {
    setPlaybackState({ isLoading: false });
  }, [setPlaybackState]);

  const handleEnded = useCallback(() => {
    if (playbackState.currentContent) {
      saveProgress(playbackState.currentContent.id, playbackState.duration, true);
      setPlaybackState({ isPlaying: false, currentTime: 0 });
    }
  }, [playbackState.currentContent, playbackState.duration, setPlaybackState, saveProgress]);

  const handleError = useCallback((error: Event) => {
    console.error('Audio playback error:', error);
    setPlaybackState({ isLoading: false, isPlaying: false });
  }, [setPlaybackState]);

  return {
    updateProgress,
    handleLoadStart,
    handleCanPlay,
    handleEnded,
    handleError
  };
};

// Hook for filtering and searching content
export const useContentFilter = () => {
  const {
    filteredContent,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    allContent
  } = useHealingMateContext();

  const contentTypes = useMemo(() => {
    const types = Array.from(new Set(allContent.map(content => content.type)));
    return types.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
    }));
  }, [allContent]);

  const difficulties = useMemo(() => {
    const difficulties = Array.from(new Set(allContent.map(content => content.difficulty)));
    return difficulties.map(difficulty => ({
      value: difficulty,
      label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    }));
  }, [allContent]);

  const categories = useMemo(() => {
    const categories = Array.from(new Set(allContent.map(content => content.category)));
    return categories.sort();
  }, [allContent]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType(null);
    setSelectedDifficulty(null);
  }, [setSearchQuery, setSelectedType, setSelectedDifficulty]);

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || selectedType !== null || selectedDifficulty !== null;
  }, [searchQuery, selectedType, selectedDifficulty]);

  return {
    filteredContent,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    contentTypes,
    difficulties,
    categories,
    clearFilters,
    hasActiveFilters
  };
};

// Hook for managing favorites
export const useFavorites = () => {
  const { preferences, addToFavorites, removeFromFavorites, isFavorite, allContent } = useHealingMateContext();

  const favoriteContent = useMemo(() => {
    return preferences.favorites
      .map(id => allContent.find(content => content.id === id))
      .filter(Boolean) as HealingMateContent[];
  }, [preferences.favorites, allContent]);

  const toggleFavorite = useCallback((contentId: string) => {
    if (isFavorite(contentId)) {
      removeFromFavorites(contentId);
    } else {
      addToFavorites(contentId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favoriteContent,
    toggleFavorite,
    isFavorite
  };
};

// Hook for personalized recommendations
export const useRecommendations = () => {
  const { 
    getPersonalizedRecommendations, 
    getSimilarContent, 
    getContinueWatching,
    preferences 
  } = useHealingMateContext();

  const getRecommendationsForMood = useCallback((mood: string, limit?: number) => {
    return getPersonalizedRecommendations(mood, limit);
  }, [getPersonalizedRecommendations]);

  const dailyRecommendations = useMemo(() => {
    // Get varied recommendations for daily use
    const morning = getPersonalizedRecommendations('energized', 2);
    const afternoon = getPersonalizedRecommendations('focused', 2);
    const evening = getPersonalizedRecommendations('relaxed', 2);
    
    return {
      morning,
      afternoon,
      evening,
      all: [...morning, ...afternoon, ...evening]
    };
  }, [getPersonalizedRecommendations]);

  const continueListening = useMemo(() => {
    return getContinueWatching();
  }, [getContinueWatching]);

  return {
    getRecommendationsForMood,
    getSimilarContent,
    dailyRecommendations,
    continueListening,
    completedCount: preferences.completedSessions.length
  };
};

// Hook for session progress and statistics
export const useSessionStats = () => {
  const { preferences, allContent } = useHealingMateContext();

  const totalListeningTime = useMemo(() => {
    return preferences.completedSessions.reduce((total, sessionId) => {
      const content = allContent.find(c => c.id === sessionId);
      return total + (content?.duration || 0);
    }, 0);
  }, [preferences.completedSessions, allContent]);

  const streakCount = useMemo(() => {
    // Simple streak calculation - could be enhanced with actual dates
    return Math.min(preferences.completedSessions.length, 7);
  }, [preferences.completedSessions]);

  const favoriteType = useMemo(() => {
    if (preferences.favoriteTypes.length === 0) return null;
    
    // Count completions by type
    const typeCounts: Record<string, number> = {};
    preferences.completedSessions.forEach(sessionId => {
      const content = allContent.find(c => c.id === sessionId);
      if (content) {
        typeCounts[content.type] = (typeCounts[content.type] || 0) + 1;
      }
    });

    // Return the most completed type
    return Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    )[0] || null;
  }, [preferences.completedSessions, allContent]);

  const achievements = useMemo(() => {
    const achievements = [];
    
    if (preferences.completedSessions.length >= 1) {
      achievements.push({ id: 'first-session', title: 'First Steps', description: 'Completed your first session' });
    }
    
    if (preferences.completedSessions.length >= 5) {
      achievements.push({ id: 'five-sessions', title: 'Getting Started', description: 'Completed 5 sessions' });
    }
    
    if (preferences.completedSessions.length >= 10) {
      achievements.push({ id: 'ten-sessions', title: 'Committed', description: 'Completed 10 sessions' });
    }
    
    if (streakCount >= 3) {
      achievements.push({ id: 'streak-3', title: 'Building Habits', description: '3-day streak' });
    }
    
    if (streakCount >= 7) {
      achievements.push({ id: 'streak-7', title: 'Weekly Warrior', description: '7-day streak' });
    }
    
    if (totalListeningTime >= 60) {
      achievements.push({ id: 'hour-listener', title: 'Dedicated Listener', description: '1+ hour of content' });
    }

    return achievements;
  }, [preferences.completedSessions.length, streakCount, totalListeningTime]);

  return {
    totalListeningTime,
    completedSessions: preferences.completedSessions.length,
    streakCount,
    favoriteType,
    achievements
  };
};