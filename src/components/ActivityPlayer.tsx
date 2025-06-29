import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Heart,
  Download,
  Settings,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHealingMate, useAudioPlayer, useFavorites } from '@/hooks/useHealingMate';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ActivityPlayerProps {
  className?: string;
  variant?: 'full' | 'mini' | 'compact';
}

export const ActivityPlayer: React.FC<ActivityPlayerProps> = ({ 
  className, 
  variant = 'full' 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { 
    playbackState, 
    setPlaybackState, 
    pauseContent, 
    resumeContent, 
    stopContent, 
    seekTo, 
    setVolume, 
    setPlaybackRate 
  } = useHealingMate();
  
  const { 
    updateProgress, 
    handleLoadStart, 
    handleCanPlay, 
    handleEnded, 
    handleError 
  } = useAudioPlayer();
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Update audio element when playback state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playbackState.currentContent) return;

    audio.src = playbackState.currentContent.fileUrl;
    audio.volume = playbackState.volume;
    audio.playbackRate = playbackState.playbackRate;
    audio.currentTime = playbackState.currentTime;

    if (playbackState.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [playbackState.currentContent, playbackState.isPlaying]);

  // Update volume when volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : playbackState.volume;
  }, [playbackState.volume, isMuted]);

  // Update playback rate when rate changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = playbackState.playbackRate;
  }, [playbackState.playbackRate]);

  const handlePlayPause = () => {
    if (playbackState.isPlaying) {
      pauseContent();
    } else {
      resumeContent();
    }
  };

  const handleStop = () => {
    stopContent();
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    seekTo(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, playbackState.currentTime - 15);
    seekTo(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(playbackState.duration, playbackState.currentTime + 15);
    seekTo(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const handleFavoriteToggle = () => {
    if (playbackState.currentContent) {
      toggleFavorite(playbackState.currentContent.id);
    }
  };

  const handleDownload = () => {
    // Mock download functionality
    if (playbackState.currentContent) {
      console.log('Downloading:', playbackState.currentContent.title);
      // In a real app, this would trigger a download
    }
  };

  // Don't render if no content is loaded
  if (!playbackState.currentContent) {
    return null;
  }

  const content = playbackState.currentContent;
  const progressPercent = playbackState.duration > 0 
    ? (playbackState.currentTime / playbackState.duration) * 100 
    : 0;

  // Mini player variant
  if (variant === 'mini' || isMinimized) {
    return (
      <Card className={cn(
        'fixed bottom-4 right-4 w-80 shadow-lg border-hc-accent/20 bg-white/95 backdrop-blur-sm z-50',
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="w-10 h-10 rounded-full bg-hc-primary hover:bg-hc-primary/90 flex-shrink-0"
            >
              {playbackState.isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : playbackState.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {content.title}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatTime(playbackState.currentTime)}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-hc-accent transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span>{formatTime(playbackState.duration)}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="w-8 h-8 p-0 flex-shrink-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
        
        <audio
          ref={audioRef}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onTimeUpdate={(e) => {
            const audio = e.target as HTMLAudioElement;
            updateProgress(audio.currentTime, audio.duration);
          }}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
        />
      </Card>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Content info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white text-lg">
                  🎧
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{content.title}</h3>
                  <p className="text-xs text-gray-600">{content.instructor}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <Slider
                value={[playbackState.currentTime]}
                max={playbackState.duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(playbackState.currentTime)}</span>
                <span>{formatTime(playbackState.duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipBack}
                className="w-10 h-10 rounded-full"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-hc-primary hover:bg-hc-primary/90"
              >
                {playbackState.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : playbackState.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipForward}
                className="w-10 h-10 rounded-full"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        
        <audio
          ref={audioRef}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onTimeUpdate={(e) => {
            const audio = e.target as HTMLAudioElement;
            updateProgress(audio.currentTime, audio.duration);
          }}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
        />
      </Card>
    );
  }

  // Full player variant
  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Content info */}
          <div className="text-center space-y-2">
            <div className="w-24 h-24 bg-gradient-to-br from-hc-primary to-hc-accent rounded-full mx-auto flex items-center justify-center text-white text-3xl shadow-lg">
              {content.type === 'music' ? '🎵' : 
               content.type === 'meditation' ? '🧘' :
               content.type === 'breathing' ? '💨' : '🔔'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-gray-600">{content.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              {content.instructor && (
                <span>by {content.instructor}</span>
              )}
              {content.series && (
                <>
                  <span>•</span>
                  <span>{content.series}</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline">{content.difficulty}</Badge>
              <Badge variant="outline">{content.duration} min</Badge>
              <Badge variant="outline">{content.category}</Badge>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <Slider
              value={[playbackState.currentTime]}
              max={playbackState.duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(playbackState.currentTime)}</span>
              <span>{formatTime(playbackState.duration)}</span>
            </div>
          </div>
          
          {/* Main controls */}
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSkipBack}
              className="w-12 h-12 rounded-full"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="w-16 h-16 rounded-full bg-hc-primary hover:bg-hc-primary/90 shadow-lg"
            >
              {playbackState.isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : playbackState.isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSkipForward}
              className="w-12 h-12 rounded-full"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Secondary controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMuteToggle}
                className="w-10 h-10 rounded-full"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <Popover open={showVolumeSlider} onOpenChange={setShowVolumeSlider}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <span className="text-xs">{Math.round(playbackState.volume * 100)}%</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Volume</label>
                    <Slider
                      value={[playbackState.volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className="w-10 h-10 rounded-full"
              >
                <Heart 
                  className={cn(
                    'w-4 h-4',
                    isFavorite(content.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  )} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="w-10 h-10 rounded-full"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
                    <Settings className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Playback Speed</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <Button
                            key={rate}
                            variant={playbackState.playbackRate === rate ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePlaybackRateChange(rate)}
                            className="text-xs"
                          >
                            {rate}x
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="w-10 h-10 rounded-full"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleStop}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Session
            </Button>
          </div>
        </div>
      </CardContent>
      
      <audio
        ref={audioRef}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement;
          updateProgress(audio.currentTime, audio.duration);
        }}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />
    </Card>
  );
};