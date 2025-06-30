
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { YouTubePlayer } from '@/components/ui/YouTubePlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Play, Pause, Video } from 'lucide-react';

const yogaQuotes = [
  {
    text: "Yoga is not about touching your toes. It is about what you learn on the way down.",
    author: "Judith Hanson Lasater"
  },
  {
    text: "The success of yoga does not lie in the ability to attain the perfect posture but in how it contributes to happiness in daily life.",
    author: "T.K.V. Desikachar"
  },
  {
    text: "Yoga is a way of moving into stillness in order to experience the truth of who you are.",
    author: "Erich Schiffmann"
  },
  {
    text: "The nature of yoga is to shine the light of awareness into the darkest corners of the body.",
    author: "Jason Crandell"
  }
];

const musicTracks = [
  {
    id: 1,
    title: "Morning Meditation",
    duration: "10:32",
    description: "Gentle sounds to start your day"
  },
  {
    id: 2,
    title: "Deep Relaxation",
    duration: "15:45",
    description: "Calming nature sounds for rest"
  },
  {
    id: 3,
    title: "Focus & Clarity",
    duration: "12:18",
    description: "Ambient tones for concentration"
  }
];

const videoMeditations = [
  {
    id: 'v1',
    title: "Mindful Breathing",
    duration: "8:30",
    description: "Visual guided breathing meditation",
    youtubeId: "1ZYbU82GVz4", // Sample meditation video
    thumbnailUrl: "https://img.youtube.com/vi/1ZYbU82GVz4/maxresdefault.jpg",
    difficulty: "beginner"
  },
  {
    id: 'v2',
    title: "Body Scan Relaxation",
    duration: "15:00",
    description: "Progressive relaxation with visual guidance",
    youtubeId: "15q-N-_kkrU", // Sample meditation video
    thumbnailUrl: "https://img.youtube.com/vi/15q-N-_kkrU/maxresdefault.jpg",
    difficulty: "intermediate"
  },
  {
    id: 'v3',
    title: "Stress Relief Meditation",
    duration: "12:45",
    description: "Calming visualization for stress relief",
    youtubeId: "ZToicYcHIOU", // Sample meditation video
    thumbnailUrl: "https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg",
    difficulty: "beginner"
  }
];

