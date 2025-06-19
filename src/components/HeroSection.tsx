
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hc-surface px-6 py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-hc-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-inter font-semibold hc-primary">HealConnect</span>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-inter font-semibold text-gray-900 leading-tight">
                Guided Support for Your{" "}
                <span className="hc-primary">Healing Journey</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Connect with trusted wellness mentors who understand your path. Experience personalized yoga, meditation, and music therapy in a supportive community designed for authentic healing and growth.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-hc-accent hover:bg-hc-accent/90 text-white px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Start Free 14-Day Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-hc-primary hc-primary hover:bg-hc-primary hover:text-white px-8 py-4 text-lg rounded-2xl transition-all duration-300"
              >
                Browse Mentors
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-gray-900">500+ Mentors</div>
                <div>Verified Experts</div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-gray-900">10,000+</div>
                <div>Healing Journeys</div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-gray-900">4.9/5</div>
                <div>Community Rating</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center items-center">
            <Card className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl hover-lift">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-hc-primary/20 via-hc-secondary/30 to-hc-tertiary/20"></div>
              
              {/* Yoga Pose Illustration - Using a placeholder for now */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center space-y-2">
                    <div className="w-24 h-24 mx-auto bg-hc-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🧘‍♀️</span>
                    </div>
                    <div className="text-hc-primary font-medium">Find Your Peace</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-hc-secondary/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute bottom-12 right-8 w-12 h-12 bg-hc-tertiary/40 rounded-full blur-sm animate-pulse delay-300"></div>
              <div className="absolute top-1/2 right-4 w-8 h-8 bg-hc-accent/30 rounded-full blur-sm animate-pulse delay-700"></div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Chat CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-hc-primary hover:bg-hc-primary/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <span className="mr-2">💬</span>
          Quick Support
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
