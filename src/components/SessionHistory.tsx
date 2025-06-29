import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar,
  Clock,
  Video,
  Users,
  Play,
  Download,
  Star,
  StarIcon,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MoreHorizontal
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { useSessions } from '@/hooks/useSessions';
import { LiveSession } from '@/context/SessionsContext';
import { cn } from '@/lib/utils';

interface SessionNote {
  id: string;
  sessionId: string;
  content: string;
  timestamp: Date;
}

interface SessionRating {
  sessionId: string;
  rating: number;
  feedback: string;
  timestamp: Date;
}

interface SessionHistoryProps {
  onWatchRecording?: (sessionId: string) => void;
  onRebookSession?: (sessionId: string) => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  onWatchRecording,
  onRebookSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'one-on-one' | 'webinar'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'therapist'>('date');
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [sessionRatings, setSessionRatings] = useState<SessionRating[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [newFeedback, setNewFeedback] = useState('');

  const { getSessionsByStatus, searchSessions } = useSessions();

  // Get completed sessions
  const completedSessions = getSessionsByStatus('completed');

  // Mock session notes and ratings for demo
  React.useEffect(() => {
    const mockNotes: SessionNote[] = [
      {
        id: '1',
        sessionId: '1',
        content: 'Great session on breathing techniques. Need to practice the 4-7-8 method daily.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        sessionId: '2',
        content: 'Discussed anxiety management strategies. Therapist recommended mindfulness app.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockRatings: SessionRating[] = [
      {
        sessionId: '1',
        rating: 5,
        feedback: 'Excellent session! Dr. Chen was very helpful and understanding.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        sessionId: '2',
        rating: 4,
        feedback: 'Good insights on anxiety management. Would recommend.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    setSessionNotes(mockNotes);
    setSessionRatings(mockRatings);
  }, []);

  // Filter sessions based on search, type, and period
  const filteredSessions = completedSessions.filter(session => {
    // Search filter
    if (searchQuery) {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filterType !== 'all' && session.type !== filterType) return false;

    // Period filter
    if (filterPeriod !== 'all') {
      const sessionDate = new Date(session.scheduledTime);
      const now = new Date();
      let cutoffDate: Date;

      switch (filterPeriod) {
        case 'week':
          cutoffDate = subWeeks(now, 1);
          break;
        case 'month':
          cutoffDate = subMonths(now, 1);
          break;
        case 'quarter':
          cutoffDate = subMonths(now, 3);
          break;
        default:
          cutoffDate = new Date(0);
      }

      if (sessionDate < cutoffDate) return false;
    }

    return true;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime();
      case 'rating':
        const ratingA = sessionRatings.find(r => r.sessionId === a.id)?.rating || 0;
        const ratingB = sessionRatings.find(r => r.sessionId === b.id)?.rating || 0;
        return ratingB - ratingA;
      case 'therapist':
        return a.therapistName.localeCompare(b.therapistName);
      default:
        return 0;
    }
  });

  const handleAddNote = () => {
    if (!selectedSession || !newNote.trim()) return;

    const note: SessionNote = {
      id: Date.now().toString(),
      sessionId: selectedSession.id,
      content: newNote.trim(),
      timestamp: new Date()
    };

    setSessionNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const handleAddRating = () => {
    if (!selectedSession || newRating === 0) return;

    const rating: SessionRating = {
      sessionId: selectedSession.id,
      rating: newRating,
      feedback: newFeedback.trim(),
      timestamp: new Date()
    };

    setSessionRatings(prev => prev.filter(r => r.sessionId !== selectedSession.id).concat(rating));
    setNewRating(0);
    setNewFeedback('');
  };

  const getSessionRating = (sessionId: string) => {
    return sessionRatings.find(r => r.sessionId === sessionId);
  };

  const getSessionNotes = (sessionId: string) => {
    return sessionNotes.filter(n => n.sessionId === sessionId);
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onStarClick?.(star)}
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive && "hover:text-yellow-400 cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                "w-4 h-4",
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const SessionCard: React.FC<{ session: LiveSession }> = ({ session }) => {
    const rating = getSessionRating(session.id);
    const notes = getSessionNotes(session.id);

    return (
      <Card className="hover-lift">
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
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-500 text-white">Completed</Badge>
              {session.type === 'webinar' ? (
                <Badge variant="outline" className="text-hc-accent border-hc-accent">
                  <Users className="w-3 h-3 mr-1" />
                  Webinar
                </Badge>
              ) : (
                <Badge variant="outline" className="text-hc-primary border-hc-primary">
                  <Video className="w-3 h-3 mr-1" />
                  1-on-1
                </Badge>
              )}
            </div>
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
                <span>{session.duration} min</span>
              </div>
            </div>
            
            {rating && (
              <div className="flex items-center space-x-1">
                {renderStars(rating.rating)}
                <span className="text-xs">({rating.rating}/5)</span>
              </div>
            )}
          </div>

          {notes.length > 0 && (
            <div className="mb-4 p-3 bg-hc-surface rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-hc-accent" />
                <span className="text-sm font-medium text-gray-900">Your Notes</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {notes[notes.length - 1].content}
              </p>
              {notes.length > 1 && (
                <p className="text-xs text-gray-500 mt-1">+{notes.length - 1} more notes</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {session.recordingUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWatchRecording?.(session.id)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch Recording
                </Button>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(session)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Session Details</DialogTitle>
                  </DialogHeader>
                  <SessionDetailsModal session={session} />
                </DialogContent>
              </Dialog>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRebookSession?.(session.id)}
              className="text-hc-accent hover:text-hc-accent/80"
            >
              Book Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SessionDetailsModal: React.FC<{ session: LiveSession }> = ({ session }) => {
    const rating = getSessionRating(session.id);
    const notes = getSessionNotes(session.id);

    return (
      <div className="space-y-6">
        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Session Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{format(new Date(session.scheduledTime), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span>{format(new Date(session.scheduledTime), 'h:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{session.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span>{session.type === 'one-on-one' ? '1-on-1 Session' : 'Group Webinar'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Therapist</h4>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-hc-primary text-white">
                  {session.therapistName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.therapistName}</p>
                <p className="text-sm text-gray-600">Licensed Therapist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Your Rating</h4>
          {rating ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {renderStars(rating.rating)}
                <span className="text-sm font-medium">({rating.rating}/5)</span>
              </div>
              {rating.feedback && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  "{rating.feedback}"
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {renderStars(newRating, true, setNewRating)}
                <span className="text-sm text-gray-600">Rate this session</span>
              </div>
              <Textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Share your feedback about this session..."
                rows={3}
              />
              <Button
                onClick={handleAddRating}
                disabled={newRating === 0}
                size="sm"
                className="bg-hc-primary hover:bg-hc-primary/90"
              >
                Submit Rating
              </Button>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Session Notes</h4>
          <div className="space-y-3">
            {notes.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notes.map(note => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(note.timestamp, 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No notes yet</p>
            )}

            <div className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this session..."
                rows={3}
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="sm"
                className="bg-hc-accent hover:bg-hc-accent/90"
              >
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
        <p className="text-gray-600">Review your past therapy sessions and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-hc-primary" />
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-lg font-semibold">{completedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-hc-accent" />
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-lg font-semibold">
                  {Math.round(completedSessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-lg font-semibold">
                  {sessionRatings.length > 0 
                    ? (sessionRatings.reduce((acc, r) => acc + r.rating, 0) / sessionRatings.length).toFixed(1)
                    : '—'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-hc-secondary" />
              <div>
                <p className="text-sm text-gray-600">Notes Created</p>
                <p className="text-lg font-semibold">{sessionNotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Session Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="one-on-one">1-on-1 Sessions</SelectItem>
              <SelectItem value="webinar">Webinars</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPeriod} onValueChange={(value: any) => setFilterPeriod(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="therapist">Therapist</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterType !== 'all' || filterPeriod !== 'all'
                ? 'Try adjusting your filters to see more sessions.'
                : 'You haven\'t completed any sessions yet. Book your first session to get started!'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};