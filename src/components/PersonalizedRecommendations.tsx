import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Heart, 
  Brain, 
  Zap, 
  Moon, 
  Sun, 
  Coffee,
  Sunset,
  RefreshCw,
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { useHealingMate, useRecommendations, useSessionStats } from '@/hooks/useHealingMate';
import { cn } from '@/lib/utils';

interface PersonalizedRecommendationsProps {
  className?: string;
}

// Mood options with associated icons and colors
const moodOptions = [
  { id: 'stressed', name: 'Stressed', icon: Zap, color: 'from-red-500 to-orange-500', description: 'Need to unwind and relax' },
  { id: 'anxious', name: 'Anxious', icon: Brain, color: 'from-yellow-500 to-amber-500', description: 'Looking for calm and peace' },
  { id: 'tired', name: 'Tired', icon: Moon, color: 'from-purple-500 to-indigo-500', description: 'Need rest and restoration' },
  { id: 'unfocused', name: 'Unfocused', icon: Target, color: 'from-blue-500 to-cyan-500', description: 'Want clarity and concentration' },
  { id: 'energized', name: 'Energized', icon: Sun, color: 'from-orange-500 to-pink-500', description: 'Ready for active practices' },
  { id: 'peaceful', name: 'Peaceful', icon: Heart, color: 'from-green-500 to-teal-500', description: 'Maintaining inner balance' }
];

