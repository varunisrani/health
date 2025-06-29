import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodTracker } from '@/components/MoodTracker';
import { MoodInsights } from '@/components/MoodInsights';
import { MoodHistory } from '@/components/MoodHistory';
import { MoodExport } from '@/components/MoodExport';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Heart, BarChart3, History, Download, TrendingUp, Calendar, Target } from 'lucide-react';

export const MoodTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('tracker');
  const { moodStats, hasLoggedToday, todaysMoodEntry, getMoodConfig } = useMoodTracker();

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-hc-accent mr-2" />
              <span className="text-sm font-medium text-gray-600">Today's Mood</span>
            </div>
            {hasLoggedToday && todaysMoodEntry ? (
              <div className="space-y-1">
                <div className="text-3xl">{todaysMoodEntry.emoji}</div>
                <div className="text-sm text-gray-600">
                  {getMoodConfig(todaysMoodEntry.moodLevel)?.label}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl text-gray-400">—</div>
                <div className="text-sm text-gray-500">Not logged yet</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-hc-primary mr-2" />
              <span className="text-sm font-medium text-gray-600">Average Mood</span>
            </div>
            <div className="text-2xl font-bold text-hc-primary">
              {moodStats?.averageMood ? moodStats.averageMood.toFixed(1) : '—'}
            </div>
            <div className="text-sm text-gray-500">
              {moodStats?.averageMood ? 'out of 5' : 'No data'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-hc-accent mr-2" />
              <span className="text-sm font-medium text-gray-600">Streak</span>
            </div>
            <div className="text-2xl font-bold text-hc-primary">
              {moodStats?.streak || 0}
            </div>
            <div className="text-sm text-gray-500">
              {moodStats?.streak === 1 ? 'day' : 'days'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-hc-primary mr-2" />
              <span className="text-sm font-medium text-gray-600">Total Entries</span>
            </div>
            <div className="text-2xl font-bold text-hc-primary">
              {moodStats?.totalEntries || 0}
            </div>
            <div className="text-sm text-gray-500">entries</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mood Tracker Interface */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="tracker" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <MoodTracker />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="max-w-6xl mx-auto">
            <MoodInsights />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <MoodHistory />
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <MoodExport />
          </div>
        </TabsContent>
      </Tabs>

      {/* Welcome Message for New Users */}
      {!moodStats || moodStats.totalEntries === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🌟</div>
            <CardTitle className="text-hc-primary">Welcome to Mood Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Track your daily mood to gain insights into your emotional wellbeing and identify patterns that can help improve your mental health.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-hc-surface rounded-lg">
                <h4 className="font-medium text-hc-primary mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Daily Check-ins
                </h4>
                <p className="text-sm text-gray-600">
                  Log your mood once per day with notes and activities that affected your feelings.
                </p>
              </div>
              <div className="p-4 bg-hc-surface rounded-lg">
                <h4 className="font-medium text-hc-primary mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Track Trends
                </h4>
                <p className="text-sm text-gray-600">
                  View charts and insights to understand your mood patterns over time.
                </p>
              </div>
              <div className="p-4 bg-hc-surface rounded-lg">
                <h4 className="font-medium text-hc-primary mb-2 flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Review History
                </h4>
                <p className="text-sm text-gray-600">
                  Look back at your entries to see how your mood changes with different activities.
                </p>
              </div>
              <div className="p-4 bg-hc-surface rounded-lg">
                <h4 className="font-medium text-hc-primary mb-2 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </h4>
                <p className="text-sm text-gray-600">
                  Download your mood data for backup or to share with healthcare providers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};