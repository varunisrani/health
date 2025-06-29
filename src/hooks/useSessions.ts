import { useState, useEffect, useCallback } from 'react';
import { useSessionsContext, LiveSession } from '@/context/SessionsContext';
import { useAuth } from '@/context/AuthContext';

export interface SessionFilters {
  type?: 'webinar' | 'one-on-one';
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  therapistId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SessionBookingData {
  type: 'webinar' | 'one-on-one';
  title: string;
  description: string;
  therapistId: string;
  therapistName: string;
  scheduledTime: Date;
  duration: number;
  maxParticipants?: number;
}

export const useSessions = () => {
  const { user } = useAuth();
  const {
    sessions,
    currentSession,
    upcomingSessions,
    liveSessions,
    createSession,
    updateSession,
    deleteSession,
    joinSession,
    leaveSession,
    isJoiningSession,
    sessionError
  } = useSessionsContext();

  const [filters, setFilters] = useState<SessionFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'therapist'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted sessions
  const filteredSessions = sessions.filter(session => {
    if (filters.type && session.type !== filters.type) return false;
    if (filters.status && session.status !== filters.status) return false;
    if (filters.therapistId && session.therapistId !== filters.therapistId) return false;
    if (filters.dateRange) {
      const sessionDate = new Date(session.scheduledTime);
      if (sessionDate < filters.dateRange.start || sessionDate > filters.dateRange.end) {
        return false;
      }
    }
    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'therapist':
        comparison = a.therapistName.localeCompare(b.therapistName);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Session management functions
  const bookSession = useCallback(async (sessionData: SessionBookingData): Promise<string | null> => {
    try {
      const sessionId = createSession({
        ...sessionData,
        status: 'scheduled',
        participants: []
      });
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return sessionId;
    } catch (error) {
      console.error('Error booking session:', error);
      return null;
    }
  }, [createSession]);

  const cancelSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      updateSession(sessionId, { status: 'cancelled' });
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error cancelling session:', error);
      return false;
    }
  }, [updateSession]);

  const rescheduleSession = useCallback(async (
    sessionId: string, 
    newTime: Date
  ): Promise<boolean> => {
    try {
      updateSession(sessionId, { 
        scheduledTime: newTime,
        status: 'scheduled'
      });
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error rescheduling session:', error);
      return false;
    }
  }, [updateSession]);

  const joinSessionById = useCallback(async (sessionId: string): Promise<boolean> => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      console.error('Session not found');
      return false;
    }

    // Check if session is ready to join
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    const thirtyMinutesBefore = new Date(sessionTime.getTime() - 30 * 60 * 1000);
    
    if (now < thirtyMinutesBefore) {
      console.error('Session cannot be joined more than 30 minutes before start time');
      return false;
    }

    return await joinSession(sessionId);
  }, [sessions, joinSession]);

  // Get sessions by status
  const getSessionsByStatus = useCallback((status: LiveSession['status']) => {
    return sessions.filter(session => session.status === status);
  }, [sessions]);

  // Get sessions by therapist
  const getSessionsByTherapist = useCallback((therapistId: string) => {
    return sessions.filter(session => session.therapistId === therapistId);
  }, [sessions]);

  // Get upcoming sessions for today
  const getTodaysSessions = useCallback(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledTime);
      return sessionDate >= startOfDay && sessionDate < endOfDay && session.status === 'scheduled';
    });
  }, [sessions]);

  // Get sessions for this week
  const getThisWeeksSessions = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledTime);
      return sessionDate >= startOfWeek && sessionDate < endOfWeek;
    });
  }, [sessions]);

  // Check if user can join a session
  const canJoinSession = useCallback((session: LiveSession): boolean => {
    if (!user) return false;
    
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    const thirtyMinutesBefore = new Date(sessionTime.getTime() - 30 * 60 * 1000);
    const sessionEnd = new Date(sessionTime.getTime() + session.duration * 60 * 1000);
    
    // Can join 30 minutes before until session ends
    return now >= thirtyMinutesBefore && now <= sessionEnd && session.status !== 'cancelled';
  }, [user]);

  // Get session availability
  const getSessionAvailability = useCallback((session: LiveSession) => {
    if (session.type === 'one-on-one') {
      return { available: 1, total: 1 };
    }
    
    const participantCount = session.participants?.length || 0;
    const maxParticipants = session.maxParticipants || 0;
    
    return {
      available: Math.max(0, maxParticipants - participantCount),
      total: maxParticipants
    };
  }, []);

  // Search sessions
  const searchSessions = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return sessions.filter(session => 
      session.title.toLowerCase().includes(lowerQuery) ||
      session.description.toLowerCase().includes(lowerQuery) ||
      session.therapistName.toLowerCase().includes(lowerQuery)
    );
  }, [sessions]);

  // Get recommended sessions based on user history
  const getRecommendedSessions = useCallback(() => {
    // Simple recommendation logic - in production, this would be more sophisticated
    const userPastSessions = sessions.filter(s => 
      s.status === 'completed' && s.participants?.includes(user?.id || '')
    );
    
    // Get therapists user has worked with
    const preferredTherapists = Array.from(new Set(
      userPastSessions.map(s => s.therapistId)
    ));
    
    // Get session types user has attended
    const preferredTypes = Array.from(new Set(
      userPastSessions.map(s => s.type)
    ));
    
    // Filter upcoming sessions by preferences
    return upcomingSessions.filter(session => 
      preferredTherapists.includes(session.therapistId) ||
      preferredTypes.includes(session.type)
    ).slice(0, 5); // Return top 5 recommendations
  }, [sessions, upcomingSessions, user]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SessionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Update sorting
  const updateSorting = useCallback((field: typeof sortBy, order: typeof sortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  return {
    // Sessions data
    sessions: sortedSessions,
    allSessions: sessions,
    currentSession,
    upcomingSessions,
    liveSessions,
    
    // Session management
    bookSession,
    cancelSession,
    rescheduleSession,
    joinSession: joinSessionById,
    leaveSession,
    
    // Session queries
    getSessionsByStatus,
    getSessionsByTherapist,
    getTodaysSessions,
    getThisWeeksSessions,
    searchSessions,
    getRecommendedSessions,
    
    // Session utilities
    canJoinSession,
    getSessionAvailability,
    
    // Filtering and sorting
    filters,
    updateFilters,
    clearFilters,
    sortBy,
    sortOrder,
    updateSorting,
    
    // UI state
    isJoiningSession,
    sessionError
  };
};