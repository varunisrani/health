import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodTracker } from '@/components/MoodTracker';
import { MoodInsights } from '@/components/MoodInsights';
import { MoodHistory } from '@/components/MoodHistory';
import { MoodExport } from '@/components/MoodExport';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, BarChart3, History, Download, TrendingUp, Calendar, Target } from 'lucide-react';

export const MoodTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('tracker');
  const { moodStats, hasLoggedToday, todaysMoodEntry, getMoodConfig } = useMoodTracker();
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Header with Quick Stats */}
      <div className={`grid gap-3 sm:gap-4 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'
      }`}>
        <Card>
          <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-center mb-2 ${
              isMobile ? 'flex-col space-y-1' : ''
            }`}>
              <Heart className={`text-hc-accent ${isMobile ? 'h-4 w-4 mb-1' : 'h-5 w-5 mr-2'}`} />
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? "Today" : "Today's Mood"}
              </span>
            </div>
            {hasLoggedToday && todaysMoodEntry ? (
              <div className="space-y-1">
                <div className={isMobile ? "text-2xl" : "text-3xl"}>{todaysMoodEntry.emoji}</div>
                <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {getMoodConfig(todaysMoodEntry.moodLevel)?.label}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className={`text-gray-400 ${isMobile ? 'text-xl' : 'text-2xl'}`}>—</div>
                <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {isMobile ? "Not logged" : "Not logged yet"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-center mb-2 ${
              isMobile ? 'flex-col space-y-1' : ''
            }`}>
              <TrendingUp className={`text-hc-primary ${isMobile ? 'h-4 w-4 mb-1' : 'h-5 w-5 mr-2'}`} />
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? "Average" : "Average Mood"}
              </span>
            </div>
            <div className={`font-bold text-hc-primary ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {moodStats?.averageMood ? moodStats.averageMood.toFixed(1) : '—'}
            </div>
            <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {moodStats?.averageMood ? (isMobile ? '/5' : 'out of 5') : 'No data'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-center mb-2 ${
              isMobile ? 'flex-col space-y-1' : ''
            }`}>
              <Calendar className={`text-hc-accent ${isMobile ? 'h-4 w-4 mb-1' : 'h-5 w-5 mr-2'}`} />
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Streak</span>
            </div>
            <div className={`font-bold text-hc-primary ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {moodStats?.streak || 0}
            </div>
            <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {moodStats?.streak === 1 ? 'day' : 'days'}
            </div>
          </CardContent>
        </Card>

        <Card className={isMobile ? "col-span-2" : ""}>
          <CardContent className={`text-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-center mb-2 ${
              isMobile ? 'flex-col space-y-1' : ''
            }`}>
              <Target className={`text-hc-primary ${isMobile ? 'h-4 w-4 mb-1' : 'h-5 w-5 mr-2'}`} />
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? "Total" : "Total Entries"}
              </span>
            </div>
            <div className={`font-bold text-hc-primary ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {moodStats?.totalEntries || 0}
            </div>
            <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>entries</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mood Tracker Interface */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className={isMobile ? "space-y-4" : "space-y-6"}>
        <TabsList className={`grid w-full mx-auto ${
          isMobile ? 'grid-cols-2 max-w-sm' : 'grid-cols-4 max-w-2xl'
        }`}>
          <TabsTrigger value="tracker" className={`flex items-center ${
            isMobile ? 'flex-col space-y-1 px-2 py-2' : 'space-x-2'
          }`}>
            <Heart className="h-4 w-4" />
            <span className={isMobile ? "text-xs" : "hidden sm:inline"}>Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className={`flex items-center ${
            isMobile ? 'flex-col space-y-1 px-2 py-2' : 'space-x-2'
          }`}>
            <BarChart3 className="h-4 w-4" />
            <span className={isMobile ? "text-xs" : "hidden sm:inline"}>Insights</span>
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
            </>
          )}
          {isMobile && (
            <TabsTrigger value="history" className="flex items-center flex-col space-y-1 px-2 py-2">
              <History className="h-4 w-4" />
              <span className="text-xs">More</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="tracker" className={isMobile ? "space-y-4" : "space-y-6"}>
          <div className={isMobile ? "" : "max-w-4xl mx-auto"}>
            <MoodTracker />
          </div>
        </TabsContent>

        <TabsContent value="insights" className={isMobile ? "space-y-4" : "space-y-6"}>
          <div className={isMobile ? "" : "max-w-6xl mx-auto"}>
            <MoodInsights />
          </div>
        </TabsContent>

        <TabsContent value="history" className={isMobile ? "space-y-4" : "space-y-6"}>
          <div className={isMobile ? "" : "max-w-4xl mx-auto"}>
            {isMobile ? (
              <Tabs defaultValue="history" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
                  <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
                </TabsList>
                <TabsContent value="history">
                  <MoodHistory />
                </TabsContent>
                <TabsContent value="export">
                  <MoodExport />
                </TabsContent>
              </Tabs>
            ) : (
              <MoodHistory />
            )}
          </div>
        </TabsContent>

        {!isMobile && (
          <TabsContent value="export" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <MoodExport />
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Welcome Message for New Users */}
      {!moodStats || moodStats.totalEntries === 0 ? (
        <Card className={isMobile ? "" : "max-w-2xl mx-auto"}>
          <CardHeader className="text-center">
            <div className={isMobile ? "text-4xl mb-3" : "text-6xl mb-4"}>🌟</div>
            <CardTitle className={`text-hc-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Welcome to Mood Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className={`text-center ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Track your daily mood to gain insights into your emotional wellbeing and identify patterns that can help improve your mental health.
            </p>
            <div className={`grid gap-3 sm:gap-4 text-left ${
              isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              <div className={`bg-hc-surface rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                <h4 className={`font-medium text-hc-primary mb-2 flex items-center ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <Heart className="h-4 w-4 mr-2" />
                  Daily Check-ins
                </h4>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Log your mood once per day with notes and activities that affected your feelings.
                </p>
              </div>
              <div className={`bg-hc-surface rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                <h4 className={`font-medium text-hc-primary mb-2 flex items-center ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Track Trends
                </h4>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  View charts and insights to understand your mood patterns over time.
                </p>
              </div>
              <div className={`bg-hc-surface rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                <h4 className={`font-medium text-hc-primary mb-2 flex items-center ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <History className="h-4 w-4 mr-2" />
                  Review History
                </h4>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Look back at your entries to see how your mood changes with different activities.
                </p>
              </div>
              <div className={`bg-hc-surface rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
                <h4 className={`font-medium text-hc-primary mb-2 flex items-center ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </h4>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
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