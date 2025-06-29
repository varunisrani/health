import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Brain, 
  Moon, 
  Zap, 
  Heart, 
  Shield, 
  Clock, 
  User, 
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityPlayer } from '@/components/ActivityPlayer';
import { useHealingMate, useContentFilter, useSessionStats } from '@/hooks/useHealingMate';
import { cn } from '@/lib/utils';

interface GuidedMeditationProps {
  className?: string;
}

// Meditation themes with their associated icons and descriptions
const meditationThemes = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: Brain,
    description: 'Present moment awareness and clarity',
    color: 'from-blue-500 to-indigo-600',
    tags: ['mindfulness', 'awareness', 'clarity']
  },
  {
    id: 'sleep',
    name: 'Sleep Support',
    icon: Moon,
    description: 'Deep relaxation and peaceful sleep',
    color: 'from-purple-500 to-pink-600',
    tags: ['sleep', 'relaxation', 'rest']
  },
  {
    id: 'focus',
    name: 'Focus & Energy',
    icon: Zap,
    description: 'Mental clarity and concentration',
    color: 'from-orange-500 to-red-600',
    tags: ['focus', 'concentration', 'energy']
  },
  {
    id: 'healing',
    name: 'Emotional Healing',
    icon: Heart,
    description: 'Inner peace and emotional balance',
    color: 'from-green-500 to-teal-600',
    tags: ['healing', 'emotional', 'peace']
  },
  {
    id: 'anxiety',
    name: 'Anxiety Relief',
    icon: Shield,
    description: 'Calm and stress reduction',
    color: 'from-teal-500 to-cyan-600',
    tags: ['anxiety', 'calm', 'stress-relief']
  }
];

