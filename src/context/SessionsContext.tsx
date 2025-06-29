import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface LiveSession {
  id: string;
  type: 'webinar' | 'one-on-one';
  title: string;
  description: string;
  therapistId: string;
  therapistName: string;
  scheduledTime: Date;
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  maxParticipants?: number;
  recordingUrl?: string;
  meetingLink?: string;
  participants?: string[];
  thumbnail?: string;
}

export interface WebRTCConnection {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isConnected: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
}

export interface SessionsContextType {
  // Sessions
  sessions: LiveSession[];
  currentSession: LiveSession | null;
  upcomingSessions: LiveSession[];
  liveSessions: LiveSession[];
  
  // Session Management
  createSession: (session: Omit<LiveSession, 'id'>) => string;
  updateSession: (id: string, updates: Partial<LiveSession>) => void;
  deleteSession: (id: string) => void;
  joinSession: (sessionId: string) => Promise<boolean>;
  leaveSession: () => void;
  
  // WebRTC
  webrtcConnection: WebRTCConnection;
  initializeWebRTC: () => Promise<void>;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  endCall: () => void;
  
  // UI State
  isInCall: boolean;
  isJoiningSession: boolean;
  sessionError: string | null;
  
  // Settings
  audioEnabled: boolean;
  videoEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  setVideoEnabled: (enabled: boolean) => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export const useSessionsContext = () => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error('useSessionsContext must be used within a SessionsProvider');
  }
  return context;
};

// Mock data for development
const mockSessions: LiveSession[] = [
  {
    id: '1',
    type: 'webinar',
    title: 'Mindfulness and Stress Management',
    description: 'Learn practical techniques for managing stress through mindfulness meditation and breathing exercises.',
    therapistId: 'therapist-1',
    therapistName: 'Dr. Sarah Chen',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    status: 'scheduled',
    maxParticipants: 50,
    participants: [],
    thumbnail: '/placeholder.svg'
  },
  {
    id: '2',
    type: 'one-on-one',
    title: 'Individual Therapy Session',
    description: 'Private one-on-one therapy session focused on anxiety management.',
    therapistId: 'therapist-2',
    therapistName: 'Dr. Michael Rodriguez',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 45,
    status: 'scheduled',
    meetingLink: 'meet.mendedminds.com/session-abc123',
    participants: []
  },
  {
    id: '3',
    type: 'webinar',
    title: 'Cognitive Behavioral Therapy Workshop',
    description: 'Interactive workshop on CBT techniques for managing negative thought patterns.',
    therapistId: 'therapist-3',
    therapistName: 'Dr. Emma Thompson',
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    duration: 90,
    status: 'live',
    maxParticipants: 100,
    participants: ['user-1', 'user-2', 'user-3'],
    thumbnail: '/placeholder.svg'
  }
];

