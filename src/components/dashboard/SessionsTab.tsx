
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';

interface Session {
  id: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  meetLink: string;
  status: 'upcoming' | 'completed';
}

export const SessionsTab = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const savedSessions = localStorage.getItem('healconnect_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  const openMeetLink = (link: string) => {
    window.open(`https://${link}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Sessions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Upcoming Sessions</h2>
        {upcomingSessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <p>No upcoming sessions. Book a session with a therapist to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover-lift">
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
                        <p className="text-sm text-gray-600">
                          {format(new Date(session.date), 'EEEE, MMMM d, yyyy')} at {session.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-hc-tertiary text-hc-primary">Upcoming</Badge>
                      <Button
                        onClick={() => openMeetLink(session.meetLink)}
                        className="bg-hc-accent hover:bg-hc-accent/90 text-white"
                      >
                        Join Meeting
                      </Button>
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Past Sessions</h2>
        {pastSessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <p>No past sessions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {pastSessions.map((session) => (
              <AccordionItem key={session.id} value={session.id}>
                <AccordionTrigger className="px-4">
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
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Rate your session:</p>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className="text-yellow-400 hover:text-yellow-500">
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Session notes:</p>
                      <p className="text-sm mt-1">Great session focused on breathing techniques and mindfulness.</p>
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
