import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { MoodEntry, MoodStats, MoodInsight, MOOD_LEVELS, REFLECTION_PROMPTS } from '@/types/mood';
import { toast } from 'sonner';

interface MoodContextType {
  // Data
  moodEntries: MoodEntry[];
  moodStats: MoodStats | null;
  insights: MoodInsight[];
  
  // Actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  updateMoodEntry: (id: string, entry: Partial<MoodEntry>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  exportMoodData: (format: 'csv' | 'pdf') => void;
  
  // State
  isLoading: boolean;
  error: string | null;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

// Local storage keys
const MOOD_ENTRIES_KEY = 'mendedminds_mood_entries';
const MOOD_STATS_KEY = 'mendedminds_mood_stats';

// Mock API functions (using localStorage)
const getMoodEntries = async (userId: string): Promise<MoodEntry[]> => {
  const stored = localStorage.getItem(`${MOOD_ENTRIES_KEY}_${userId}`);
  if (!stored) return [];
  
  const entries = JSON.parse(stored);
  return entries.map((entry: any) => ({
    ...entry,
    timestamp: new Date(entry.timestamp),
  }));
};

const saveMoodEntry = async (entry: MoodEntry): Promise<MoodEntry> => {
  const entries = await getMoodEntries(entry.userId);
  const newEntries = [...entries, entry];
  localStorage.setItem(`${MOOD_ENTRIES_KEY}_${entry.userId}`, JSON.stringify(newEntries));
  return entry;
};

const updateMoodEntry = async (userId: string, id: string, updates: Partial<MoodEntry>): Promise<MoodEntry> => {
  const entries = await getMoodEntries(userId);
  const entryIndex = entries.findIndex(e => e.id === id);
  
  if (entryIndex === -1) {
    throw new Error('Mood entry not found');
  }
  
  const updatedEntry = { ...entries[entryIndex], ...updates };
  entries[entryIndex] = updatedEntry;
  
  localStorage.setItem(`${MOOD_ENTRIES_KEY}_${userId}`, JSON.stringify(entries));
  return updatedEntry;
};

const deleteMoodEntry = async (userId: string, id: string): Promise<void> => {
  const entries = await getMoodEntries(userId);
  const filteredEntries = entries.filter(e => e.id !== id);
  localStorage.setItem(`${MOOD_ENTRIES_KEY}_${userId}`, JSON.stringify(filteredEntries));
};

// Calculate mood statistics
const calculateMoodStats = (entries: MoodEntry[]): MoodStats => {
  if (entries.length === 0) {
    return {
      averageMood: 0,
      totalEntries: 0,
      streak: 0,
      moodDistribution: {},
      recentTrend: 'stable',
    };
  }

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const averageMood = entries.reduce((sum, entry) => sum + entry.moodLevel, 0) / entries.length;
  
  const moodDistribution = entries.reduce((dist, entry) => {
    dist[entry.moodLevel] = (dist[entry.moodLevel] || 0) + 1;
    return dist;
  }, {} as Record<number, number>);

  // Calculate streak (consecutive days with entries)
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (streak < 365) { // Max 365 days
    const dayEntry = entries.find(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toDateString() === currentDate.toDateString();
    });
    
    if (dayEntry) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate recent trend (last 7 days vs previous 7 days)
  const recentEntries = entries.filter(entry => {
    const daysDiff = (today.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });
  
  const previousEntries = entries.filter(entry => {
    const daysDiff = (today.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 7 && daysDiff <= 14;
  });

  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
  
  if (recentEntries.length > 0 && previousEntries.length > 0) {
    const recentAvg = recentEntries.reduce((sum, e) => sum + e.moodLevel, 0) / recentEntries.length;
    const previousAvg = previousEntries.reduce((sum, e) => sum + e.moodLevel, 0) / previousEntries.length;
    
    const difference = recentAvg - previousAvg;
    if (difference > 0.3) recentTrend = 'improving';
    else if (difference < -0.3) recentTrend = 'declining';
  }

  return {
    averageMood,
    totalEntries: entries.length,
    streak,
    moodDistribution,
    recentTrend,
  };
};

// Generate insights based on mood data
const generateInsights = (entries: MoodEntry[], stats: MoodStats): MoodInsight[] => {
  const insights: MoodInsight[] = [];

  // Streak insight
  if (stats.streak > 0) {
    insights.push({
      type: 'streak',
      title: `${stats.streak} Day Streak!`,
      description: `You've been tracking your mood consistently for ${stats.streak} days. Great job!`,
      actionSuggestion: 'Keep up the great work with daily check-ins.',
    });
  }

  // Trend insight
  if (stats.recentTrend === 'improving') {
    insights.push({
      type: 'improvement',
      title: 'Mood Improving',
      description: 'Your mood has been trending upward over the past week.',
      actionSuggestion: 'Keep doing what you\'re doing! Consider noting what activities help.',
    });
  } else if (stats.recentTrend === 'declining') {
    insights.push({
      type: 'concern',
      title: 'Mood Declining',
      description: 'Your mood has been trending downward recently.',
      actionSuggestion: 'Consider reaching out to a therapist or trying some consultant activities.',
    });
  }

  // Pattern insight
  const lowMoodEntries = entries.filter(e => e.moodLevel <= 2);
  if (lowMoodEntries.length > 0 && lowMoodEntries.length / entries.length > 0.3) {
    insights.push({
      type: 'pattern',
      title: 'Frequent Low Moods',
      description: `You've had ${lowMoodEntries.length} low mood entries recently.`,
      actionSuggestion: 'Consider scheduling a session with one of our therapists.',
    });
  }

  return insights;
};

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for mood entries
  const { data: moodEntries = [], isLoading, error } = useQuery({
    queryKey: ['moodEntries', user?.id],
    queryFn: () => getMoodEntries(user?.id || ''),
    enabled: !!user?.id,
  });

  // Calculate stats and insights
  const moodStats = React.useMemo(() => {
    return moodEntries.length > 0 ? calculateMoodStats(moodEntries) : null;
  }, [moodEntries]);

  const insights = React.useMemo(() => {
    return moodStats ? generateInsights(moodEntries, moodStats) : [];
  }, [moodEntries, moodStats]);

  // Mutations
  const addMoodMutation = useMutation({
    mutationFn: async (entryData: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const entry: MoodEntry = {
        ...entryData,
        id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        timestamp: new Date(),
      };
      
      return saveMoodEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries', user?.id] });
      toast.success('Mood entry saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save mood entry');
      console.error('Add mood error:', error);
    },
  });

  const updateMoodMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MoodEntry> }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return updateMoodEntry(user.id, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries', user?.id] });
      toast.success('Mood entry updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update mood entry');
      console.error('Update mood error:', error);
    },
  });

  const deleteMoodMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return deleteMoodEntry(user.id, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries', user?.id] });
      toast.success('Mood entry deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete mood entry');
      console.error('Delete mood error:', error);
    },
  });

  const exportMoodData = (format: 'csv' | 'pdf') => {
    try {
      if (format === 'csv') {
        // CSV export
        const csvHeader = 'Date,Mood Level,Emoji,Notes,Activities\n';
        const csvRows = moodEntries.map(entry => 
          `${entry.timestamp.toISOString().split('T')[0]},${entry.moodLevel},"${entry.emoji}","${entry.notes || ''}","${entry.activities?.join('; ') || ''}"`
        ).join('\n');
        
        const csvContent = csvHeader + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-data-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        window.URL.revokeObjectURL(url);
        toast.success('Mood data exported as CSV!');
      } else {
        // PDF export (requires jsPDF - placeholder for now)
        toast.info('PDF export feature requires jsPDF library. Please install: npm install jspdf');
      }
    } catch (error) {
      toast.error('Failed to export mood data');
      console.error('Export error:', error);
    }
  };

  return (
    <MoodContext.Provider value={{
      moodEntries,
      moodStats,
      insights,
      addMoodEntry: addMoodMutation.mutateAsync,
      updateMoodEntry: (id, updates) => updateMoodMutation.mutateAsync({ id, updates }),
      deleteMoodEntry: deleteMoodMutation.mutateAsync,
      exportMoodData,
      isLoading,
      error: error?.message || null,
    }}>
      {children}
    </MoodContext.Provider>
  );
};