export const SessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<LiveSession[]>(mockSessions);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const [webrtcConnection, setWebrtcConnection] = useState<WebRTCConnection>({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isConnected: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    connectionState: 'new',
    iceConnectionState: 'new'
  });

  // Computed values
  const upcomingSessions = sessions.filter(s => 
    s.status === 'scheduled' && new Date(s.scheduledTime) > new Date()
  );
  
  const liveSessions = sessions.filter(s => s.status === 'live');

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('mendedminds_live_sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((s: any) => ({
          ...s,
          scheduledTime: new Date(s.scheduledTime)
        }));
        setSessions(parsedSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('mendedminds_live_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Session Management Functions
  const createSession = (sessionData: Omit<LiveSession, 'id'>): string => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSession: LiveSession = {
      ...sessionData,
      id,
      participants: []
    };
    
    setSessions(prev => [...prev, newSession]);
    return id;
  };

  const updateSession = (id: string, updates: Partial<LiveSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
      setIsInCall(false);
    }
  };

  const joinSession = async (sessionId: string): Promise<boolean> => {
    setIsJoiningSession(true);
    setSessionError(null);
    
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSession(session);
      setIsInCall(true);
      
      // Update session status to live if it's scheduled
      if (session.status === 'scheduled') {
        updateSession(sessionId, { status: 'live' });
      }
      
      return true;
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : 'Failed to join session');
      return false;
    } finally {
      setIsJoiningSession(false);
    }
  };

  const leaveSession = () => {
    if (webrtcConnection.peerConnection) {
      webrtcConnection.peerConnection.close();
    }
    
    if (webrtcConnection.localStream) {
      webrtcConnection.localStream.getTracks().forEach(track => track.stop());
    }
    
    setWebrtcConnection({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isConnected: false,
      isMuted: false,
      isVideoEnabled: true,
      isScreenSharing: false,
      connectionState: 'new',
      iceConnectionState: 'new'
    });
    
    setCurrentSession(null);
    setIsInCall(false);
    setSessionError(null);
  };

  // WebRTC Functions
  const initializeWebRTC = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });

      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream to peer connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setWebrtcConnection(prev => ({
          ...prev,
          remoteStream: event.streams[0]
        }));
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        setWebrtcConnection(prev => ({
          ...prev,
          connectionState: peerConnection.connectionState,
          isConnected: peerConnection.connectionState === 'connected'
        }));
      };

      peerConnection.oniceconnectionstatechange = () => {
        setWebrtcConnection(prev => ({
          ...prev,
          iceConnectionState: peerConnection.iceConnectionState
        }));
      };

      setWebrtcConnection(prev => ({
        ...prev,
        localStream,
        peerConnection,
        isVideoEnabled: videoEnabled,
        isMuted: !audioEnabled
      }));

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setSessionError('Failed to access camera/microphone');
    }
  };

  const toggleMute = () => {
    if (webrtcConnection.localStream) {
      const audioTrack = webrtcConnection.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setWebrtcConnection(prev => ({
          ...prev,
          isMuted: !audioTrack.enabled
        }));
      }
    }
  };

  const toggleVideo = () => {
    if (webrtcConnection.localStream) {
      const videoTrack = webrtcConnection.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setWebrtcConnection(prev => ({
          ...prev,
          isVideoEnabled: videoTrack.enabled
        }));
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (webrtcConnection.isScreenSharing) {
        // Stop screen sharing, return to camera
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        
        if (webrtcConnection.peerConnection && webrtcConnection.localStream) {
          const sender = webrtcConnection.peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
          
          // Replace track in local stream
          const oldVideoTrack = webrtcConnection.localStream.getVideoTracks()[0];
          webrtcConnection.localStream.removeTrack(oldVideoTrack);
          webrtcConnection.localStream.addTrack(videoTrack);
          oldVideoTrack.stop();
        }
        
        setWebrtcConnection(prev => ({ ...prev, isScreenSharing: false }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        if (webrtcConnection.peerConnection && webrtcConnection.localStream) {
          const sender = webrtcConnection.peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(screenTrack);
          }
          
          // Replace track in local stream
          const oldVideoTrack = webrtcConnection.localStream.getVideoTracks()[0];
          webrtcConnection.localStream.removeTrack(oldVideoTrack);
          webrtcConnection.localStream.addTrack(screenTrack);
          oldVideoTrack.stop();
        }
        
        // Handle screen share ending
        screenTrack.onended = () => {
          toggleScreenShare(); // This will switch back to camera
        };
        
        setWebrtcConnection(prev => ({ ...prev, isScreenSharing: true }));
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      setSessionError('Failed to toggle screen sharing');
    }
  };

  const endCall = () => {
    leaveSession();
  };

  const contextValue: SessionsContextType = {
    // Sessions
    sessions,
    currentSession,
    upcomingSessions,
    liveSessions,
    
    // Session Management
    createSession,
    updateSession,
    deleteSession,
    joinSession,
    leaveSession,
    
    // WebRTC
    webrtcConnection,
    initializeWebRTC,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    endCall,
    
    // UI State
    isInCall,
    isJoiningSession,
    sessionError,
    
    // Settings
    audioEnabled,
    videoEnabled,
    setAudioEnabled,
    setVideoEnabled
  };

  return (
    <SessionsContext.Provider value={contextValue}>
      {children}
    </SessionsContext.Provider>
  );
};