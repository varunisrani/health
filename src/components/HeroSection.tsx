
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleStartTrial = () => {
    console.log('Start trial button clicked, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User authenticated, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('User not authenticated, showing auth modal');
      setShowAuthModal(true);
    }
  };

  const handleBrowseMentors = () => {
    console.log('Browse mentors button clicked, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User authenticated, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('User not authenticated, showing auth modal');
      setShowAuthModal(true);
    }
  };

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-white via-slate-50/30 to-hc-soft/10 overflow-hidden">
      {/* Background Pattern - healing gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,107,140,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(232,184,109,0.15),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-hc-primary to-hc-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-inter font-semibold text-hc-primary">
                HealConnect
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-inter font-semibold text-slate-900 leading-tight">
                Guided Support for Your{" "}
                <span className="bg-gradient-to-r from-hc-primary to-hc-secondary bg-clip-text text-transparent">Healing Journey</span>
              </h1>
              
              <p className="text-xl text-slate-800 leading-relaxed max-w-xl font-medium">
                Healing is a shared journey—let's take the first step together. 
                Connect with trusted wellness mentors for personalized yoga, meditation, and music therapy sessions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 relative z-20">
              <Button 
                onClick={handleStartTrial}
                variant="hc-primary"
                size="xl"
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Start Your 14-Day Free Journey
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={handleBrowseMentors}
                className="rounded-2xl border-2 border-hc-primary text-hc-primary hover:bg-hc-soft hover:border-hc-secondary transition-all duration-300"
              >
                Browse Mentors →
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-sm text-slate-600 max-w-md font-medium">
              Cancel anytime · No hidden fees
            </p>
          </div>

          {/* Right Illustration */}
          <div className="relative lg:pl-12 fade-in">
            <div className="relative">
              {/* Healing Gradient Blob Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-hc-primary/15 via-hc-secondary/15 to-hc-accent/15 rounded-[3rem] transform rotate-3 scale-110 shadow-lg"></div>
              
              {/* Illustration Container */}
              <div className="relative bg-gradient-to-br from-white/90 to-hc-soft/50 backdrop-blur-sm rounded-[2.5rem] p-12 shadow-2xl border border-hc-soft/50">
                {/* Simple Yoga Pose Illustration */}
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-8xl filter drop-shadow-lg">🧘‍♀️</div>
                </div>
                
                {/* Healing Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-hc-tertiary to-hc-success rounded-full animate-bounce shadow-lg"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-hc-secondary to-hc-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-6 w-4 h-4 bg-gradient-to-br from-hc-accent to-hc-warm rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
