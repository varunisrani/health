
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
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
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('healconnect_user');
      }
    }
  }, []);

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
      console.log('Login successful:', mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
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
      console.log('Signup successful:', mockUser);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(false);
    localStorage.removeItem('healconnect_user');
  };

  // Enhanced debug logging
  console.log('AuthContext current state:', { 
    isAuthenticated, 
    showAuthModal, 
    userName: user?.name || 'No user' 
  });

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      signup,
      logout,
      showAuthModal,
      setShowAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
