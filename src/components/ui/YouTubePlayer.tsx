import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
  autoplay?: boolean;
  startTime?: number;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  onProgress,
  onEnded,
  className = '',
  autoplay = false,
  startTime = 0
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true);
      return;
    }

    // Load YouTube API script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isAPIReady || !playerRef.current) return;

    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId,
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: 0, // Hide default controls since we're using custom ones
        disablekb: 1,
        fs: 0, // Disable fullscreen button
        iv_load_policy: 3, // Hide annotations
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        start: startTime
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true);
          setDuration(event.target.getDuration());
          event.target.setVolume(volume);
        },
        onStateChange: (event: any) => {
          const state = event.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          
          if (state === window.YT.PlayerState.ENDED) {
            onEnded?.();
          }
        }
      }
    });

    // Update progress periodically
    const interval = setInterval(() => {
      if (playerInstanceRef.current && isReady) {
        const current = playerInstanceRef.current.getCurrentTime();
        const total = playerInstanceRef.current.getDuration();
        setCurrentTime(current);
        setDuration(total);
        onProgress?.(current, total);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [isAPIReady, videoId]);

  const togglePlay = () => {
    if (!playerInstanceRef.current) return;
    
    if (isPlaying) {
      playerInstanceRef.current.pauseVideo();
    } else {
      playerInstanceRef.current.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerInstanceRef.current) return;
    const newTime = (value[0] / 100) * duration;
    playerInstanceRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerInstanceRef.current) return;
    const newVolume = value[0];
    setVolume(newVolume);
    playerInstanceRef.current.setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!playerInstanceRef.current) return;
    
    if (isMuted) {
      playerInstanceRef.current.unMute();
      playerInstanceRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerInstanceRef.current.mute();
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.closest('.video-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`video-container relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* YouTube Player */}
      <div className="relative aspect-video">
        <div ref={playerRef} className="w-full h-full" />
        
        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Loading video...</div>
          </div>
        )}
      </div>

      {/* Custom Controls */}
      {isReady && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:text-hc-primary"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:text-hc-primary"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-hc-primary"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};