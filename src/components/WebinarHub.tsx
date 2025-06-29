import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Search,
  Filter,
  Play,
  Eye,
  Heart,
  Share2,
  Bookmark,
  BookmarkCheck,
  Star,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { useSessions } from '@/hooks/useSessions';
import { LiveSession } from '@/context/SessionsContext';
import { cn } from '@/lib/utils';

interface WebinarHubProps {
  onJoinWebinar?: (webinarId: string) => void;
  onBookmarkWebinar?: (webinarId: string) => void;
}

export const WebinarHub: React.FC<WebinarHubProps> = ({
  onJoinWebinar,
  onBookmarkWebinar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'rating'>('date');
  const [bookmarkedWebinars, setBookmarkedWebinars] = useState<Set<string>>(new Set());

  const {
    sessions,
    liveSessions,
    upcomingSessions,
    searchSessions,
    canJoinSession,
    getSessionAvailability
  } = useSessions();

  // Filter to only show webinars
  const webinars = sessions.filter(session => session.type === 'webinar');
  const liveWebinars = liveSessions.filter(session => session.type === 'webinar');
  const upcomingWebinars = upcomingSessions.filter(session => session.type === 'webinar');

  // Mock categories and featured webinars
  const categories = [
    { id: 'all', name: 'All Categories', count: webinars.length },
    { id: 'mindfulness', name: 'Mindfulness & Meditation', count: 12 },
    { id: 'anxiety', name: 'Anxiety Management', count: 8 },
    { id: 'depression', name: 'Depression Support', count: 6 },
    { id: 'stress', name: 'Stress Relief', count: 10 },
    { id: 'relationships', name: 'Relationships', count: 5 },
    { id: 'sleep', name: 'Sleep & Wellness', count: 7 }
  ];

  // Load bookmarked webinars from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('healconnect_bookmarked_webinars');
    if (saved) {
      setBookmarkedWebinars(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save bookmarked webinars to localStorage
  useEffect(() => {
    localStorage.setItem('healconnect_bookmarked_webinars', JSON.stringify([...bookmarkedWebinars]));
  }, [bookmarkedWebinars]);

  const handleJoinWebinar = (webinarId: string) => {
    if (onJoinWebinar) {
      onJoinWebinar(webinarId);
    }
  };

  const handleBookmarkToggle = (webinarId: string) => {
    const newBookmarks = new Set(bookmarkedWebinars);
    if (newBookmarks.has(webinarId)) {
      newBookmarks.delete(webinarId);
    } else {
      newBookmarks.add(webinarId);
    }
    setBookmarkedWebinars(newBookmarks);
    
    if (onBookmarkWebinar) {
      onBookmarkWebinar(webinarId);
    }
  };

  const getStatusBadge = (webinar: LiveSession) => {
    switch (webinar.status) {
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>;
      case 'scheduled':
        const now = new Date();
        const webinarTime = new Date(webinar.scheduledTime);
        const timeDiff = webinarTime.getTime() - now.getTime();
        const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
        
        if (hoursUntil <= 24 && hoursUntil > 0) {
          return <Badge className="bg-orange-500 text-white">Starting in {hoursUntil}h</Badge>;
        }
        return <Badge className="bg-hc-tertiary text-hc-primary">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Recorded</Badge>;
      default:
        return null;
    }
  };

  const getParticipantInfo = (webinar: LiveSession) => {
    const { available, total } = getSessionAvailability(webinar);
    const attending = total - available;
    
    if (webinar.status === 'live') {
      return `${attending} watching`;
    } else if (webinar.status === 'scheduled') {
      return `${attending}/${total} registered`;
    } else {
      return `${attending} attended`;
    }
  };

  const WebinarCard: React.FC<{ webinar: LiveSession; featured?: boolean }> = ({ 
    webinar, 
    featured = false 
  }) => (
    <Card className={cn(
      "hover-lift overflow-hidden",
      featured && "border-hc-accent shadow-lg"
    )}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-hc-primary to-hc-accent">
        {webinar.thumbnail ? (
          <img 
            src={webinar.thumbnail} 
            alt={webinar.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <Video className="w-12 h-12" />
          </div>
        )}
        
        {/* Status overlay */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(webinar)}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {webinar.duration} min
        </div>
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-500 text-black">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-hc-primary text-white text-xs">
                {webinar.therapistName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {webinar.therapistName}
              </p>
              <p className="text-xs text-gray-600">Licensed Therapist</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBookmarkToggle(webinar.id)}
            className="text-gray-400 hover:text-hc-accent p-1"
          >
            {bookmarkedWebinars.has(webinar.id) ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {webinar.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {webinar.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(webinar.scheduledTime), 'MMM d')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(webinar.scheduledTime), 'h:mm a')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{getParticipantInfo(webinar)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mock rating */}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
            {/* Mock popularity indicator */}
            <div className="flex items-center space-x-1 text-hc-accent">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Popular</span>
            </div>
          </div>
          
          <Button
            onClick={() => handleJoinWebinar(webinar.id)}
            disabled={!canJoinSession(webinar)}
            size="sm"
            className={cn(
              webinar.status === 'live' 
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                : webinar.status === 'completed'
                ? "bg-hc-secondary hover:bg-hc-secondary/90 text-white"
                : "bg-hc-accent hover:bg-hc-accent/90 text-white"
            )}
          >
            {webinar.status === 'live' ? (
              <>
                <Play className="w-3 h-3 mr-1" />
                Watch Live
              </>
            ) : webinar.status === 'completed' ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Watch Recording
              </>
            ) : (
              <>
                <Calendar className="w-3 h-3 mr-1" />
                Register
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Featured webinars (first 3 live or upcoming)
  const featuredWebinars = [...liveWebinars, ...upcomingWebinars].slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webinar Hub</h1>
          <p className="text-gray-600">Join live therapy webinars and watch recorded sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" className="bg-hc-primary hover:bg-hc-primary/90 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Host Webinar
          </Button>
        </div>
      </div>

      {/* Live Webinars Banner */}
      {liveWebinars.length > 0 && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-red-700">Live Now</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveWebinars.map(webinar => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Webinars */}
      {featuredWebinars.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Featured Webinars
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredWebinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search webinars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Webinar Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({webinars.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingWebinars.length})</TabsTrigger>
          <TabsTrigger value="recorded">Recorded ({webinars.filter(w => w.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked ({bookmarkedWebinars.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {webinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingWebinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recorded" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {webinars.filter(w => w.status === 'completed').map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-6">
          {bookmarkedWebinars.size === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookmarked Webinars</h3>
                <p className="text-gray-600">
                  Bookmark webinars to save them for later viewing.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {webinars.filter(w => bookmarkedWebinars.has(w.id)).map(webinar => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};