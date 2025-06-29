import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Search,
  Filter,
  Play,
  Eye,
  VideoIcon,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  PhoneOff
} from 'lucide-react';
import { format } from 'date-fns';
import { useSessions } from '@/hooks/useSessions';
import { useSessionsContext } from '@/context/SessionsContext';
import { LiveSession } from '@/context/SessionsContext';

interface LiveSessionsProps {
  onJoinSession?: (sessionId: string) => void;
  onBookSession?: () => void;
}

export const LiveSessions: React.FC<LiveSessionsProps> = ({
  onJoinSession,
  onBookSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'webinar' | 'one-on-one'>('all');
  const [activeTab, setActiveTab] = useState('live');

  const {
    liveSessions,
    upcomingSessions,
    getTodaysSessions,
    searchSessions,
    canJoinSession,
    getSessionAvailability,
    isJoiningSession
  } = useSessions();

  const { currentSession, isInCall } = useSessionsContext();

  // Filter sessions based on search and type
  const filteredSessions = (sessions: LiveSession[]) => {
    let filtered = sessions;
    
    if (searchQuery) {
      filtered = searchSessions(searchQuery);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(session => session.type === filterType);
    }
    
    return filtered;
  };

  const handleJoinSession = (sessionId: string) => {
    if (onJoinSession) {
      onJoinSession(sessionId);
    }
  };

  const getStatusBadge = (session: LiveSession) => {
    switch (session.status) {
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>;
      case 'scheduled':
        return <Badge className="bg-hc-tertiary text-hc-primary">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      default:
        return null;
    }
  };

  const getParticipantInfo = (session: LiveSession) => {
    if (session.type === 'one-on-one') {
      return '1-on-1 Session';
    }
    
    const { available, total } = getSessionAvailability(session);
    return `${total - available}/${total} participants`;
  };

  const SessionCard: React.FC<{ session: LiveSession }> = ({ session }) => (
    <Card key={session.id} className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-hc-primary text-white">
                {session.therapistName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{session.title}</h3>
              <p className="text-sm text-gray-600">with {session.therapistName}</p>
            </div>
          </div>
          {getStatusBadge(session)}
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{session.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(session.scheduledTime), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(session.scheduledTime), 'h:mm a')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{getParticipantInfo(session)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {session.type === 'webinar' ? (
              <div className="flex items-center space-x-1 text-hc-accent bg-hc-accent/10 px-2 py-1 rounded-md">
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">Webinar</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-hc-primary bg-hc-primary/10 px-2 py-1 rounded-md">
                <VideoIcon className="w-4 h-4" />
                <span className="text-sm font-medium">1-on-1</span>
              </div>
            )}
            <span className="text-xs text-gray-500">{session.duration} min</span>
          </div>
          
          <Button
            onClick={() => handleJoinSession(session.id)}
            disabled={!canJoinSession(session) || isJoiningSession}
            className={session.status === 'live' 
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
              : "bg-hc-accent hover:bg-hc-accent/90 text-white"
            }
          >
            {session.status === 'live' ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Join Live
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Join Session
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
          <p className="text-gray-600">Join live therapy sessions and webinars</p>
        </div>
        <Button onClick={onBookSession} className="bg-hc-primary hover:bg-hc-primary/90 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>

      {/* Current Session Alert */}
      {isInCall && currentSession && (
        <Card className="border-hc-accent bg-hc-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-semibold text-gray-900">Currently in session</p>
                  <p className="text-sm text-gray-600">{currentSession.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <VideoIcon className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm">
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="webinar">Webinars</SelectItem>
            <SelectItem value="one-on-one">1-on-1 Sessions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Session Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live Now ({liveSessions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="today">
            Today ({getTodaysSessions().length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {filteredSessions(liveSessions).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Live Sessions</h3>
                <p className="text-gray-600">
                  There are no live sessions right now. Check back later or browse upcoming sessions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSessions(liveSessions).map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {filteredSessions(getTodaysSessions()).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Today</h3>
                <p className="text-gray-600">
                  You don't have any sessions scheduled for today. 
                  {onBookSession && (
                    <>
                      <br />
                      <Button 
                        variant="link" 
                        onClick={onBookSession}
                        className="text-hc-accent hover:text-hc-accent/80 p-0 h-auto"
                      >
                        Book a session
                      </Button> to get started.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSessions(getTodaysSessions()).map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredSessions(upcomingSessions).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                <p className="text-gray-600">
                  You don't have any upcoming sessions scheduled.
                  {onBookSession && (
                    <>
                      <br />
                      <Button 
                        variant="link" 
                        onClick={onBookSession}
                        className="text-hc-accent hover:text-hc-accent/80 p-0 h-auto"
                      >
                        Book your first session
                      </Button> to begin your wellness journey.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSessions(upcomingSessions).map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};