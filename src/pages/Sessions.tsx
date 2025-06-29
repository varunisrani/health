
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Users, 
  History, 
  Play,
  ArrowLeft
} from 'lucide-react';
import { LiveSessions } from '@/components/LiveSessions';
import { WebinarHub } from '@/components/WebinarHub';
import { SessionHistory } from '@/components/SessionHistory';
import { VideoCall } from '@/components/VideoCall';
import { LiveStream } from '@/components/LiveStream';
import { useSessions } from '@/hooks/useSessions';
import { useSessionsContext } from '@/context/SessionsContext';

const Sessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('live');

  const { joinSession } = useSessions();
  const { currentSession, isInCall, leaveSession } = useSessionsContext();

  // Set initial tab based on URL path
  useEffect(() => {
    if (location.pathname.includes('/live')) {
      setActiveTab('live');
    } else if (location.pathname.includes('/webinars')) {
      setActiveTab('webinars');
    } else if (location.pathname.includes('/history')) {
      setActiveTab('history');
    } else {
      setActiveTab('live');
    }
  }, [location.pathname]);

  const handleJoinSession = async (sessionId: string) => {
    const success = await joinSession(sessionId);
    if (success) {
      console.log('Session joined successfully');
    }
  };

  const handleLeaveSession = () => {
    leaveSession();
  };

  // If user is in a call, show the appropriate video interface
  if (isInCall && currentSession) {
    if (currentSession.type === 'one-on-one') {
      return (
        <div className="min-h-screen bg-black">
          <VideoCall 
            session={currentSession}
            onEndCall={handleLeaveSession}
          />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-hc-surface">
          <div className="container mx-auto max-w-7xl p-6">
            <LiveStream 
              session={currentSession}
              onLeaveStream={handleLeaveSession}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-hc-surface">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="ghost" 
            className="text-hc-primary hover:text-hc-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Sessions Hub</h1>
          <p className="text-gray-600">
            Join live therapy sessions, browse webinars, and manage your session history
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="live" className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Live Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="webinars" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Webinars</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            <LiveSessions 
              onJoinSession={handleJoinSession}
            />
          </TabsContent>

          <TabsContent value="webinars" className="mt-6">
            <WebinarHub 
              onJoinWebinar={handleJoinSession}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <SessionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sessions;
