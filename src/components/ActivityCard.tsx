import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Play, Pause, Clock, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealingMateContent } from '@/context/HealingMateContext';
import { useHealingMate } from '@/hooks/useHealingMate';
import { useFavorites } from '@/hooks/useHealingMate';

interface ActivityCardProps {
  content: HealingMateContent;
  variant?: 'default' | 'compact' | 'featured';
  showProgress?: boolean;
  className?: string;
  onPlay?: (content: HealingMateContent) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  content,
  variant = 'default',
  showProgress = false,
  className,
  onPlay
}) => {
  const { playbackState, playContent, pauseContent, getProgress } = useHealingMate();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isCurrentlyPlaying = playbackState.currentContent?.id === content.id && playbackState.isPlaying;
  const isCurrentContent = playbackState.currentContent?.id === content.id;
  const progress = getProgress(content.id);
  const progressPercent = progress > 0 ? (progress / (content.duration * 60)) * 100 : 0;

  const handlePlayClick = () => {
    if (isCurrentlyPlaying) {
      pauseContent();
    } else if (isCurrentContent && !playbackState.isPlaying) {
      playContent(content);
    } else {
      playContent(content);
    }
    
    onPlay?.(content);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(content.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-hc-success/20 text-hc-success border border-hc-success/30';
      case 'intermediate':
        return 'bg-hc-accent/20 text-hc-primary border border-hc-accent/30';
      case 'advanced':
        return 'bg-hc-warning/20 text-hc-warning border border-hc-warning/30';
      default:
        return 'bg-hc-soft text-hc-primary border border-hc-soft';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'music':
        return '🎵';
      case 'meditation':
        return '🧘';
      case 'breathing':
        return '💨';
      case 'sound-therapy':
        return '🔔';
      default:
        return '🎧';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className={cn(
        'group hover:shadow-md transition-all duration-300 cursor-pointer',
        isCurrentContent && 'ring-2 ring-hc-accent',
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handlePlayClick}
              size="sm"
              className={cn(
                'w-10 h-10 rounded-full flex-shrink-0',
                isCurrentlyPlaying 
                  ? 'bg-hc-accent hover:bg-hc-accent/90' 
                  : 'bg-hc-primary hover:bg-hc-primary/90'
              )}
            >
              {playbackState.isLoading && isCurrentContent ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isCurrentlyPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {content.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>{getTypeIcon(content.type)}</span>
                <span>{content.duration}m</span>
                {content.instructor && (
                  <>
                    <span>•</span>
                    <span className="truncate">{content.instructor}</span>
                  </>
                )}
              </div>
              {showProgress && progressPercent > 0 && (
                <Progress value={progressPercent} className="h-1 mt-2" />
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="flex-shrink-0 w-8 h-8 p-0"
            >
              <Heart 
                className={cn(
                  'w-4 h-4',
                  isFavorite(content.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                )} 
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={cn(
        'group hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden',
        'bg-gradient-to-br from-hc-surface to-white',
        isCurrentContent && 'ring-2 ring-hc-accent shadow-lg',
        className
      )}>
        <CardContent className="relative p-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-hc-tertiary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(content.type)}</span>
                <Badge variant="outline" className={getDifficultyColor(content.difficulty)}>
                  {content.difficulty}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="w-10 h-10 rounded-full"
              >
                <Heart 
                  className={cn(
                    'w-5 h-5',
                    isFavorite(content.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  )} 
                />
              </Button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {content.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {content.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{content.duration} min</span>
              </div>
              {content.instructor && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="truncate">{content.instructor}</span>
                </div>
              )}
              {content.series && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span className="truncate">{content.series}</span>
                </div>
              )}
            </div>
            
            {showProgress && progressPercent > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {content.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {content.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{content.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={handlePlayClick}
                className={cn(
                  'group-hover:scale-105 transition-transform duration-200',
                  isCurrentlyPlaying 
                    ? 'bg-hc-accent hover:bg-hc-accent/90' 
                    : 'bg-hc-primary hover:bg-hc-primary/90'
                )}
              >
                {playbackState.isLoading && isCurrentContent ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : isCurrentlyPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2 ml-1" />
                )}
                {isCurrentlyPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(
      'group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
      isCurrentContent && 'ring-2 ring-hc-accent',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getTypeIcon(content.type)}</span>
            <Badge variant="outline" className={getDifficultyColor(content.difficulty)}>
              {content.difficulty}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="w-9 h-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={cn(
                'w-4 h-4',
                isFavorite(content.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
              )} 
            />
          </Button>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {content.description}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{content.duration} min</span>
          </div>
          {content.instructor && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="truncate">{content.instructor}</span>
            </div>
          )}
        </div>
        
        {showProgress && progressPercent > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {content.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{content.tags.length - 2}
              </Badge>
            )}
          </div>
          
          <Button
            onClick={handlePlayClick}
            size="sm"
            className={cn(
              isCurrentlyPlaying 
                ? 'bg-hc-accent hover:bg-hc-accent/90' 
                : 'bg-hc-primary hover:bg-hc-primary/90'
            )}
          >
            {playbackState.isLoading && isCurrentContent ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : isCurrentlyPlaying ? (
              <Pause className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1 ml-0.5" />
            )}
            {isCurrentlyPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};