export const LibraryTab = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  const isMobile = useIsMobile();

  // Auto-rotate quotes every 6 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % yogaQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = (trackId: number) => {
    if (playingTrack === trackId) {
      // Pause current track
      audioRefs.current[trackId]?.pause();
      setPlayingTrack(null);
    } else {
      // Pause all other tracks
      Object.values(audioRefs.current).forEach(audio => audio?.pause());
      
      // Play selected track (mock - no actual audio file)
      setPlayingTrack(trackId);
      
      // Simulate audio playback end
      setTimeout(() => {
        setPlayingTrack(null);
      }, 3000); // Mock 3 second playback
    }
  };

  return (
    <div className={isMobile ? "space-y-6" : "space-y-8"}>
      {/* Yoga Quotes Slider */}
      <div>
        <h2 className={`font-semibold mb-4 text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Daily Inspiration
        </h2>
        <Card className="bg-gradient-to-r from-hc-tertiary/20 to-hc-surface overflow-hidden">
          <CardContent className={`text-center ${isMobile ? 'p-6' : 'p-8'}`}>
            <div className="transition-all duration-500 ease-in-out">
              <blockquote className={`font-inter font-medium text-gray-800 mb-4 ${
                isMobile ? 'text-base leading-relaxed' : 'text-lg'
              }`}>
                "{yogaQuotes[currentQuote].text}"
              </blockquote>
              <cite className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                — {yogaQuotes[currentQuote].author}
              </cite>
            </div>
            
            {/* Quote indicators */}
            <div className={`flex justify-center space-x-2 ${isMobile ? 'mt-4' : 'mt-6'}`}>
              {yogaQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`rounded-full transition-colors ${
                    isMobile ? 'w-2 h-2' : 'w-2 h-2'
                  } ${
                    index === currentQuote ? 'bg-hc-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Soothing Music */}
      <div>
        <h2 className={`font-semibold mb-4 text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Soothing Music
        </h2>
        <div className={`grid gap-3 sm:gap-4`}>
          {musicTracks.map((track) => (
            <Card 
              key={track.id} 
              className={`hover-lift transition-all duration-300 ${
                playingTrack === track.id ? 'shadow-lg scale-[1.02]' : ''
              }`}
            >
              <CardContent className={isMobile ? "p-4" : "p-6"}>
                <div className={`flex items-center ${
                  isMobile ? 'flex-col space-y-3' : 'justify-between'
                }`}>
                  <div className={`flex items-center ${
                    isMobile ? 'w-full justify-between' : 'space-x-4'
                  }`}>
                    <div className={`flex items-center ${
                      isMobile ? 'space-x-3' : 'space-x-4'
                    }`}>
                      <Button
                        onClick={() => togglePlay(track.id)}
                        className={`rounded-full text-white ${
                          isMobile ? 'w-10 h-10' : 'w-12 h-12'
                        } ${
                          playingTrack === track.id 
                            ? 'bg-hc-accent hover:bg-hc-accent/90' 
                            : 'bg-hc-primary hover:bg-hc-primary/90'
                        }`}
                      >
                        <span className={isMobile ? "text-xs" : "text-sm"}>
                          {playingTrack === track.id ? '⏸️' : '▶️'}
                        </span>
                      </Button>
                      <div className={isMobile ? "min-w-0 flex-1" : ""}>
                        <h3 className={`font-semibold text-gray-900 ${
                          isMobile ? 'text-sm truncate' : 'text-base'
                        }`}>
                          {track.title}
                        </h3>
                        <p className={`text-gray-600 ${
                          isMobile ? 'text-xs truncate' : 'text-sm'
                        }`}>
                          {track.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${
                      isMobile ? 'flex-shrink-0' : 'text-right'
                    }`}>
                      <Badge variant="outline" className={isMobile ? "text-xs px-2 py-1" : "mb-2"}>
                        {track.duration}
                      </Badge>
                      {playingTrack === track.id && (
                        <div className={`flex items-center space-x-1 text-gray-600 ${
                          isMobile ? 'text-xs' : 'text-sm'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-hc-accent rounded-full animate-pulse"></div>
                          {!isMobile && <span>Playing...</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Mock audio waveform */}
                <div className={`flex items-center space-x-1 ${
                  isMobile ? 'mt-3 h-6' : 'mt-4 h-8'
                }`}>
                  {Array.from({ length: isMobile ? 30 : 50 }, (_, i) => (
                    <div
                      key={i}
                      className={`bg-hc-primary/30 rounded-full transition-all duration-300 ${
                        isMobile ? 'w-0.5' : 'w-1'
                      } ${
                        playingTrack === track.id 
                          ? `h-${Math.floor(Math.random() * (isMobile ? 4 : 6)) + 2} animate-pulse` 
                          : isMobile ? 'h-1.5' : 'h-2'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Meditations */}
      <div>
        <h2 className={`font-semibold mb-4 text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Video Meditations
        </h2>
        <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {videoMeditations.map((video) => (
            <Card 
              key={video.id} 
              className="hover-lift transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    isMobile ? 'h-40' : 'h-48'
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-black-opacity-30 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size={isMobile ? "default" : "lg"}
                    className="bg-amber-800 hover:bg-amber-900 text-white rounded-full shadow-lg"
                  >
                    <Video className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} mr-1`} />
                    Play
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black bg-opacity-60 text-white text-xs">
                    {video.duration}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-white/90 text-gray-800 text-xs border-0">
                    {video.difficulty}
                  </Badge>
                </div>
              </div>
              
              <CardContent className={isMobile ? "p-4" : "p-5"}>
                <h3 className={`font-semibold text-gray-900 mb-2 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  {video.title}
                </h3>
                <p className={`text-gray-600 mb-3 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-hc-tertiary/20 text-hc-primary border-hc-tertiary/30">
                    Meditation
                  </Badge>
                  <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {video.duration}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {videoMeditations.find(v => v.id === selectedVideo)?.title}
              </h2>
              <Button variant="ghost" onClick={() => setSelectedVideo(null)} className="text-2xl px-3">
                ×
              </Button>
            </div>
            
            <div className="p-4">
              {(() => {
                const video = videoMeditations.find(v => v.id === selectedVideo);
                return video?.youtubeId ? (
                  <YouTubePlayer
                    videoId={video.youtubeId}
                    title={video.title}
                    autoplay={true}
                  />
                ) : null;
              })()}
              
              <div className="mt-4">
                {(() => {
                  const video = videoMeditations.find(v => v.id === selectedVideo);
                  return video ? (
                    <>
                      <p className="text-gray-600 mb-2">{video.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Duration: {video.duration}</span>
                        <span>Difficulty: {video.difficulty}</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                          YouTube
                        </Badge>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
