import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Check, Lightbulb, Activity, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MoodTracker = () => {
  const {
    selectedMoodLevel,
    setSelectedMoodLevel,
    notes,
    setNotes,
    selectedActivities,
    selectedPrompts,
    submitMoodEntry,
    resetForm,
    toggleActivity,
    togglePrompt,
    getMoodConfig,
    getRandomPrompt,
    hasLoggedToday,
    todaysMoodEntry,
    isSubmitting,
    MOOD_LEVELS,
    ACTIVITY_SUGGESTIONS,
  } = useMoodTracker();

  const [showActivities, setShowActivities] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  // Character limit for notes
  const MAX_NOTES_LENGTH = 500;
  const notesCharCount = notes.length;

  const handleAddRandomPrompt = () => {
    const randomPrompt = getRandomPrompt();
    if (randomPrompt) {
      togglePrompt(randomPrompt);
    }
  };

  if (hasLoggedToday && todaysMoodEntry) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{todaysMoodEntry.emoji}</div>
          <CardTitle className="text-hc-primary">Today's Mood Logged</CardTitle>
          <p className="text-gray-600">
            You logged your mood as {getMoodConfig(todaysMoodEntry.moodLevel)?.label} today
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysMoodEntry.notes && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Your Notes:</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {todaysMoodEntry.notes}
              </p>
            </div>
          )}
          
          {todaysMoodEntry.activities && todaysMoodEntry.activities.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {todaysMoodEntry.activities.map((activity) => (
                  <Badge key={activity} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 text-center">
              Come back tomorrow to log your next mood entry!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-hc-soft/50 shadow-lg bg-gradient-to-br from-white to-hc-soft/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 rounded-full bg-hc-accent/20 mr-3">
              <Calendar className="h-6 w-6 text-hc-primary" />
            </div>
            <CardTitle className="text-hc-primary text-2xl">How are you feeling today?</CardTitle>
          </div>
          <p className="text-slate-700 font-medium">
            Select your mood and add some notes to track your emotional wellbeing
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Your Mood Level
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {MOOD_LEVELS.map((mood) => (
                <button
                  key={mood.level}
                  onClick={() => setSelectedMoodLevel(mood.level)}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    selectedMoodLevel === mood.level
                      ? "border-hc-accent bg-hc-accent/10 shadow-md"
                      : "border-gray-200 hover:border-hc-secondary"
                  )}
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="text-xs font-medium text-center text-gray-700">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 flex items-center justify-between">
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Notes (Optional)
              </span>
              <span className="text-xs text-gray-500">
                {notesCharCount}/{MAX_NOTES_LENGTH}
              </span>
            </h3>
            <Textarea
              placeholder="What's on your mind? How are you feeling today? Any thoughts you'd like to capture..."
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= MAX_NOTES_LENGTH) {
                  setNotes(e.target.value);
                }
              }}
              className="min-h-[100px] resize-none"
            />
            <Progress 
              value={(notesCharCount / MAX_NOTES_LENGTH) * 100} 
              className="h-1"
            />
          </div>

          {/* Activities Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Activities (Optional)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActivities(!showActivities)}
              >
                {showActivities ? 'Hide' : 'Add Activities'}
              </Button>
            </div>
            
            {showActivities && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  What activities did you do today that might have affected your mood?
                </p>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_SUGGESTIONS.map((activity) => (
                    <Badge
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedActivities.includes(activity)
                          ? "bg-hc-accent text-white"
                          : "hover:bg-hc-secondary/20"
                      )}
                      onClick={() => toggleActivity(activity)}
                    >
                      {selectedActivities.includes(activity) && (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reflection Prompts Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Reflection Prompts (Optional)
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddRandomPrompt}
                >
                  Add Random
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompts(!showPrompts)}
                >
                  {showPrompts ? 'Hide' : 'Browse All'}
                </Button>
              </div>
            </div>

            {selectedPrompts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Selected prompts to reflect on:</p>
                {selectedPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-3 bg-hc-tertiary/10 rounded-lg border border-hc-tertiary/20"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 flex-1">{prompt}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePrompt(prompt)}
                        className="h-6 w-6 p-0 ml-2 hover:bg-red-100 hover:text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showPrompts && (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">
                  Click on prompts to add them to your reflection:
                </p>
                <div className="space-y-2">
                  {useMoodTracker().REFLECTION_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => togglePrompt(prompt)}
                      className={cn(
                        "w-full text-left p-2 rounded text-sm transition-colors",
                        selectedPrompts.includes(prompt)
                          ? "bg-hc-accent text-white"
                          : "hover:bg-white hover:shadow-sm"
                      )}
                    >
                      {selectedPrompts.includes(prompt) && (
                        <Check className="h-3 w-3 mr-2 inline" />
                      )}
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={submitMoodEntry}
              disabled={!selectedMoodLevel || isSubmitting}
              className="flex-1 bg-hc-primary hover:bg-hc-primary/90 text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>

          {!selectedMoodLevel && (
            <p className="text-sm text-gray-500 text-center">
              Please select a mood level to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};