export const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ className }) => {
  const { allContent, playbackState } = useHealingMate();
  const {
    filteredContent,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    clearFilters,
    hasActiveFilters
  } = useContentFilter();
  const { completedSessions } = useSessionStats();

  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty'>('title');

  // Filter meditation content only
  const meditationContent = useMemo(() => {
    return allContent.filter(content => content.type === 'meditation');
  }, [allContent]);

  // Filter and sort meditation content
  const filteredMeditationContent = useMemo(() => {
    let filtered = meditationContent;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        content.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply theme filter
    if (selectedTheme !== 'all') {
      const theme = meditationThemes.find(t => t.id === selectedTheme);
      if (theme) {
        filtered = filtered.filter(content => 
          theme.tags.some(tag => content.tags.includes(tag))
        );
      }
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(content => content.difficulty === selectedDifficulty);
    }

    // Sort content
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return a.duration - b.duration;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [meditationContent, searchQuery, selectedTheme, selectedDifficulty, sortBy]);

  // Group content by theme
  const contentByTheme = useMemo(() => {
    const grouped: Record<string, typeof filteredMeditationContent> = {};
    
    meditationThemes.forEach(theme => {
      grouped[theme.id] = meditationContent.filter(content =>
        theme.tags.some(tag => content.tags.includes(tag))
      );
    });

    return grouped;
  }, [meditationContent]);

  // Beginner-friendly content
  const beginnerContent = useMemo(() => {
    return meditationContent.filter(content => content.difficulty === 'beginner').slice(0, 6);
  }, [meditationContent]);

  // Series-based content
  const seriesContent = useMemo(() => {
    const series: Record<string, typeof meditationContent> = {};
    
    meditationContent.forEach(content => {
      if (content.series) {
        if (!series[content.series]) {
          series[content.series] = [];
        }
        series[content.series].push(content);
      }
    });

    return series;
  }, [meditationContent]);

  // Progress tracking for series
  const getSeriesProgress = (seriesName: string) => {
    const seriesItems = seriesContent[seriesName] || [];
    const completedCount = seriesItems.filter(item => 
      completedSessions.includes(item.id)
    ).length;
    return seriesItems.length > 0 ? (completedCount / seriesItems.length) * 100 : 0;
  };

  const handleClear = () => {
    clearFilters();
    setSelectedTheme('all');
    setSortBy('title');
  };

  const ThemeCard = ({ theme }: { theme: typeof meditationThemes[0] }) => {
    const Icon = theme.icon;
    const themeContent = contentByTheme[theme.id] || [];
    const completedInTheme = themeContent.filter(content => 
      completedSessions.includes(content.id)
    ).length;

    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          selectedTheme === theme.id && 'ring-2 ring-hc-accent'
        )}
        onClick={() => setSelectedTheme(theme.id)}
      >
        <CardContent className="p-6">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4',
            `bg-gradient-to-br ${theme.color}`
          )}>
            <Icon className="w-6 h-6" />
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{theme.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">{themeContent.length} sessions</span>
              {completedInTheme > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {completedInTheme} completed
                </Badge>
              )}
            </div>
            
            {completedInTheme > 0 && (
              <div className="flex items-center space-x-2">
                <Progress 
                  value={(completedInTheme / themeContent.length) * 100} 
                  className="w-16 h-2"
                />
                <span className="text-xs text-gray-500">
                  {Math.round((completedInTheme / themeContent.length) * 100)}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guided Meditation</h1>
            <p className="text-gray-600">Mindfulness practices for inner peace and clarity</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredMeditationContent.length} meditations
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Award className="w-3 h-3 mr-1" />
            {completedSessions} completed
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search meditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {meditationThemes.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty || 'all'} onValueChange={(value) => setSelectedDifficulty(value === 'all' ? null : value)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
              
              {(hasActiveFilters || selectedTheme !== 'all') && (
                <Button variant="outline" onClick={handleClear} size="sm">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="themes">By Theme</TabsTrigger>
          <TabsTrigger value="beginner">For Beginners</TabsTrigger>
          <TabsTrigger value="series">Series</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
        </TabsList>
        
        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          {/* Theme Selection */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meditationThemes.map(theme => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
          
          {/* Selected Theme Content */}
          {selectedTheme !== 'all' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const theme = meditationThemes.find(t => t.id === selectedTheme);
                    const Icon = theme?.icon || Brain;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-hc-accent" />
                        <span>{theme?.name} Meditations</span>
                        <Badge variant="outline">
                          {contentByTheme[selectedTheme]?.length || 0} sessions
                        </Badge>
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(contentByTheme[selectedTheme] || []).map(content => (
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
        
        {/* Beginner Tab */}
        <TabsContent value="beginner" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Perfect for Beginners
            </h2>
            <p className="text-gray-600">
              Start your meditation journey with these gentle, easy-to-follow sessions
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {beginnerContent.map(content => (
              <ActivityCard
                key={content.id}
                content={content}
                showProgress={true}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Series Tab */}
        <TabsContent value="series" className="space-y-6">
          {Object.entries(seriesContent).map(([seriesName, seriesItems]) => (
            <Card key={seriesName}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-hc-accent" />
                    <span>{seriesName}</span>
                    <Badge variant="outline">{seriesItems.length} sessions</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={getSeriesProgress(seriesName)} 
                      className="w-24 h-2"
                    />
                    <span className="text-sm text-gray-500">
                      {Math.round(getSeriesProgress(seriesName))}%
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {seriesItems.map(content => (
                    <ActivityCard
                      key={content.id}
                      content={content}
                      showProgress={true}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-6">
          {filteredMeditationContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No meditations found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={handleClear} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeditationContent.map(content => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Player */}
      {playbackState.currentContent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <ActivityPlayer variant="compact" />
          </div>
        </div>
      )}

      {/* Progress Statistics */}
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-hc-primary">{meditationContent.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {completedSessions}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {meditationThemes.length}
              </div>
              <div className="text-sm text-gray-600">Themes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {Object.keys(seriesContent).length}
              </div>
              <div className="text-sm text-gray-600">Series</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};