import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Calendar, 
  Clock, 
  History,
  Plus,
  ExternalLink,
  Video
} from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistSpecialty: string;
  date: string;
  time: string;
  meetLink: string;
  status: 'upcoming' | 'completed';
  notes?: string;
  rating?: number;
}

export const SessionsTab = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('healconnect_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      // Add some sample sessions for demonstration
      const sampleSessions: Session[] = [
        {
          id: '1',
          therapistId: 'th1',
          therapistName: 'Dr. Sarah Wilson',
          therapistSpecialty: 'Anxiety & Stress Management',
          date: '2024-01-05',
          time: '2:00 PM',
          meetLink: 'meet.google.com/abc-defg-hij',
          status: 'upcoming'
        },
        {
          id: '2',
          therapistId: 'th2',
          therapistName: 'Dr. Michael Chen',
          therapistSpecialty: 'Depression & Mood Disorders',
          date: '2024-01-03',
          time: '10:00 AM',
          meetLink: 'meet.google.com/xyz-mnop-qrs',
          status: 'completed',
          notes: 'Focused on cognitive behavioral techniques and mindfulness exercises.',
          rating: 5
        }
      ];
      setSessions(sampleSessions);
      localStorage.setItem('healconnect_sessions', JSON.stringify(sampleSessions));
    }
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  const joinGoogleMeet = (meetLink: string) => {
    const fullLink = meetLink.startsWith('http') ? meetLink : `https://${meetLink}`;
    window.open(fullLink, '_blank');
  };

  const bookNewSession = () => {
    // Redirect to therapists tab for booking
    const event = new CustomEvent('navigate-to-therapists');
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-hc-primary" />
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-lg font-semibold">{upcomingSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-hc-secondary" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-lg font-semibold">{pastSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-hc-accent" />
              <div>
                <p className="text-sm text-gray-600">Book New</p>
                <Button 
                  variant="hc-soft" 
                  size="sm" 
                  onClick={bookNewSession}
                  className="mt-1"
                >
                  Find Therapist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <Button 
            onClick={bookNewSession}
            className="bg-hc-primary hover:bg-hc-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Session
          </Button>
        </div>
        
        {upcomingSessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
              <p className="mb-4">Book a session with a therapist to get started!</p>
              <Button 
                onClick={bookNewSession}
                className="bg-hc-primary hover:bg-hc-primary/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-hc-primary text-white">
                          {session.therapistName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.therapistName}</h3>
                        <p className="text-sm text-hc-secondary">{session.therapistSpecialty}</p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(session.date), 'EEEE, MMMM d, yyyy')} at {session.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-hc-tertiary text-hc-tertiary">
                        Upcoming
                      </Badge>
                      <Button
                        onClick={() => joinGoogleMeet(session.meetLink)}
                        className="bg-hc-accent hover:bg-hc-accent/90 text-slate-800"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Google Meet: {session.meetLink}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Past Sessions</h2>
        {pastSessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Sessions</h3>
              <p>Your completed sessions will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {pastSessions.map((session) => (
              <AccordionItem key={session.id} value={session.id}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-hc-primary text-white text-xs">
                          {session.therapistName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{session.therapistName}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(session.date), 'MMM d, yyyy')} at {session.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-hc-soft text-hc-primary">
                      Completed
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {session.rating && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={star <= session.rating! ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.notes && (
                      <div>
                        <p className="text-sm text-gray-600">Session Notes:</p>
                        <p className="text-sm mt-1 bg-hc-soft p-3 rounded-lg">{session.notes}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Google Meet Link: {session.meetLink}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};