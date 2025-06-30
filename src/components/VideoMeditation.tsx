import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { YouTubePlayer } from '@/components/ui/YouTubePlayer';
import { 
  Search, 
  Play, 
  Moon, 
  Zap, 
  Heart, 
  Shield, 
  Clock, 
  User, 
  BookOpen,
  Award,
  TrendingUp,
  Video
} from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { useHealingMate, useContentFilter, useSessionStats } from '@/hooks/useHealingMate';
import { cn } from '@/lib/utils';

interface VideoMeditationProps {
  className?: string;
}

// Video meditation themes with their associated icons and descriptions
const videoMeditationThemes = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: Video,
    description: 'Visual mindfulness practices with guided instruction',
    color: 'from-hc-primary to-hc-accent',
    tags: ['mindfulness', 'visual', 'guided', 'peace']
  },
  {
    id: 'relaxation',
    name: 'Deep Relaxation',
    icon: Moon,
    description: 'Immersive video journeys for stress relief',
    color: 'from-hc-secondary to-hc-tertiary',
    tags: ['deep-relaxation', 'stress-relief', 'visual', 'journey', 'calm']
  },
  {
    id: 'nature',
    name: 'Nature Connection',
    icon: Heart,
    description: 'Connect with nature through beautiful landscapes',
    color: 'from-hc-tertiary to-hc-accent',
    tags: ['nature', 'landscapes', 'connection', 'outdoor', 'serenity']
  },
  {
    id: 'sleep',
    name: 'Sleep Preparation',
    icon: Moon,
    description: 'Evening wind-down videos for peaceful sleep',
    color: 'from-hc-accent to-hc-secondary',
    tags: ['evening', 'wind-down', 'peaceful', 'sleep-prep', 'gentle']
  }
];

export const VideoMeditation: React.FC<VideoMeditationProps> = ({ className }) => {
  const { allContent, playbackState, playContent } = useHealingMate();
  const {
    filteredContent,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    clearFilters,
    hasActiveFilters
  } = useContentFilter();
  const { completedSessions, saveProgress } = useSessionStats();

  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty'>('title');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Filter video meditation content only
  const videoMeditationContent = useMemo(() => {
    return allContent.filter(content => content.type === 'video-meditation');
  }, [allContent]);

  // Filter and sort video meditation content
  const filteredVideoMeditationContent = useMemo(() => {
    let filtered = videoMeditationContent;

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
      const theme = videoMeditationThemes.find(t => t.id === selectedTheme);
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
  }, [videoMeditationContent, searchQuery, selectedTheme, selectedDifficulty, sortBy]);

  // Group content by theme
  const contentByTheme = useMemo(() => {
    const grouped: Record<string, typeof filteredVideoMeditationContent> = {};
    
    videoMeditationThemes.forEach(theme => {
      grouped[theme.id] = videoMeditationContent.filter(content =>
        theme.tags.some(tag => content.tags.includes(tag))
      );
    });

    return grouped;
  }, [videoMeditationContent]);

  // Beginner-friendly content
  const beginnerContent = useMemo(() => {
    return videoMeditationContent.filter(content => content.difficulty === 'beginner').slice(0, 6);
  }, [videoMeditationContent]);

  // Series-based content
  const seriesContent = useMemo(() => {
    const series: Record<string, typeof videoMeditationContent> = {};
    
    videoMeditationContent.forEach(content => {
      if (content.series) {
        if (!series[content.series]) {
          series[content.series] = [];
        }
        series[content.series].push(content);
      }
    });

    return series;
  }, [videoMeditationContent]);

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

  const handleVideoProgress = (contentId: string, currentTime: number, duration: number) => {
    const progressPercent = (currentTime / duration) * 100;
    saveProgress(contentId, currentTime, progressPercent >= 90);
  };

  const handleVideoEnded = (contentId: string) => {
    saveProgress(contentId, 0, true);
  };

  const VideoCard = ({ content }: { content: typeof videoMeditationContent[0] }) => {
    const isCompleted = completedSessions.includes(content.id);
    
    return (
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        onClick={() => setSelectedVideo(content.id)}
      >
        <div className="relative">
          <img 
            src={content.thumbnailUrl} 
            alt={content.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="w-12 h-12 text-white" />
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black bg-opacity-60 text-white">
              {content.duration}min
            </Badge>
          </div>
          {isCompleted && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-amber-800">
                <Award className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{content.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{content.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{content.difficulty}</Badge>
              <Badge variant="outline">{content.category}</Badge>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <User className="w-3 h-3" />
              <span className="text-xs">{content.instructor}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ThemeCard = ({ theme }: { theme: typeof videoMeditationThemes[0] }) => {
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
              <span className="text-gray-500">{themeContent.length} videos</span>
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

  // Find selected video content
  const selectedVideoContent = selectedVideo ? 
    videoMeditationContent.find(content => content.id === selectedVideo) : null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Video Player Modal */}
      {selectedVideo && selectedVideoContent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedVideoContent.title}</h2>
              <Button variant="ghost" onClick={() => setSelectedVideo(null)}>
                ×
              </Button>
            </div>
            
            <div className="p-4">
              {selectedVideoContent.youtubeId && (
                <YouTubePlayer
                  videoId={selectedVideoContent.youtubeId}
                  title={selectedVideoContent.title}
                  onProgress={(currentTime, duration) => 
                    handleVideoProgress(selectedVideoContent.id, currentTime, duration)
                  }
                  onEnded={() => handleVideoEnded(selectedVideoContent.id)}
                  autoplay={true}
                />
              )}
              
              <div className="mt-4">
                <p className="text-gray-600 mb-2">{selectedVideoContent.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Duration: {selectedVideoContent.duration} minutes</span>
                  <span>Instructor: {selectedVideoContent.instructor}</span>
                  <span>Difficulty: {selectedVideoContent.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Video Meditation</h1>
            <p className="text-gray-600">Visual meditation experiences with guided instruction</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredVideoMeditationContent.length} videos
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
                placeholder="Search video meditations..."
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
                  {videoMeditationThemes.map(theme => (
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {videoMeditationThemes.map(theme => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
          
          {/* Selected Theme Content */}
          {selectedTheme !== 'all' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const theme = videoMeditationThemes.find(t => t.id === selectedTheme);
                    const Icon = theme?.icon || Video;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-hc-accent" />
                        <span>{theme?.name} Videos</span>
                        <Badge variant="outline">
                          {contentByTheme[selectedTheme]?.length || 0} videos
                        </Badge>
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(contentByTheme[selectedTheme] || []).map(content => (
                    <VideoCard
                      key={content.id}
                      content={content}
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
              Start your video meditation journey with these gentle, easy-to-follow sessions
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {beginnerContent.map(content => (
              <VideoCard
                key={content.id}
                content={content}
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
                    <Badge variant="outline">{seriesItems.length} videos</Badge>
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
                    <VideoCard
                      key={content.id}
                      content={content}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-6">
          {filteredVideoMeditationContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No video meditations found</h3>
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
              {filteredVideoMeditationContent.map(content => (
                <VideoCard
                  key={content.id}
                  content={content}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress Statistics */}
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-hc-primary">{videoMeditationContent.length}</div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {completedSessions}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {videoMeditationThemes.length}
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