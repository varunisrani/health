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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('mendedminds_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      // Add some sample sessions for demonstration
      const sampleSessions: Session[] = [
        {
          id: '1',
          therapistId: 'th1',
          therapistName: 'Dr. Priya Sharma',
          therapistSpecialty: 'Anxiety & Stress Management',
          date: '2025-06-30',
          time: '10:00 AM',
          meetLink: 'meet.google.com/ij8a-ga3v-yt0d',
          status: 'upcoming'
        },
        {
          id: '2',
          therapistId: 'th2',
          therapistName: 'Michael Chen',
          therapistSpecialty: 'Depression & Mood Disorders',
          date: '2025-07-10',
          time: '2:00 PM',
          meetLink: 'meet.google.com/ebxn-1w7s-s73y',
          status: 'upcoming'
        }
      ];
      setSessions(sampleSessions);
      localStorage.setItem('mendedminds_sessions', JSON.stringify(sampleSessions));
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
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Enhanced Quick Stats */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        {/* Upcoming Sessions Card */}
        <Card className="bg-gradient-to-br from-hc-primary/5 to-hc-primary/10 border-hc-primary/20 hover:shadow-lg transition-all">
          <CardContent className={isMobile ? "p-4" : "p-6"}>
            <div className="flex items-center space-x-4">
              <div className="bg-hc-primary/10 rounded-full p-3">
                <Calendar className={`text-hc-primary ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
              </div>
              <div>
                <div className={`font-bold text-hc-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {upcomingSessions.length}
                </div>
                <p className={`font-semibold text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Upcoming Sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Sessions Card */}
        <Card className="bg-gradient-to-br from-hc-secondary/5 to-hc-secondary/10 border-hc-secondary/20 hover:shadow-lg transition-all">
          <CardContent className={isMobile ? "p-4" : "p-6"}>
            <div className="flex items-center space-x-4">
              <div className="bg-hc-secondary/10 rounded-full p-3">
                <History className={`text-hc-secondary ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
              </div>
              <div>
                <div className={`font-bold text-hc-secondary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {pastSessions.length}
                </div>
                <p className={`font-semibold text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Completed Sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book New Session Card */}
        <Card className="bg-gradient-to-br from-hc-accent/5 to-hc-accent/10 border-hc-accent/20 hover:shadow-lg transition-all">
          <CardContent className={isMobile ? "p-4" : "p-6"}>
            <div className="flex items-center space-x-4">
              <div className="bg-hc-accent/10 rounded-full p-3">
                <Plus className={`text-hc-accent ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Book New Session
                </p>
                <Button 
                  onClick={bookNewSession}
                  className={`bg-hc-accent hover:bg-hc-accent/90 text-slate-800 font-semibold shadow-md ${
                    isMobile ? 'w-full h-10 text-sm' : 'h-10 px-6'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Find Therapist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Upcoming Sessions
          </h2>
          <Button 
            onClick={bookNewSession}
            className={`bg-hc-primary hover:bg-hc-primary/90 text-white font-medium ${
              isMobile ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm'
            }`}
          >
            <Plus className={`mr-1 sm:mr-2 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={isMobile ? "hidden" : "inline"}>Book Session</span>
            <span className={isMobile ? "inline" : "hidden"}>Book</span>
          </Button>
        </div>
        
        {upcomingSessions.length === 0 ? (
          <Card className="border-dashed border-2 border-hc-primary/30 hover:border-hc-primary/50 transition-colors">
            <CardContent className={isMobile ? "p-6" : "p-8"}>
              <div className="text-center">
                {/* Mobile Layout */}
                <div className={isMobile ? "block" : "hidden"}>
                  <div className="bg-hc-soft/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-hc-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">No Upcoming Sessions</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Book a session with one of our certified therapists to start your healing journey!
                  </p>
                  <Button 
                    onClick={bookNewSession}
                    className="w-full bg-gradient-to-r from-hc-primary to-hc-secondary hover:from-hc-primary/90 hover:to-hc-secondary/90 text-white h-12 text-base font-semibold shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Book Your First Session
                  </Button>
                  <p className="text-xs text-gray-500 mt-3">
                    Choose from yoga, meditation, and music therapy
                  </p>
                </div>
                
                {/* Desktop Layout */}
                <div className={isMobile ? "hidden" : "block"}>
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                  <p className="mb-4 text-base text-gray-600">Book a session with a therapist to get started!</p>
                  <Button 
                    onClick={bookNewSession}
                    className="bg-hc-primary hover:bg-hc-primary/90 text-white h-11 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={`space-y-3 sm:space-y-4`}>
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-all border-l-4 border-l-hc-primary">
                <CardContent className={isMobile ? "p-4" : "p-6"}>
                  {/* Mobile Layout */}
                  <div className={isMobile ? "block" : "hidden"}>
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback className="bg-hc-primary text-white text-sm font-bold">
                            {session.therapistName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-base leading-tight">
                            {session.therapistName}
                          </h3>
                          <p className="text-sm text-hc-secondary font-medium">
                            {session.therapistSpecialty}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-hc-tertiary text-hc-tertiary bg-hc-tertiary/10 text-xs px-2 py-1 flex-shrink-0">
                        Upcoming
                      </Badge>
                    </div>
                    
                    {/* Date & Time */}
                    <div className="bg-hc-soft/50 rounded-lg p-3 mb-3">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-hc-primary flex-shrink-0" />
                        <span className="font-semibold text-sm">
                          {format(new Date(session.date), 'EEEE, MMMM d, yyyy')} at {session.time}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button
                      onClick={() => joinGoogleMeet(session.meetLink)}
                      className="w-full bg-hc-accent hover:bg-hc-accent/90 text-slate-800 h-12 text-sm font-semibold shadow-md"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Join Google Meet
                    </Button>
                    
                    {/* Meet Link */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center bg-gray-50 p-2 rounded">
                        <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate font-mono">{session.meetLink}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className={isMobile ? "hidden" : "block"}>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback className="bg-hc-primary text-white text-sm">
                            {session.therapistName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">{session.therapistName}</h3>
                          <p className="text-sm text-hc-secondary">{session.therapistSpecialty}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                            {format(new Date(session.date), 'MMM d, yyyy')} at {session.time}
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
                        <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Google Meet: {session.meetLink}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h2 className={`font-bold text-gray-900 mb-3 sm:mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Past Sessions
        </h2>
        {pastSessions.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className={isMobile ? "p-6" : "p-8"}>
              <div className="text-center">
                {/* Mobile Layout */}
                <div className={isMobile ? "block" : "hidden"}>
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">No Past Sessions</h3>
                  <p className="text-sm text-gray-600">
                    Your completed sessions will appear here.
                  </p>
                </div>
                
                {/* Desktop Layout */}
                <div className={isMobile ? "hidden" : "block"}>
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Sessions</h3>
                  <p className="text-base text-gray-600">Your completed sessions will appear here.</p>
                </div>
              </div>
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
                              className={star <= session.rating! ? 'text-hc-accent' : 'text-gray-300'}
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