import { useState, useCallback, useMemo } from 'react';
import { useMood } from '@/context/MoodContext';
import { MoodEntry, MoodFilter, MOOD_LEVELS, ACTIVITY_SUGGESTIONS, REFLECTION_PROMPTS } from '@/types/mood';
import { toast } from 'sonner';

export const useMoodTracker = () => {
  const {
    moodEntries,
    moodStats,
    insights,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    exportMoodData,
    isLoading,
    error,
  } = useMood();

  // Local state for form management
  const [selectedMoodLevel, setSelectedMoodLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<Partial<MoodFilter>>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
  });

  // Get mood level configuration
  const getMoodConfig = useCallback((level: number) => {
    return MOOD_LEVELS.find(m => m.level === level);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setSelectedMoodLevel(null);
    setNotes('');
    setSelectedActivities([]);
    setSelectedPrompts([]);
  }, []);

  // Submit mood entry
  const submitMoodEntry = useCallback(async () => {
    if (!selectedMoodLevel) {
      toast.error('Please select a mood level');
      return;
    }

    const moodConfig = getMoodConfig(selectedMoodLevel);
    if (!moodConfig) {
      toast.error('Invalid mood level selected');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMoodEntry({
        moodLevel: selectedMoodLevel,
        emoji: moodConfig.emoji,
        notes: notes.trim() || undefined,
        activities: selectedActivities.length > 0 ? selectedActivities : undefined,
        reflectionPrompts: selectedPrompts.length > 0 ? selectedPrompts : undefined,
      });

      resetForm();
      toast.success('Mood entry saved successfully!');
    } catch (error) {
      console.error('Error submitting mood entry:', error);
      toast.error('Failed to save mood entry');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMoodLevel, notes, selectedActivities, selectedPrompts, addMoodEntry, getMoodConfig, resetForm]);

  // Toggle activity selection
  const toggleActivity = useCallback((activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  }, []);

  // Toggle reflection prompt selection
  const togglePrompt = useCallback((prompt: string) => {
    setSelectedPrompts(prev =>
      prev.includes(prompt)
        ? prev.filter(p => p !== prompt)
        : [...prev, prompt]
    );
  }, []);

  // Get today's mood entry
  const todaysMoodEntry = useMemo(() => {
    const today = new Date().toDateString();
    return moodEntries.find(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  }, [moodEntries]);

  // Check if user has logged mood today
  const hasLoggedToday = useMemo(() => {
    return !!todaysMoodEntry;
  }, [todaysMoodEntry]);

  // Filter mood entries based on current filter
  const filteredMoodEntries = useMemo(() => {
    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      
      // Date range filter
      if (filter.dateRange) {
        if (entryDate < filter.dateRange.start || entryDate > filter.dateRange.end) {
          return false;
        }
      }

      // Mood level filter
      if (filter.moodLevels && filter.moodLevels.length > 0) {
        if (!filter.moodLevels.includes(entry.moodLevel)) {
          return false;
        }
      }

      // Has notes filter
      if (filter.hasNotes !== undefined) {
        const hasNotes = !!(entry.notes && entry.notes.trim());
        if (filter.hasNotes !== hasNotes) {
          return false;
        }
      }

      return true;
    });
  }, [moodEntries, filter]);

  // Get recent mood entries (last 7 days)
  const recentMoodEntries = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return moodEntries
      .filter(entry => new Date(entry.timestamp) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [moodEntries]);

  // Get mood trend data for charts
  const moodTrendData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        fullDate: new Date(date),
        mood: 0,
        hasEntry: false,
      };
    });

    // Fill in actual mood data
    moodEntries.forEach(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      const dayData = last30Days.find(day => day.date === entryDate);
      if (dayData) {
        dayData.mood = entry.moodLevel;
        dayData.hasEntry = true;
      }
    });

    return last30Days;
  }, [moodEntries]);

  // Get random reflection prompt
  const getRandomPrompt = useCallback(() => {
    const availablePrompts = REFLECTION_PROMPTS.filter(prompt => !selectedPrompts.includes(prompt));
    if (availablePrompts.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    return availablePrompts[randomIndex];
  }, [selectedPrompts]);

  // Export functions
  const exportToCSV = useCallback(() => {
    exportMoodData('csv');
  }, [exportMoodData]);

  const exportToPDF = useCallback(() => {
    exportMoodData('pdf');
  }, [exportMoodData]);

  return {
    // Data
    moodEntries: filteredMoodEntries,
    recentMoodEntries,
    moodStats,
    insights,
    moodTrendData,
    todaysMoodEntry,
    hasLoggedToday,

    // Form state
    selectedMoodLevel,
    setSelectedMoodLevel,
    notes,
    setNotes,
    selectedActivities,
    selectedPrompts,

    // Filter state
    filter,
    setFilter,

    // Actions
    submitMoodEntry,
    resetForm,
    toggleActivity,
    togglePrompt,
    updateMoodEntry,
    deleteMoodEntry,
    exportToCSV,
    exportToPDF,

    // Utilities
    getMoodConfig,
    getRandomPrompt,

    // Constants
    MOOD_LEVELS,
    ACTIVITY_SUGGESTIONS,
    REFLECTION_PROMPTS,

    // State
    isLoading,
    isSubmitting,
    error,
  };
};