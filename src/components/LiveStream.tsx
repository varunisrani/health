import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MessageSquare,
  Users,
  Settings,
  Share2,
  ThumbsUp,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Download,
  Star,
  Heart,
  Eye,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { format } from 'date-fns';
import { LiveSession } from '@/context/SessionsContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'question' | 'poll' | 'announcement';
}

interface LiveStreamProps {
  session: LiveSession;
  onLeaveStream: () => void;
  className?: string;
}

export const LiveStream: React.FC<LiveStreamProps> = ({
  session,
  onLeaveStream,
  className
}) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [volume, setVolume] = useState(80);
  const [chatMessage, setChatMessage] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [viewerCount, setViewerCount] = useState(session.participants?.length || 0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [streamDuration, setStreamDuration] = useState(0);

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'host',
      userName: session.therapistName,
      message: 'Welcome everyone! We\'ll be starting in just a moment.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'announcement'
    },
    {
      id: '2',
      userId: 'user1',
      userName: 'Sarah M.',
      message: 'Looking forward to this session!',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'message'
    },
    {
      id: '3',
      userId: 'user2',
      userName: 'John D.',
      message: 'Can you share the resources mentioned earlier?',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      type: 'question'
    }
  ]);

  // Mock participants
  const participants = [
    { id: 'host', name: session.therapistName, role: 'host', isPresenter: true, handRaised: false },
    { id: 'user1', name: 'Sarah M.', role: 'participant', isPresenter: false, handRaised: false },
    { id: 'user2', name: 'John D.', role: 'participant', isPresenter: false, handRaised: true },
    { id: 'user3', name: 'Emma K.', role: 'participant', isPresenter: false, handRaised: false },
    { id: 'user4', name: 'Alex R.', role: 'participant', isPresenter: false, handRaised: false },
  ];

  // Stream duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      message: chatMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the video stream
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'good': return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'poor': return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getChatMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'question': return '❓';
      case 'announcement': return '📢';
      case 'poll': return '📊';
      default: return '';
    }
  };

  return (
    <div className={cn(
      "grid grid-cols-1 lg:grid-cols-4 gap-4 h-full",
      isFullscreen && "fixed inset-0 z-50 bg-black p-4",
      className
    )}>
      {/* Main Video Area */}
      <div className={cn(
        "lg:col-span-3 space-y-4",
        isFullscreen && "col-span-full"
      )}>
        {/* Video Player */}
        <Card className="relative bg-black overflow-hidden">
          <div className="aspect-video relative">
            {/* Mock video stream */}
            <div className="absolute inset-0 bg-gradient-to-br from-hc-primary to-hc-accent flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {session.therapistName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{session.therapistName}</h3>
                <p className="text-white/80">Live Webinar</p>
              </div>
            </div>

            {/* Stream Info Overlay */}
            <div className="absolute top-4 left-4 flex items-center space-x-3">
              <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                {formatDuration(streamDuration)}
              </div>
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{viewerCount}</span>
              </div>
            </div>

            {/* Connection Quality */}
            <div className="absolute top-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
                {getConnectionIcon()}
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-20 accent-hc-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={cn(
                      "text-white hover:bg-white/20",
                      isHandRaised && "bg-yellow-500 hover:bg-yellow-600"
                    )}
                  >
                    <Hand className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{session.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Hosted by {session.therapistName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{session.description}</p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Started {format(new Date(session.scheduledTime), 'h:mm a')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{session.duration} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      {!isFullscreen && (
        <div className="lg:col-span-1 space-y-4">
          <Tabs value={showChat ? "chat" : "participants"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="chat" 
                onClick={() => setShowChat(true)}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="participants"
                onClick={() => setShowChat(false)}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>People ({participants.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-96 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea ref={chatScrollRef} className="flex-1 pr-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-900">
                              {message.userName}
                            </span>
                            {message.type !== 'message' && (
                              <span>{getChatMessageIcon(message.type)}</span>
                            )}
                            <span className="text-xs text-gray-500">
                              {format(message.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm",
                            message.type === 'announcement' && "font-medium text-hc-primary",
                            message.type === 'question' && "text-blue-600"
                          )}>
                            {message.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 text-sm"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      size="sm"
                      className="bg-hc-accent hover:bg-hc-accent/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="space-y-4">
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Participants ({participants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-hc-primary text-white text-xs">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{participant.name}</p>
                              {participant.isPresenter && (
                                <Badge variant="secondary" className="text-xs">
                                  Presenter
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {participant.handRaised && (
                              <Hand className="w-4 h-4 text-yellow-500" />
                            )}
                            {participant.role === 'host' && (
                              <Star className="w-4 h-4 text-hc-accent" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button
            onClick={onLeaveStream}
            variant="destructive"
            className="w-full"
          >
            Leave Webinar
          </Button>
        </div>
      )}
    </div>
  );
};