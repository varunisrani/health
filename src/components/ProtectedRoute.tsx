
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, showAuthModal, setShowAuthModal } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, setShowAuthModal]);

  if (!isAuthenticated) {
    return <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />;
  }

  return <>{children}</>;
};
