import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Check, Lightbulb, Activity, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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
      <Card className={cn(
        "mx-auto",
        isMobile ? "max-w-full" : "max-w-2xl"
      )}>
        <CardHeader className="text-center">
          <div className={cn(
            "mb-4",
            isMobile ? "text-4xl" : "text-6xl"
          )}>{todaysMoodEntry.emoji}</div>
          <CardTitle className={cn(
            "text-hc-primary",
            isMobile ? "text-lg" : "text-xl"
          )}>Today's Mood Logged</CardTitle>
          <p className={cn(
            "text-gray-600",
            isMobile ? "text-sm" : "text-base"
          )}>
            You logged your mood as {getMoodConfig(todaysMoodEntry.moodLevel)?.label} today
          </p>
        </CardHeader>
        <CardContent className={cn(
          "space-y-4",
          isMobile ? "p-4" : "p-6"
        )}>
          {todaysMoodEntry.notes && (
            <div>
              <h4 className={cn(
                "font-medium text-gray-700 mb-2",
                isMobile ? "text-sm" : "text-base"
              )}>Your Notes:</h4>
              <p className={cn(
                "text-gray-600 bg-gray-50 rounded-lg",
                isMobile ? "p-3 text-sm" : "p-3 text-base"
              )}>
                {todaysMoodEntry.notes}
              </p>
            </div>
          )}
          
          {todaysMoodEntry.activities && todaysMoodEntry.activities.length > 0 && (
            <div>
              <h4 className={cn(
                "font-medium text-gray-700 mb-2",
                isMobile ? "text-sm" : "text-base"
              )}>Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {todaysMoodEntry.activities.map((activity) => (
                  <Badge 
                    key={activity} 
                    variant="secondary" 
                    className={cn(
                      "bg-hc-tertiary/20 text-hc-primary",
                      isMobile ? "text-xs px-2 py-1" : "text-sm"
                    )}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className={cn(
              "text-gray-500 text-center",
              isMobile ? "text-xs" : "text-sm"
            )}>
              Come back tomorrow to log your next mood entry!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(
      "mx-auto",
      isMobile ? "max-w-full space-y-4 px-2" : "max-w-2xl space-y-6"
    )}>
      <Card className="border-hc-soft/50 shadow-lg bg-gradient-to-br from-white to-hc-soft/20">
        <CardHeader className="text-center">
          <div className={cn(
            "flex items-center justify-center mb-4",
            isMobile ? "flex-col space-y-2" : "flex-row"
          )}>
            <div className={cn(
              "rounded-full bg-hc-accent/20",
              isMobile ? "p-3 mb-2" : "p-2 mr-3"
            )}>
              <Calendar className={cn(
                "text-hc-primary",
                isMobile ? "h-6 w-6" : "h-6 w-6"
              )} />
            </div>
            <CardTitle className={cn(
              "text-hc-primary",
              isMobile ? "text-xl text-center" : "text-2xl"
            )}>How are you feeling today?</CardTitle>
          </div>
          <p className={cn(
            "text-slate-700 font-medium",
            isMobile ? "text-sm px-2" : "text-base"
          )}>
            Select your mood and add some notes to track your emotional wellbeing
          </p>
        </CardHeader>
        
        <CardContent className={cn(
          isMobile ? "space-y-4 p-4" : "space-y-6 p-6"
        )}>
          {/* Mood Selection */}
          <div className={cn(
            isMobile ? "space-y-3" : "space-y-4"
          )}>
            <h3 className={cn(
              "font-medium text-gray-700 flex items-center",
              isMobile ? "text-sm" : "text-base"
            )}>
              <Sparkles className="h-4 w-4 mr-2" />
              Your Mood Level
            </h3>
            <div className={cn(
              "grid gap-3",
              isMobile ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-5"
            )}>
              {MOOD_LEVELS.map((mood) => (
                <button
                  key={mood.level}
                  onClick={() => setSelectedMoodLevel(mood.level)}
                  className={cn(
                    "flex flex-col items-center rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    isMobile ? "p-3 min-h-[80px]" : "p-4",
                    selectedMoodLevel === mood.level
                      ? "border-hc-accent bg-hc-accent/10 shadow-md"
                      : "border-gray-200 hover:border-hc-secondary"
                  )}
                >
                  <span className={cn(
                    "mb-2",
                    isMobile ? "text-2xl" : "text-3xl"
                  )}>{mood.emoji}</span>
                  <span className={cn(
                    "font-medium text-center text-gray-700",
                    isMobile ? "text-xs leading-tight" : "text-xs"
                  )}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className={cn(
            isMobile ? "space-y-2" : "space-y-3"
          )}>
            <h3 className={cn(
              "font-medium text-gray-700 flex items-center justify-between",
              isMobile ? "text-sm" : "text-base"
            )}>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Notes (Optional)
              </span>
              <span className={cn(
                "text-gray-500",
                isMobile ? "text-xs" : "text-xs"
              )}>
                {notesCharCount}/{MAX_NOTES_LENGTH}
              </span>
            </h3>
            <Textarea
              placeholder={isMobile 
                ? "What's on your mind today?" 
                : "What's on your mind? How are you feeling today? Any thoughts you'd like to capture..."
              }
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= MAX_NOTES_LENGTH) {
                  setNotes(e.target.value);
                }
              }}
              className={cn(
                "resize-none",
                isMobile ? "min-h-[80px] text-sm" : "min-h-[100px]"
              )}
            />
            <Progress 
              value={(notesCharCount / MAX_NOTES_LENGTH) * 100} 
              className="h-1"
            />
          </div>

          {/* Activities Section */}
          <div className={cn(
            isMobile ? "space-y-2" : "space-y-3"
          )}>
            <div className={cn(
              "flex items-center justify-between",
              isMobile ? "flex-col space-y-2" : "flex-row"
            )}>
              <h3 className={cn(
                "font-medium text-gray-700 flex items-center",
                isMobile ? "text-sm" : "text-base"
              )}>
                <Activity className="h-4 w-4 mr-2" />
                Activities (Optional)
              </h3>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => setShowActivities(!showActivities)}
                className={isMobile ? "w-full h-10" : ""}
              >
                {showActivities ? 'Hide' : 'Add Activities'}
              </Button>
            </div>
            
            {showActivities && (
              <div className={cn(
                isMobile ? "space-y-2" : "space-y-3"
              )}>
                <p className={cn(
                  "text-gray-600",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  What activities did you do today that might have affected your mood?
                </p>
                <div className={cn(
                  "flex flex-wrap",
                  isMobile ? "gap-1.5" : "gap-2"
                )}>
                  {ACTIVITY_SUGGESTIONS.map((activity) => (
                    <Badge
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isMobile ? "text-xs px-2 py-1 h-8" : "text-sm",
                        selectedActivities.includes(activity)
                          ? "bg-hc-accent text-white"
                          : "hover:bg-hc-secondary/20"
                      )}
                      onClick={() => toggleActivity(activity)}
                    >
                      {selectedActivities.includes(activity) && (
                        <Check className={cn(
                          "mr-1",
                          isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                        )} />
                      )}
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reflection Prompts Section */}
          <div className={cn(
            isMobile ? "space-y-2" : "space-y-3"
          )}>
            <div className={cn(
              "flex items-center justify-between",
              isMobile ? "flex-col space-y-2" : "flex-row"
            )}>
              <h3 className={cn(
                "font-medium text-gray-700 flex items-center",
                isMobile ? "text-sm" : "text-base"
              )}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Reflection Prompts (Optional)
              </h3>
              <div className={cn(
                "flex gap-2",
                isMobile ? "w-full" : ""
              )}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddRandomPrompt}
                  className={isMobile ? "flex-1 h-10 text-xs" : ""}
                >
                  Add Random
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompts(!showPrompts)}
                  className={isMobile ? "flex-1 h-10 text-xs" : ""}
                >
                  {showPrompts ? 'Hide' : 'Browse All'}
                </Button>
              </div>
            </div>

            {selectedPrompts.length > 0 && (
              <div className={cn(
                isMobile ? "space-y-1.5" : "space-y-2"
              )}>
                <p className={cn(
                  "text-gray-600",
                  isMobile ? "text-xs" : "text-sm"
                )}>Selected prompts to reflect on:</p>
                {selectedPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-hc-tertiary/10 rounded-lg border border-hc-tertiary/20",
                      isMobile ? "p-2" : "p-3"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-gray-700 flex-1",
                        isMobile ? "text-xs pr-2" : "text-sm"
                      )}>{prompt}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePrompt(prompt)}
                        className={cn(
                          "p-0 ml-2 hover:bg-red-100 hover:text-red-600",
                          isMobile ? "h-5 w-5 text-sm" : "h-6 w-6"
                        )}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showPrompts && (
              <div className={cn(
                "border rounded-lg bg-gray-50 overflow-y-auto",
                isMobile ? "space-y-1.5 max-h-36 p-2" : "space-y-2 max-h-48 p-3"
              )}>
                <p className={cn(
                  "text-gray-600",
                  isMobile ? "text-xs mb-2" : "text-sm mb-3"
                )}>
                  Click on prompts to add them to your reflection:
                </p>
                <div className={cn(
                  isMobile ? "space-y-1.5" : "space-y-2"
                )}>
                  {useMoodTracker().REFLECTION_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => togglePrompt(prompt)}
                      className={cn(
                        "w-full text-left rounded transition-colors",
                        isMobile ? "p-1.5 text-xs" : "p-2 text-sm",
                        selectedPrompts.includes(prompt)
                          ? "bg-hc-accent text-white"
                          : "hover:bg-white hover:shadow-sm"
                      )}
                    >
                      {selectedPrompts.includes(prompt) && (
                        <Check className={cn(
                          "mr-2 inline",
                          isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                        )} />
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
          <div className={cn(
            "flex pt-2",
            isMobile ? "flex-col space-y-2" : "flex-row gap-3"
          )}>
            <Button
              onClick={submitMoodEntry}
              disabled={!selectedMoodLevel || isSubmitting}
              className={cn(
                "bg-hc-primary hover:bg-hc-primary/90 text-white",
                isMobile ? "w-full h-12 text-base font-semibold" : "flex-1"
              )}
            >
              {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
              className={isMobile ? "w-full h-10" : ""}
            >
              Reset
            </Button>
          </div>

          {!selectedMoodLevel && (
            <p className={cn(
              "text-gray-500 text-center",
              isMobile ? "text-xs" : "text-sm"
            )}>
              Please select a mood level to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};