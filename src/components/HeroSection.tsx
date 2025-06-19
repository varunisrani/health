
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleStartTrial = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleBrowseMentors = () => {
    if (isAuthenticated) {
      navigate('/dashboard#therapists');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-hc-surface to-white overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-hc-primary rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-inter font-semibold text-gray-900">
                HealConnect
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-inter font-semibold text-gray-900 leading-tight">
                Guided Support for Your{" "}
                <span className="hc-primary">Healing Journey</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Healing is a shared journey—let's take the first step together. 
                Connect with trusted wellness mentors for personalized yoga, meditation, and music therapy sessions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleStartTrial}
                className="bg-hc-accent hover:bg-hc-accent/90 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover-lift"
              >
                Start Your 14-Day Free Journey
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleBrowseMentors}
                className="text-hc-primary hover:text-hc-primary/80 px-8 py-6 text-lg"
              >
                Browse Mentors →
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-sm text-gray-500 max-w-md">
              Cancel anytime · No hidden fees
            </p>
          </div>

          {/* Right Illustration */}
          <div className="relative lg:pl-12 fade-in">
            <div className="relative">
              {/* Gradient Blob Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-hc-primary/20 via-hc-secondary/20 to-hc-tertiary/20 rounded-[3rem] transform rotate-3 scale-110"></div>
              
              {/* Illustration Container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-12 shadow-2xl">
                {/* Simple Yoga Pose Illustration */}
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-8xl filter drop-shadow-lg">🧘‍♀️</div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-hc-tertiary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-hc-secondary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-6 w-4 h-4 bg-hc-accent rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,157,161,0.1),transparent_50%)]"></div>
      </div>
    </section>
  );
};

export default HeroSection;
