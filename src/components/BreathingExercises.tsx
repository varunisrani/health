import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Clock, Star, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathingExercisesProps {
  className?: string;
}

const breathingVideos = [
  {
    id: 'video-1',
    title: 'Morning Breathing Flow',
    description: 'Start your day with energizing breath work to awaken your body and mind',
    videoId: 'LiUnFJ8P4gM',
    duration: '10 min',
    difficulty: 'Beginner',
    category: 'Energizing',
    tags: ['morning', 'energy', 'focus']
  },
  {
    id: 'video-2',
    title: 'Relaxing Breath Session',
    description: 'Deep breathing techniques for stress relief and relaxation',
    videoId: 'N0tY-TaEEQI',
    duration: '15 min',
    difficulty: 'All Levels',
    category: 'Relaxation',
    tags: ['stress-relief', 'calm', 'anxiety']
  },
  {
    id: 'video-3',
    title: 'Gentle Breath Practice',
    description: 'Gentle breathing exercises perfect for beginners and daily practice',
    videoId: 'DbDoBzGY3vo',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'Foundation',
    tags: ['gentle', 'daily', 'foundation']
  },
  {
    id: 'video-4',
    title: 'Restorative Breathwork',
    description: 'Deep restorative breathing for healing and inner peace',
    videoId: 'ZUFvt3Y1yW0',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'Healing',
    tags: ['healing', 'peace', 'restoration']
  }
];

const VideoCard = ({ video }: { video: typeof breathingVideos[0] }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gray-100">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            className="w-full h-full"
            style={{border: 0}}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hc-tertiary/20 to-hc-secondary/20 cursor-pointer"
            onClick={handlePlay}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-white group-hover:scale-110 transition-all">
                <Play className="w-6 h-6 text-hc-primary ml-1" />
              </div>
              <p className="text-white font-medium drop-shadow-lg">Click to Play</p>
            </div>
            <img 
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-hc-primary transition-colors">
            {video.title}
          </h3>
          <Badge variant="outline" className="text-xs shrink-0 ml-2">
            {video.duration}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {video.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {video.category}
            </Badge>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="group-hover:bg-hc-primary group-hover:text-white transition-all"
            onClick={handlePlay}
          >
            <Play className="w-3 h-3 mr-1" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const BreathingExercises: React.FC<BreathingExercisesProps> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Energizing', 'Relaxation', 'Foundation', 'Healing'];

  const filteredVideos = selectedCategory === 'all' 
    ? breathingVideos 
    : breathingVideos.filter(video => video.category === selectedCategory);

  const featuredVideos = breathingVideos.filter(video => 
    video.difficulty === 'Beginner' || video.tags.includes('popular')
  );

  const beginnerVideos = breathingVideos.filter(video => video.difficulty === 'Beginner');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-lg flex items-center justify-center text-white">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Breathing Exercises</h1>
            <p className="text-gray-600">Breathwork for calm, focus, and healing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {breathingVideos.length} sessions
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Clock className="w-3 h-3 mr-1" />
            {breathingVideos.reduce((total, video) => total + parseInt(video.duration), 0)} min
          </Badge>
        </div>
      </div>

      {/* Quick Categories Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Sessions' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="beginner">For Beginners</TabsTrigger>
        </TabsList>
        
        {/* All Sessions Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
        
        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-hc-accent" />
                <span>Featured Breathing Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Beginner Tab */}
        <TabsContent value="beginner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-hc-tertiary" />
                <span>Perfect for Beginners</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {beginnerVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-hc-tertiary">{breathingVideos.length}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-tertiary">
                {breathingVideos.reduce((total, video) => total + parseInt(video.duration), 0)} min
              </div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-tertiary">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-tertiary">
                {breathingVideos.filter(v => v.difficulty === 'Beginner').length}
              </div>
              <div className="text-sm text-gray-600">Beginner-Friendly</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};