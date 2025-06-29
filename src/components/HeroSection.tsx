
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
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-white via-slate-50/30 to-hc-soft/10 overflow-hidden">
      {/* Background Pattern - healing gradient overlay */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,107,140,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(232,184,109,0.15),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-hc-primary to-hc-secondary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">H</span>
              </div>
              <span className="text-xl sm:text-2xl font-inter font-semibold text-hc-primary">
                HealConnect
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-semibold text-slate-900 leading-tight">
                Guided Support for Your{" "}
                <span className="bg-gradient-to-r from-hc-primary to-hc-secondary bg-clip-text text-transparent">Healing Journey</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-800 leading-relaxed max-w-xl font-medium">
                Healing is a shared journey—let's take the first step together. 
                Connect with trusted wellness mentors for personalized yoga, meditation, and music therapy sessions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 relative z-20">
              <Button 
                onClick={handleStartTrial}
                variant="hc-primary"
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
              >
                Start Your 14-Day Free Journey
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleBrowseMentors}
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 border-hc-primary text-hc-primary hover:bg-hc-soft hover:border-hc-secondary transition-all duration-300 w-full sm:w-auto"
              >
                Browse Mentors →
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium text-center sm:text-left">
              Cancel anytime · No hidden fees
            </p>
          </div>

          {/* Right Illustration */}
          <div className="relative lg:pl-8 xl:pl-12 fade-in order-first lg:order-last">
            <div className="relative">
              {/* Healing Gradient Blob Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-hc-primary/15 via-hc-secondary/15 to-hc-accent/15 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] transform rotate-2 lg:rotate-3 scale-105 lg:scale-110 shadow-lg"></div>
              
              {/* Illustration Container */}
              <div className="relative bg-gradient-to-br from-white/90 to-hc-soft/50 backdrop-blur-sm rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-xl lg:shadow-2xl border border-hc-soft/50">
                {/* Simple Yoga Pose Illustration */}
                <div className="w-full h-48 sm:h-64 lg:h-80 flex items-center justify-center">
                  <div className="text-5xl sm:text-6xl lg:text-8xl filter drop-shadow-lg">🧘‍♀️</div>
                </div>
                
                {/* Healing Floating Elements */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-hc-tertiary to-hc-success rounded-full animate-bounce shadow-lg"></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 lg:-bottom-4 lg:-left-4 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-hc-secondary to-hc-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-3 sm:-left-4 lg:-left-6 w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-gradient-to-br from-hc-accent to-hc-warm rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
