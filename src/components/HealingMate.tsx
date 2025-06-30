import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Music, 
  Brain, 
  Wind, 
  Bell, 
  Search, 
  Sparkles, 
  TrendingUp,
  Star,
  Play,
  Clock,
  User,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityPlayer } from '@/components/ActivityPlayer';
import { MusicTherapy } from '@/components/MusicTherapy';
import { GuidedMeditation } from '@/components/GuidedMeditation';
import { PersonalizedRecommendations } from '@/components/PersonalizedRecommendations';
import { BreathingExercises } from '@/components/BreathingExercises';
import { useHealingMate, useContentFilter, useRecommendations } from '@/hooks/useHealingMate';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HealingMateProps {
  className?: string;
}

// Activity categories with their metadata
const activityCategories = [
  {
    id: 'music',
    name: 'Music Therapy',
    description: 'Curated audio sessions for healing',
    icon: Music,
    color: 'from-blue-500 to-indigo-600',
    count: 0
  },
  {
    id: 'meditation',
    name: 'Guided Meditation',
    description: 'Mindfulness and awareness practices',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    count: 0
  },
  {
    id: 'breathing',
    name: 'Breathing Exercises',
    description: 'Breathwork for calm and focus',
    icon: Wind,
    color: 'from-hc-tertiary to-hc-secondary',
    count: 0
  },
  {
    id: 'sound-therapy',
    name: 'Sound Therapy',
    description: 'Healing frequencies and tones',
    icon: Bell,
    color: 'from-orange-500 to-red-600',
    count: 0
  }
];

