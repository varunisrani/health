import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MoodEntry {
  day: string;
  mood: string;
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday', 
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const MOOD_EMOJIS = [
  { emoji: '😢', label: 'Sad' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🙂', label: 'Happy' },
  { emoji: '😄', label: 'Very Happy' }
];

export const NewMoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const isMobile = useIsMobile();

  const handleMoodSelect = (day: string, mood: string) => {
    setMoodEntries(prev => {
      const existing = prev.find(entry => entry.day === day);
      if (existing) {
        return prev.map(entry => 
          entry.day === day ? { ...entry, mood } : entry
        );
      }
      return [...prev, { day, mood }];
    });
  };

  const getMoodForDay = (day: string) => {
    return moodEntries.find(entry => entry.day === day)?.mood || '';
  };

  const saveMoodTracker = () => {
    // Save logic would go here
    console.log('Saving mood entries:', moodEntries);
    // You could integrate with your existing mood tracking system here
  };

  return (
    <Card className={cn(
      "mx-auto bg-gradient-to-br from-hc-surface to-hc-soft/30 border-hc-tertiary/20",
      isMobile ? "max-w-full" : "max-w-4xl"
    )}>
      <CardHeader className="text-center pb-4">
        <CardTitle className={cn(
          "text-hc-primary font-semibold",
          isMobile ? "text-lg" : "text-2xl"
        )}>
          Track your mood with our mood tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className={cn(
        isMobile ? "p-4" : "p-6"
      )}>
        <div className="overflow-x-auto">
          <div className={cn(
            "grid gap-4",
            isMobile ? "min-w-[500px]" : ""
          )}>
            {/* Header Row with Mood Emojis */}
            <div className="grid grid-cols-5 gap-2">
              <div className={cn(
                "font-medium text-gray-700 flex items-center justify-center",
                isMobile ? "text-sm p-2" : "text-base p-3"
              )}>
                Day
              </div>
              {MOOD_EMOJIS.map((mood, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center justify-center text-center bg-hc-soft/30 rounded-lg border border-hc-tertiary/20",
                    isMobile ? "p-2" : "p-3"
                  )}
                >
                  <span className={cn(
                    "mb-1",
                    isMobile ? "text-xl" : "text-2xl"
                  )}>
                    {mood.emoji}
                  </span>
                  <span className={cn(
                    "text-gray-600 font-medium",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    {mood.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Weekday Rows */}
            {WEEKDAYS.map((day) => (
              <div key={day} className="grid grid-cols-5 gap-2">
                <div className={cn(
                  "font-medium text-gray-700 flex items-center",
                  isMobile ? "text-sm p-2" : "text-base p-3"
                )}>
                  {day}
                </div>
                {MOOD_EMOJIS.map((mood, moodIndex) => (
                  <div
                    key={moodIndex}
                    className="flex items-center justify-center"
                  >
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`mood-${day}`}
                        value={mood.emoji}
                        checked={getMoodForDay(day) === mood.emoji}
                        onChange={() => handleMoodSelect(day, mood.emoji)}
                        className={cn(
                          "appearance-none border-2 border-hc-tertiary rounded-full transition-all duration-200",
                          "checked:bg-hc-primary checked:border-hc-primary",
                          "hover:border-hc-primary/60 focus:ring-2 focus:ring-hc-primary/20",
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        )}
                      />
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {moodEntries.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={saveMoodTracker}
              className={cn(
                "bg-hc-primary hover:bg-hc-primary/90 text-white font-semibold",
                isMobile ? "w-full px-8 py-3 text-base" : "px-8 py-3"
              )}
            >
              Save Mood Tracker
            </Button>
          </div>
        )}

        {/* Summary */}
        {moodEntries.length > 0 && (
          <div className={cn(
            "mt-6 p-4 bg-hc-soft/20 rounded-lg border border-hc-tertiary/20",
            isMobile ? "text-sm" : "text-base"
          )}>
            <h4 className="font-medium text-gray-700 mb-2">
              Your mood summary this week:
            </h4>
            <div className="flex flex-wrap gap-2">
              {moodEntries.map((entry) => (
                <span
                  key={entry.day}
                  className={cn(
                    "inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-hc-tertiary/20",
                    isMobile ? "text-xs" : "text-sm"
                  )}
                >
                  <span className="font-medium text-gray-600">
                    {entry.day.slice(0, 3)}:
                  </span>
                  <span>{entry.mood}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};