// Time-based recommendations
const timeBasedOptions = [
  { id: 'morning', name: 'Morning Boost', icon: Coffee, description: 'Start your day mindfully' },
  { id: 'afternoon', name: 'Midday Reset', icon: Sun, description: 'Recharge for the afternoon' },
  { id: 'evening', name: 'Evening Wind Down', icon: Sunset, description: 'Transition to rest mode' },
  { id: 'bedtime', name: 'Sleep Preparation', icon: Moon, description: 'Prepare for peaceful sleep' }
];

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  className 
}) => {
  const { preferences } = useHealingMate();
  const { 
    getRecommendationsForMood, 
    dailyRecommendations, 
    continueListening,
    completedCount 
  } = useRecommendations();
  const { 
    totalListeningTime, 
    streakCount, 
    favoriteType, 
    achievements 
  } = useSessionStats();

  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('morning');

  // Get mood-based recommendations
  const moodRecommendations = useMemo(() => {
    if (!selectedMood) return [];
    return getRecommendationsForMood(selectedMood, 6);
  }, [selectedMood, getRecommendationsForMood]);

  // Smart recommendations based on user behavior
  const smartRecommendations = useMemo(() => {
    const currentHour = new Date().getHours();
    let timeBasedMood = 'peaceful';
    
    if (currentHour >= 6 && currentHour < 12) {
      timeBasedMood = 'energized';
    } else if (currentHour >= 12 && currentHour < 17) {
      timeBasedMood = 'unfocused';
    } else if (currentHour >= 17 && currentHour < 21) {
      timeBasedMood = 'stressed';
    } else {
      timeBasedMood = 'tired';
    }

    return getRecommendationsForMood(timeBasedMood, 4);
  }, [getRecommendationsForMood]);

  // Get time-specific recommendations
  const timeRecommendations = useMemo(() => {
    switch (selectedTimeframe) {
      case 'morning':
        return dailyRecommendations.morning;
      case 'afternoon':
        return dailyRecommendations.afternoon;
      case 'evening':
        return dailyRecommendations.evening;
      default:
        return dailyRecommendations.all.slice(0, 4);
    }
  }, [selectedTimeframe, dailyRecommendations]);

  const MoodCard = ({ mood }: { mood: typeof moodOptions[0] }) => {
    const Icon = mood.icon;
    const isSelected = selectedMood === mood.id;

    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          isSelected && 'ring-2 ring-hc-accent shadow-lg'
        )}
        onClick={() => setSelectedMood(isSelected ? '' : mood.id)}
      >
        <CardContent className="p-4 text-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3',
            `bg-gradient-to-br ${mood.color}`
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{mood.name}</h3>
          <p className="text-xs text-gray-600">{mood.description}</p>
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "text-hc-primary" }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className={cn("w-8 h-8 mx-auto mb-2", color)} />
        <div className={cn("text-2xl font-bold mb-1", color)}>{value}</div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{subtitle}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h1>
            <p className="text-gray-600">AI-curated content based on your preferences and mood</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          title="Sessions"
          value={completedCount}
          subtitle="Completed"
          color="text-hc-primary"
        />
        <StatCard
          icon={Clock}
          title="Listen Time"
          value={`${Math.round(totalListeningTime)}m`}
          subtitle="Total minutes"
          color="text-hc-accent"
        />
        <StatCard
          icon={Calendar}
          title="Streak"
          value={`${streakCount}`}
          subtitle="Days in a row"
          color="text-hc-tertiary"
        />
        <StatCard
          icon={Heart}
          title="Favorite"
          value={favoriteType ? favoriteType.charAt(0).toUpperCase() + favoriteType.slice(1) : 'None'}
          subtitle="Content type"
          color="text-hc-secondary"
        />
      </div>

      {/* Continue Listening */}
      {continueListening.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-hc-accent" />
              <span>Continue Listening</span>
              <Badge variant="secondary">{continueListening.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Pick up where you left off with these partially completed sessions.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {continueListening.map(content => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  variant="compact"
                  showProgress={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood">By Mood</TabsTrigger>
          <TabsTrigger value="time">By Time</TabsTrigger>
          <TabsTrigger value="smart">Smart Picks</TabsTrigger>
          <TabsTrigger value="achievements">Progress</TabsTrigger>
        </TabsList>
        
        {/* Mood-Based Tab */}
        <TabsContent value="mood" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {moodOptions.map(mood => (
                <MoodCard key={mood.id} mood={mood} />
              ))}
            </div>
          </div>
          
          {selectedMood && moodRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const mood = moodOptions.find(m => m.id === selectedMood);
                    const Icon = mood?.icon || Heart;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-hc-accent" />
                        <span>For when you're feeling {mood?.name.toLowerCase()}</span>
                        <Badge variant="outline">{moodRecommendations.length} suggestions</Badge>
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {moodRecommendations.map(content => (
                    <ActivityCard
                      key={content.id}
                      content={content}
                      showProgress={true}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Time-Based Tab */}
        <TabsContent value="time" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recommendations by time of day</h2>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeBasedOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {timeBasedOptions.map(option => {
              const Icon = option.icon;
              const isSelected = selectedTimeframe === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover:shadow-md',
                    isSelected && 'ring-2 ring-hc-accent'
                  )}
                  onClick={() => setSelectedTimeframe(option.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={cn(
                      'w-8 h-8 mx-auto mb-2',
                      isSelected ? 'text-hc-accent' : 'text-gray-400'
                    )} />
                    <h3 className="font-semibold text-sm text-gray-900">{option.name}</h3>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {timeRecommendations.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {timeRecommendations.map(content => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Smart Picks Tab */}
        <TabsContent value="smart" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Smart Picks for Right Now</h2>
            <p className="text-gray-600">
              Based on your listening history, current time, and preferences
            </p>
          </div>
          
          {smartRecommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {smartRecommendations.map(content => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  variant="featured"
                  showProgress={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Building your profile</h3>
                <p className="text-gray-600">
                  Complete a few more sessions to get personalized smart recommendations
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Journey</h2>
            <p className="text-gray-600">
              Track your progress and celebrate your achievements
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map(achievement => (
              <Card key={achievement.id} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-hc-primary to-hc-accent rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {achievements.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your journey</h3>
                <p className="text-gray-600 mb-4">
                  Complete your first session to unlock achievements and track your progress
                </p>
                <Button>
                  Browse Content
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};