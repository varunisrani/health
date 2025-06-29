import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MonitorOff,
  Settings,
  MessageSquare,
  Users,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Camera,
  CameraOff
} from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useSessionsContext } from '@/context/SessionsContext';
import { LiveSession } from '@/context/SessionsContext';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  session: LiveSession;
  onEndCall: () => void;
  className?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  session,
  onEndCall,
  className
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [callDuration, setCallDuration] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const { 
    webrtcConnection,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall
  } = useSessionsContext();

  const [webrtcState, webrtcControls] = useWebRTC(
    (remoteStream) => {
      console.log('Remote stream received');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    },
    (message) => {
      console.log('Message received:', message);
    },
    (state) => {
      console.log('Connection state changed:', state);
      // Update connection quality based on state
      if (state === 'connected') {
        setConnectionQuality('excellent');
      } else if (state === 'connecting') {
        setConnectionQuality('good');
      } else if (state === 'failed' || state === 'disconnected') {
        setConnectionQuality('poor');
      }
    }
  );

  // Set up local video stream
  useEffect(() => {
    if (webrtcConnection.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = webrtcConnection.localStream;
    }
  }, [webrtcConnection.localStream]);

  // Set up remote video stream
  useEffect(() => {
    if (webrtcConnection.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = webrtcConnection.remoteStream;
    }
  }, [webrtcConnection.remoteStream]);

  // Initialize WebRTC when component mounts
  useEffect(() => {
    webrtcControls.initializeConnection(session.id);
    
    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [session.id]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => {
        if (isFullscreen) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseMove = () => resetTimeout();
    
    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      resetTimeout();
    }

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-hc-success';
      case 'good': return 'text-hc-warning';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi className="w-4 h-4" />;
      case 'good': return <Wifi className="w-4 h-4" />;
      case 'poor': return <WifiOff className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleEndCall = () => {
    webrtcControls.endCall();
    onEndCall();
  };

  return (
    <div className={cn(
      "relative bg-black rounded-lg overflow-hidden",
      isFullscreen ? "fixed inset-0 z-50" : "aspect-video",
      className
    )}>
      {/* Remote Video (Main) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted={false}
        className="w-full h-full object-cover"
      />

      {/* Remote Video Placeholder */}
      {!webrtcConnection.remoteStream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-hc-primary text-white text-2xl">
                {session.therapistName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-2">{session.therapistName}</h3>
            <p className="text-gray-400">
              {webrtcState.isConnecting ? 'Connecting...' : 'Waiting for connection...'}
            </p>
            {webrtcState.isConnecting && (
              <Progress value={50} className="w-32 mx-auto mt-4" />
            )}
          </div>
        </div>
      )}

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {webrtcConnection.isMuted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <MicOff className="w-6 h-6 text-red-500" />
          </div>
        )}
        {!webrtcConnection.isVideoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Avatar>
              <AvatarFallback className="bg-hc-primary text-white">
                You
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Session Info Overlay */}
      <div className={cn(
        "absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white transition-opacity",
        !showControls && isFullscreen ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {session.type === 'one-on-one' ? '1-on-1' : 'Webinar'}
          </Badge>
          <div className="flex items-center space-x-1 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        </div>
        <h3 className="font-semibold mt-1">{session.title}</h3>
      </div>

      {/* Connection Quality Indicator */}
      <div className={cn(
        "absolute top-4 right-40 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white transition-opacity",
        !showControls && isFullscreen ? "opacity-0" : "opacity-100"
      )}>
        <div className={cn("flex items-center space-x-2", getConnectionQualityColor())}>
          {getConnectionIcon()}
          <span className="text-sm capitalize">{connectionQuality}</span>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity",
        !showControls && isFullscreen ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleMute}
            className={cn(
              "rounded-full w-12 h-12 text-white",
              webrtcConnection.isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
            )}
          >
            {webrtcConnection.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Video Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleVideo}
            className={cn(
              "rounded-full w-12 h-12 text-white",
              !webrtcConnection.isVideoEnabled ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
            )}
          >
            {webrtcConnection.isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          {/* Screen Share Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleScreenShare}
            className={cn(
              "rounded-full w-12 h-12 text-white",
              webrtcConnection.isScreenSharing ? "bg-hc-accent hover:bg-hc-accent/80" : "bg-gray-700 hover:bg-gray-600"
            )}
          >
            {webrtcConnection.isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </Button>

          {/* End Call */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "rounded-full w-12 h-12 text-white",
              showChat ? "bg-hc-accent hover:bg-hc-accent/80" : "bg-gray-700 hover:bg-gray-600"
            )}
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          {/* Participants (for webinars) */}
          {session.type === 'webinar' && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowParticipants(!showParticipants)}
              className={cn(
                "rounded-full w-12 h-12 text-white",
                showParticipants ? "bg-hc-accent hover:bg-hc-accent/80" : "bg-gray-700 hover:bg-gray-600"
              )}
            >
              <Users className="w-6 h-6" />
            </Button>
          )}

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleFullscreen}
            className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white"
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {webrtcState.error && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
          <p className="text-sm">{webrtcState.error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {webrtcState.isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
            <Progress value={50} className="w-48 mb-4" />
            <p className="text-gray-900 font-medium">Connecting to session...</p>
            <p className="text-sm text-gray-600 mt-1">Please wait while we establish the connection</p>
          </div>
        </div>
      )}
    </div>
  );
};