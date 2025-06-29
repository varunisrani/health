
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
    <section className="relative min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgb(248, 246, 241) 0%, rgba(220, 199, 182, 0.3) 50%, rgba(191, 174, 160, 0.1) 100%)'
    }}>
      {/* Enhanced Background Pattern - Fixed Colors */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(123, 84, 84, 0.15) 0%, transparent 60%)'
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 70% 60%, rgba(220, 199, 182, 0.2) 0%, transparent 50%)'
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 80%, rgba(191, 174, 160, 0.1) 0%, transparent 40%)'
        }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-hc-primary to-hc-secondary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">M</span>
              </div>
              <span className="text-xl sm:text-2xl font-inter font-semibold text-hc-primary">
                Mended Minds
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-inter font-bold text-slate-900 leading-[1.1] tracking-tight">
                <span className="block mb-2 sm:mb-3 bg-gradient-to-r from-hc-primary via-hc-primary to-hc-secondary bg-clip-text text-transparent">
                  Mental wellness
                </span>
                <span className="block text-slate-800 font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3">
                  is a journey.
                </span>
                <span className="block text-hc-primary font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-3 sm:mt-4">
                  We're here every step of the way
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed max-w-2xl font-medium">
                Healing is a shared journey—let's take the first step together. 
                Connect with trusted consultant mentors for personalized yoga, meditation, and music therapy sessions.
              </p>
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-6 relative z-20">
              <Button 
                onClick={handleStartTrial}
                variant="hc-primary"
                size="lg"
                className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-full sm:w-auto bg-gradient-to-r from-hc-primary to-hc-secondary text-white border-0"
                style={{
                  background: 'linear-gradient(to right, rgb(123, 84, 84), rgb(220, 199, 182))',
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgba(123, 84, 84, 0.9), rgba(220, 199, 182, 0.9))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(123, 84, 84), rgb(220, 199, 182))';
                }}
              >
                Start Your 14-Day Free Journey
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleBrowseMentors}
                className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-2xl border-2 border-hc-primary text-hc-primary hover:bg-gradient-to-r hover:from-hc-primary hover:to-hc-secondary hover:text-white hover:border-transparent transition-all duration-500 hover:-translate-y-1 hover:scale-105 w-full sm:w-auto shadow-lg hover:shadow-2xl bg-white focus:bg-hc-primary focus:text-white"
                style={{
                  backgroundColor: 'rgb(248, 246, 241)',
                  borderColor: 'rgb(123, 84, 84)',
                  color: 'rgb(123, 84, 84)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(123, 84, 84), rgb(220, 199, 182))';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgb(248, 246, 241)';
                  e.currentTarget.style.color = 'rgb(123, 84, 84)';
                  e.currentTarget.style.borderColor = 'rgb(123, 84, 84)';
                }}
              >
                Browse Mentors →
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium text-center sm:text-left">
              Cancel anytime · No hidden fees
            </p>
          </div>

          {/* Right Illustration - Enhanced */}
          <div className="relative lg:pl-8 xl:pl-12 fade-in order-first lg:order-last">
            <div className="relative">
              {/* Multiple Gradient Backgrounds for Depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-hc-primary/20 via-hc-secondary/20 to-hc-tertiary/15 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] transform rotate-1 lg:rotate-2 scale-105 lg:scale-110 shadow-2xl opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-hc-secondary/15 via-hc-tertiary/20 to-hc-primary/10 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] transform -rotate-1 lg:-rotate-1 scale-102 lg:scale-105 shadow-xl opacity-40"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-white/95 to-hc-soft/60 backdrop-blur-sm rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-hc-soft/30 overflow-hidden">
                {/* Wellness Journey Image */}
                <div className="relative w-full h-56 sm:h-72 lg:h-96 overflow-hidden rounded-xl sm:rounded-2xl">
                  <img 
                    src="https://i.ibb.co/9DHKmVQ/photo-2025-06-29-10-03-28.jpg" 
                    alt="Mental wellness journey - peaceful meditation and healing" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 filter brightness-105 contrast-105"
                  />
                  {/* Subtle overlay for better text contrast if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-hc-primary/5 via-transparent to-transparent"></div>
                </div>
                
                {/* Enhanced Floating Elements with Better Positioning */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-6 lg:-right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full animate-bounce shadow-2xl border-2 border-white/50 backdrop-blur-sm"></div>
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-6 lg:-left-6 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-hc-secondary to-hc-primary rounded-full animate-bounce shadow-2xl border-2 border-white/50" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/3 -left-4 sm:-left-5 lg:-left-7 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-hc-primary to-hc-tertiary rounded-full animate-bounce shadow-xl border-2 border-white/50" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 -right-4 sm:-right-5 lg:-right-7 w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 bg-gradient-to-br from-hc-tertiary via-hc-secondary to-hc-primary rounded-full animate-bounce shadow-xl border-2 border-white/50" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