export const HealingMate: React.FC<HealingMateProps> = ({ className }) => {
  const navigate = useNavigate();
  const { allContent, playbackState } = useHealingMate();
  const { filteredContent, searchQuery, setSearchQuery } = useContentFilter();
  const { continueListening, dailyRecommendations } = useRecommendations();
  const isMobile = useIsMobile();
  
  const [activeView, setActiveView] = useState<'overview' | 'music' | 'meditation' | 'breathing' | 'recommendations'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update category counts
  const categoriesWithCounts = activityCategories.map(category => ({
    ...category,
    count: allContent.filter(content => content.type === category.id).length
  }));

  const CategoryCard = ({ category }: { category: typeof activityCategories[0] }) => {
    const Icon = category.icon;
    
    const handleCategoryClick = () => {
      if (category.id === 'music') {
        setActiveView('music');
      } else if (category.id === 'meditation') {
        setActiveView('meditation');
      } else if (category.id === 'breathing') {
        setActiveView('breathing');
      } else if (category.id === 'sound-therapy') {
        // For now, redirect to music therapy view - can be expanded later  
        setActiveView('music');
      }
    };
    
    return (
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
        onClick={handleCategoryClick}
      >
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={cn(
            'rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4 transition-transform group-hover:scale-110',
            isMobile ? 'w-10 h-10' : 'w-12 h-12',
            `bg-gradient-to-br ${category.color}`
          )}>
            <Icon className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
          </div>
          
          <h3 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>{category.name}</h3>
          <p className={`text-gray-600 mb-3 sm:mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>{category.description}</p>
          
          <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
            <Badge variant="outline" className={isMobile ? "text-xs px-2 py-1" : "text-sm"}>
              {category.count} sessions
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              className={`group-hover:bg-hc-primary group-hover:text-white ${
                isMobile ? 'h-8 px-3 text-xs w-full' : ''
              }`}
            >
              <Play className={`mr-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Explore
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuickStatsCard = () => {
    const totalSessions = allContent.length;
    const totalDuration = allContent.reduce((total, content) => total + content.duration, 0);
    const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    return (
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={`grid grid-cols-3 text-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div>
              <div className={`font-bold text-hc-primary ${isMobile ? 'text-lg' : 'text-2xl'}`}>{totalSessions}</div>
              <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Sessions</div>
            </div>
            <div>
              <div className={`font-bold text-hc-accent ${isMobile ? 'text-lg' : 'text-2xl'}`}>{Math.round(totalDuration / 60)}h</div>
              <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Content Hours</div>
            </div>
            <div>
              <div className={`font-bold text-hc-tertiary ${isMobile ? 'text-lg' : 'text-2xl'}`}>{averageDuration}m</div>
              <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Avg Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FeaturedContent = () => {
    const featured = allContent.filter(content => 
      content.tags.includes('popular') || content.difficulty === 'beginner'
    ).slice(0, 3);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-hc-accent" />
            <span>Featured Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map(content => (
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
    );
  };

  const RecentlyAdded = () => {
    const recent = allContent.slice(-4);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-hc-accent" />
            <span>Recently Added</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recent.map(content => (
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
    );
  };

  // Render different views based on activeView
  if (activeView === 'music') {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="mb-4"
          >
            ← Back to Overview
          </Button>
        </div>
        <MusicTherapy />
      </div>
    );
  }

  if (activeView === 'meditation') {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="mb-4"
          >
            ← Back to Overview
          </Button>
        </div>
        <GuidedMeditation />
      </div>
    );
  }

  if (activeView === 'breathing') {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="mb-4"
          >
            ← Back to Overview
          </Button>
        </div>
        <BreathingExercises />
      </div>
    );
  }

  if (activeView === 'recommendations') {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="mb-4"
          >
            ← Back to Overview
          </Button>
        </div>
        <PersonalizedRecommendations />
      </div>
    );
  }

  // Overview/Dashboard view
  return (
    <div className={cn(isMobile ? 'space-y-4' : 'space-y-6', className)}>
      {/* Header */}
      <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'justify-between'}`}>
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white ${
            isMobile ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <Heart className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>Healing Mate</h1>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-base'}`}>Your personalized consultant companion</p>
          </div>
        </div>
        
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-2 w-full' : 'space-x-2'}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('recommendations')}
            className={isMobile ? "w-full h-10" : ""}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isMobile ? "Recommendations" : "Get Recommendations"}
          </Button>
          
          {!isMobile && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStatsCard />

      {/* Continue Listening */}
      {continueListening.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-hc-accent" />
              <span>Continue Listening</span>
              <Badge variant="secondary">{continueListening.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
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

      {/* Search Bar */}
      <Card>
        <CardContent className={isMobile ? "p-3" : "p-4"}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={isMobile ? "Search healing content..." : "Search all healing content..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isMobile ? 'h-11 text-base' : ''}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="categories" className={isMobile ? "space-y-4" : "space-y-6"}>
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="categories" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Categories" : "Categories"}
          </TabsTrigger>
          <TabsTrigger value="featured" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Featured" : "Featured"}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="browse">Browse All</TabsTrigger>
            </>
          )}
          {isMobile && (
            <TabsTrigger value="recent" className="text-xs px-2">More</TabsTrigger>
          )}
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className={isMobile ? "space-y-4" : "space-y-6"}>
          <div className={`grid gap-4 sm:gap-6 ${
            isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {categoriesWithCounts.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          
          {/* Daily Recommendations */}
          {dailyRecommendations.all.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-hc-accent" />
                  <span>Today's Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dailyRecommendations.all.slice(0, 6).map(content => (
                    <ActivityCard
                      key={content.id}
                      content={content}
                      variant="compact"
                      showProgress={true}
                    />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveView('recommendations')}
                  >
                    View All Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Featured Tab */}
        <TabsContent value="featured">
          <FeaturedContent />
        </TabsContent>
        
        {/* Recent Tab */}
        <TabsContent value="recent">
          <RecentlyAdded />
        </TabsContent>
        
        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-6">
          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms to find what you're looking for.
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={cn(
              'grid gap-4',
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            )}>
              {filteredContent.map(content => (
                <ActivityCard
                  key={content.id}
                  content={content}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Fixed Player */}
      {playbackState.currentContent && (
        <ActivityPlayer variant="mini" />
      )}
    </div>
  );
};