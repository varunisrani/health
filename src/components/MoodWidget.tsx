import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Heart, TrendingUp, TrendingDown, Minus, Plus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MoodWidgetProps {
  onNavigateToMoodTracker?: () => void;
}

export const MoodWidget: React.FC<MoodWidgetProps> = ({ onNavigateToMoodTracker }) => {
  const {
    hasLoggedToday,
    todaysMoodEntry,
    moodStats,
    recentMoodEntries,
    selectedMoodLevel,
    setSelectedMoodLevel,
    submitMoodEntry,
    getMoodConfig,
    isSubmitting,
    MOOD_LEVELS,
  } = useMoodTracker();

  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const isMobile = useIsMobile();

  const handleQuickMoodEntry = async (moodLevel: number) => {
    setSelectedMoodLevel(moodLevel);
    try {
      await submitMoodEntry();
      setShowQuickEntry(false);
    } catch (error) {
      console.error('Quick mood entry error:', error);
    }
  };

  // Get trend icon based on recent mood data
  const getTrendIndicator = () => {
    if (!moodStats) return null;
    
    switch (moodStats.recentTrend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-hc-primary" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-hc-primary" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!moodStats) return 'text-gray-600';
    
    switch (moodStats.recentTrend) {
      case 'improving':
        return 'text-hc-primary';
      case 'declining':
        return 'text-hc-primary';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? "pb-2 px-4 pt-4" : "pb-3"}>
        <CardTitle className="flex items-center justify-between text-hc-primary">
          <span className="flex items-center">
            <Heart className={`mr-2 ${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
            <span className={isMobile ? "text-sm" : "text-base"}>Mood Tracker</span>
          </span>
          {moodStats && moodStats.totalEntries > 0 && (
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "sm"}
              onClick={onNavigateToMoodTracker}
              className="text-hc-accent hover:text-hc-accent/80 h-8 w-8 p-1"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`space-y-3 ${isMobile ? "px-4 pb-4" : "space-y-4"}`}>
        {/* Today's Mood Status */}
        {hasLoggedToday && todaysMoodEntry ? (
          <div className="text-center space-y-2 sm:space-y-3">
            <div className={isMobile ? "text-3xl" : "text-4xl"}>{todaysMoodEntry.emoji}</div>
            <div>
              <Badge variant="secondary" className={`bg-hc-tertiary/20 text-hc-primary ${isMobile ? "text-xs px-2 py-1" : ""}`}>
                {getMoodConfig(todaysMoodEntry.moodLevel)?.label}
              </Badge>
            </div>
            <p className={`text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
              You logged your mood today!
            </p>
          </div>
        ) : (
          <div className={isMobile ? "space-y-3" : "space-y-4"}>
            {/* Quick Entry Toggle */}
            {!showQuickEntry ? (
              <div className="text-center space-y-2 sm:space-y-3">
                <div className={isMobile ? "text-3xl text-gray-300" : "text-4xl text-gray-300"}>😊</div>
                <p className={`text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
                  How are you feeling today?
                </p>
                <Button
                  onClick={() => setShowQuickEntry(true)}
                  size={isMobile ? "sm" : "sm"}
                  className={`bg-hc-accent hover:bg-hc-accent/90 text-white ${isMobile ? "h-9 px-3 text-xs" : ""}`}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Quick Log
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                <p className={`text-gray-600 text-center ${isMobile ? "text-xs" : "text-sm"}`}>Select your mood:</p>
                <div className={`grid gap-1.5 sm:gap-2 ${isMobile ? "grid-cols-5" : "grid-cols-5"}`}>
                  {MOOD_LEVELS.map((mood) => (
                    <button
                      key={mood.level}
                      onClick={() => handleQuickMoodEntry(mood.level)}
                      disabled={isSubmitting}
                      className={cn(
                        "flex flex-col items-center rounded-lg border transition-all duration-200 hover:scale-105",
                        isMobile ? "p-1.5 h-12" : "p-2",
                        isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-hc-accent hover:bg-hc-accent/5"
                      )}
                    >
                      <span className={isMobile ? "text-base mb-0.5" : "text-lg mb-1"}>{mood.emoji}</span>
                      <span className={`text-center text-gray-600 ${isMobile ? "text-[10px] leading-none" : "text-xs"}`}>
                        {mood.level}
                      </span>
                    </button>
                  ))}
                </div>
                <div className={`flex justify-center ${isMobile ? "space-x-1" : "space-x-2"}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickEntry(false)}
                    disabled={isSubmitting}
                    className={isMobile ? "h-8 px-2 text-xs" : ""}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNavigateToMoodTracker}
                    className={isMobile ? "h-8 px-2 text-xs" : ""}
                  >
                    Full Entry
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Section */}
        {moodStats && moodStats.totalEntries > 0 && (
          <div className="space-y-3 pt-3 border-t">
            {/* Average Mood */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Mood</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-hc-primary">
                  {moodStats.averageMood.toFixed(1)}/5
                </span>
              </div>
            </div>
            <Progress value={(moodStats.averageMood / 5) * 100} className="h-2" />

            {/* Streak and Trend */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">Streak:</span>
                <span className="font-medium text-hc-primary">{moodStats.streak} days</span>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIndicator()}
                <span className={cn("text-xs capitalize", getTrendColor())}>
                  {moodStats.recentTrend}
                </span>
              </div>
            </div>

            {/* Recent Entries Preview */}
            {recentMoodEntries.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-gray-500">Recent entries:</span>
                <div className="flex space-x-1 justify-center">
                  {recentMoodEntries.slice(0, 7).map((entry, index) => (
                    <div
                      key={entry.id}
                      className="text-sm opacity-75"
                      style={{ opacity: 1 - (index * 0.1) }}
                    >
                      {entry.emoji}
                    </div>
                  ))}
                  {recentMoodEntries.length > 7 && (
                    <span className="text-xs text-gray-400">...</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* First Time User */}
        {(!moodStats || moodStats.totalEntries === 0) && !hasLoggedToday && !showQuickEntry && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              Start tracking your daily mood to see insights and trends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};