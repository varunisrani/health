import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Lightbulb, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MoodInsights = () => {
  const {
    moodStats,
    insights,
    moodTrendData,
    recentMoodEntries,
    getMoodConfig,
    MOOD_LEVELS,
  } = useMoodTracker();

  if (!moodStats || moodStats.totalEntries === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Mood Data Yet</h3>
            <p className="text-gray-600">
              Start tracking your mood to see insights and trends here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const trendChartData = moodTrendData.map(day => ({
    date: new Date(day.fullDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: day.hasEntry ? day.mood : null,
    hasEntry: day.hasEntry,
  }));

  // Distribution data for pie chart
  const distributionData = MOOD_LEVELS.map(level => ({
    name: level.label,
    value: moodStats.moodDistribution[level.level] || 0,
    color: level.color,
    emoji: level.emoji,
  })).filter(item => item.value > 0);

  // Custom tooltip for trend chart
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0];
      if (data.value !== null) {
        const moodConfig = getMoodConfig(data.value);
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-medium">{label}</p>
            <p className="text-sm flex items-center">
              <span className="mr-2">{moodConfig?.emoji}</span>
              {moodConfig?.label} ({data.value}/5)
            </p>
          </div>
        );
      }
    }
    return null;
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (moodStats.recentTrend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-hc-success" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (moodStats.recentTrend) {
      case 'improving':
        return 'text-hc-success';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-hc-primary mb-1">
              {moodStats.averageMood.toFixed(1)}/5
            </div>
            <p className="text-sm text-gray-600">Average Mood</p>
            <div className="mt-2">
              <Progress value={(moodStats.averageMood / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-hc-accent mr-2" />
              <span className="text-2xl font-bold text-hc-primary">{moodStats.streak}</span>
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-hc-primary mb-1">
              {moodStats.totalEntries}
            </div>
            <p className="text-sm text-gray-600">Total Entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium ml-2 capitalize", getTrendColor())}>
                {moodStats.recentTrend}
              </span>
            </div>
            <p className="text-sm text-gray-600">Recent Trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-hc-primary">
              <Lightbulb className="h-5 w-5 mr-2" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  insight.type === 'improvement' && "bg-hc-success/10 border-hc-success",
                  insight.type === 'concern' && "bg-red-50 border-red-400",
                  insight.type === 'streak' && "bg-blue-50 border-blue-400",
                  insight.type === 'pattern' && "bg-hc-warning/10 border-hc-warning"
                )}
              >
                <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                {insight.actionSuggestion && (
                  <p className="text-sm text-gray-700 italic">
                    💡 {insight.actionSuggestion}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-hc-primary">30-Day Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  domain={[1, 5]} 
                  fontSize={12}
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<TrendTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#4F9CAF"
                  strokeWidth={3}
                  dot={{ fill: '#4F9CAF', strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-hc-primary">Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, emoji }) => `${emoji} ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {recentMoodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-hc-primary">
              <Activity className="h-5 w-5 mr-2" />
              Recent Entries (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMoodEntries.slice(0, 5).map((entry) => {
                const moodConfig = getMoodConfig(entry.moodLevel);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {moodConfig?.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                        {entry.moodLevel}/5
                      </Badge>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-1 max-w-32 truncate">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};