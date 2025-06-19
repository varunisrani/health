
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { isLogin, email });
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({ title: "Welcome back!", description: "You've been logged in successfully." });
          onOpenChange(false);
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
          toast({ title: "Account created!", description: "Welcome to HealConnect." });
          onOpenChange(false);
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
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {isLogin ? "Welcome back" : "Join HealConnect"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:ring-hc-primary focus:border-hc-primary"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-hc-primary focus:border-hc-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="focus:ring-hc-primary focus:border-hc-primary"
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="focus:ring-hc-primary focus:border-hc-primary"
              />
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-hc-primary hover:bg-hc-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (isLogin ? "Log In" : "Create Account")}
          </Button>
        </form>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleModeSwitch}
            className="text-hc-primary hover:text-hc-primary/80"
          >
            {isLogin ? "Create account" : "Log in"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
