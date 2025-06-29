import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Music, Filter, Clock, Star, Headphones } from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityPlayer } from '@/components/ActivityPlayer';
import { useHealingMate, useContentFilter } from '@/hooks/useHealingMate';
import { cn } from '@/lib/utils';

interface MusicTherapyProps {
  className?: string;
}

export const MusicTherapy: React.FC<MusicTherapyProps> = ({ className }) => {
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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty'>('title');

  // Filter music content only
  const musicContent = useMemo(() => {
    return allContent.filter(content => content.type === 'music');
  }, [allContent]);

  // Get unique categories for music content
  const musicCategories = useMemo(() => {
    const categories = Array.from(new Set(musicContent.map(content => content.category)));
    return ['all', ...categories];
  }, [musicContent]);

  // Filter and sort music content
  const filteredMusicContent = useMemo(() => {
    let filtered = musicContent;

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

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.category === selectedCategory);
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
  }, [musicContent, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Group content by series
  const contentBySeries = useMemo(() => {
    const grouped: Record<string, typeof filteredMusicContent> = {};
    
    filteredMusicContent.forEach(content => {
      const series = content.series || 'Standalone';
      if (!grouped[series]) {
        grouped[series] = [];
      }
      grouped[series].push(content);
    });

    return grouped;
  }, [filteredMusicContent]);

  // Popular/Featured content
  const featuredContent = useMemo(() => {
    return musicContent.filter(content => 
      content.tags.includes('popular') || content.difficulty === 'beginner'
    ).slice(0, 3);
  }, [musicContent]);

  // Recently added content
  const recentContent = useMemo(() => {
    return musicContent.slice(-4);
  }, [musicContent]);

  const handleClear = () => {
    clearFilters();
    setSelectedCategory('all');
    setSortBy('title');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Therapy</h1>
            <p className="text-gray-600">Curated audio sessions for healing and relaxation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredMusicContent.length} tracks
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Headphones className="w-3 h-3 mr-1" />
            {musicContent.reduce((total, content) => total + content.duration, 0)} min
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
                placeholder="Search music tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {musicCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
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
              
              {(hasActiveFilters || selectedCategory !== 'all') && (
                <Button variant="outline" onClick={handleClear} size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="series">By Series</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>
        
        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-6">
          {filteredMusicContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No music tracks found</h3>
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
              {filteredMusicContent.map((content) => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6">
            {featuredContent.map((content) => (
              <ActivityCard
                key={content.id}
                content={content}
                variant="featured"
                showProgress={true}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Series Tab */}
        <TabsContent value="series" className="space-y-6">
          {Object.entries(contentBySeries).map(([seriesName, seriesContent]) => (
            <Card key={seriesName}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-hc-accent" />
                  <span>{seriesName}</span>
                  <Badge variant="outline">{seriesContent.length} tracks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {seriesContent.map((content) => (
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
        
        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentContent.map((content) => (
              <ActivityCard
                key={content.id}
                content={content}
                showProgress={true}
              />
            ))}
          </div>
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

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-hc-primary">{musicContent.length}</div>
              <div className="text-sm text-gray-600">Total Tracks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {Math.round(musicContent.reduce((total, content) => total + content.duration, 0) / 60)}h
              </div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {Array.from(new Set(musicContent.map(c => c.category))).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">
                {Array.from(new Set(musicContent.map(c => c.instructor))).length}
              </div>
              <div className="text-sm text-gray-600">Artists</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};