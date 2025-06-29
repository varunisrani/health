
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription, TrialStatus } from '@/types';
import { subscriptionService } from '@/services/subscriptionService';
import { auditService } from '@/services/auditService';

interface User {
  id: string;
  email: string;
  name: string;
  subscription?: Subscription;
  trialStatus?: TrialStatus;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  subscription: Subscription | null;
  trialStatus: TrialStatus | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  refreshSubscription: () => Promise<void>;
  isTrialExpiring: boolean;
  isTrialExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  
  // Debug modal state changes
  useEffect(() => {
    console.log('AuthModal state changed to:', showAuthModal);
  }, [showAuthModal]);

  useEffect(() => {
    // Check for existing auth on mount
    const savedUser = localStorage.getItem('healconnect_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('User restored from localStorage:', parsedUser);
        
        // Load subscription data
        loadSubscriptionData(parsedUser.id);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('healconnect_user');
      }
    }
  }, []);

  // Load subscription and trial data
  const loadSubscriptionData = async (userId: string) => {
    try {
      const [subscriptionData, trialData] = await Promise.all([
        subscriptionService.getUserSubscription(userId),
        subscriptionService.getTrialStatus(userId)
      ]);
      
      setSubscription(subscriptionData);
      setTrialStatus(trialData);
      
      // Log subscription access
      await auditService.logEvent(userId, 'subscription_data_accessed', 'subscription');
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    }
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    if (user) {
      await loadSubscriptionData(user.id);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      // Mock authentication - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('healconnect_user', JSON.stringify(mockUser));
      
      // Load subscription data
      await loadSubscriptionData(mockUser.id);
      
      // Log successful login
      await auditService.logEvent(mockUser.id, 'user_login', 'auth', { email });
      
      console.log('Login successful:', mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Log failed login attempt
      await auditService.logEvent('unknown', 'login_failed', 'auth', { email, error: error.message });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('Signup attempt for:', email, name);
      // Mock signup - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: '1',
        email,
        name,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('healconnect_user', JSON.stringify(mockUser));
      
      // Load subscription data (will create trial)
      await loadSubscriptionData(mockUser.id);
      
      // Log successful signup
      await auditService.logEvent(mockUser.id, 'user_signup', 'auth', { email, name });
      
      console.log('Signup successful:', mockUser);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = async () => {
    if (user) {
      // Log logout
      await auditService.logEvent(user.id, 'user_logout', 'auth');
    }
    
    console.log('Logging out user');
    setUser(null);
    setSubscription(null);
    setTrialStatus(null);
    setIsAuthenticated(false);
    setShowAuthModal(false);
    localStorage.removeItem('healconnect_user');
  };

  // Calculate trial status flags
  const isTrialExpiring = trialStatus ? trialStatus.daysRemaining <= 3 && trialStatus.isActive : false;
  const isTrialExpired = trialStatus ? trialStatus.hasExpired : false;

  // Enhanced debug logging
  console.log('AuthContext current state:', { 
    isAuthenticated, 
    showAuthModal, 
    userName: user?.name || 'No user',
    planType: subscription?.planType || 'none',
    trialDaysRemaining: trialStatus?.daysRemaining || 0
  });

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      subscription,
      trialStatus,
      login,
      signup,
      logout,
      showAuthModal,
      setShowAuthModal,
      refreshSubscription,
      isTrialExpiring,
      isTrialExpired,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
