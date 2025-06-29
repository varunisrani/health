
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth form submitted:', { isLogin, email });
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({ title: "Welcome back!", description: "You've been logged in successfully." });
          onOpenChange(false);
          resetForm();
          navigate('/dashboard');
        } else {
          toast({ title: "Login failed", description: "Please check your credentials.", variant: "destructive" });
        }
      } else {
        if (password !== confirmPassword) {
          toast({ title: "Passwords don't match", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const success = await signup(email, password, name);
        if (success) {
          toast({ title: "Account created!", description: "Welcome to Mended Minds." });
          onOpenChange(false);
          resetForm();
          navigate('/dashboard');
        } else {
          toast({ title: "Signup failed", description: "Please try again.", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({ title: "Authentication failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    console.log('Switching auth mode from', isLogin ? 'login' : 'signup');
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleGoToLoginPage = () => {
    console.log('Navigating to login page');
    onOpenChange(false);
    navigate('/auth/login');
  };

  const handleGoToSignupPage = () => {
    console.log('Navigating to signup page');
    onOpenChange(false);
    navigate('/auth/signup');
  };

  console.log('AuthModal render - open:', open, 'isLogin:', isLogin);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full max-w-md mx-4 ${
        isMobile 
          ? 'h-auto max-h-[90vh] overflow-y-auto p-4' 
          : 'sm:max-w-md'
      }`}>
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-xl sm:text-2xl font-semibold">
            {isLogin ? "Welcome back" : "Join Mended Minds"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 focus:ring-hc-primary focus:border-hc-primary text-base"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 focus:ring-hc-primary focus:border-hc-primary text-base"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 focus:ring-hc-primary focus:border-hc-primary text-base"
              placeholder="Enter your password"
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="h-11 focus:ring-hc-primary focus:border-hc-primary text-base"
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <Button
            type="submit"
            variant="hc-primary"
            className="w-full h-11 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (isLogin ? "Log In" : "Create Account")}
          </Button>
        </form>
        
        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleModeSwitch}
              className="text-hc-primary hover:text-hc-primary/80 h-10"
            >
              {isLogin ? "Create account" : "Log in"}
            </Button>
            <div className="text-xs text-gray-500">or</div>
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToLoginPage}
                className={`h-10 text-sm ${isMobile ? 'w-full' : 'flex-1'}`}
              >
                Go to Login Page
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToSignupPage}
                className={`h-10 text-sm ${isMobile ? 'w-full' : 'flex-1'}`}
              >
                Go to Signup Page
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
