import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-hc-secondary via-hc-surface to-hc-soft overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-hc-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-hc-tertiary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-hc-secondary/15 to-hc-primary/15 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 slide-up">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-hc-primary font-semibold text-sm mb-6 shadow-lg">
            ✨ Special Launch Offer - Limited Time
          </div>
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-inter font-bold text-white mb-6 leading-tight">
            Start Your <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Healing Journey</span>
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that feels right for you. Cancel anytime, no questions asked.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-16">
          {/* Free Trial Card - Enhanced */}
          <Card className="relative rounded-3xl shadow-2xl bg-gradient-to-br from-white via-white to-gray-50/50 border-0 hover-lift transition-all duration-500 hover:scale-105 overflow-hidden group">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-hc-tertiary/10 via-transparent to-hc-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardContent className="p-10 relative z-10">
              <Badge className="absolute -top-4 left-8 bg-gradient-to-r from-hc-tertiary to-hc-secondary text-white font-bold px-4 py-2 text-sm shadow-lg">
                🔥 Most Popular
              </Badge>
              
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-2xl flex items-center justify-center text-4xl text-white shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                  🌱
                </div>
                <h3 className="text-3xl font-inter font-bold text-gray-900 mb-4">
                  Free 14-Day Trial
                </h3>
                <div className="flex items-baseline justify-center mb-3">
                  <span className="text-6xl font-black text-hc-primary">₹0</span>
                </div>
                <p className="text-lg text-gray-600 font-medium">Perfect for exploring your journey</p>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">Access to 3 expert mentors</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">50+ guided healing sessions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">Basic consultant library</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">Community support access</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">No credit card required</span>
                </div>
              </div>

              <Button className="w-full h-16 bg-gradient-to-r from-hc-tertiary to-hc-secondary hover:from-hc-secondary hover:to-hc-tertiary text-white font-bold py-4 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                🚀 Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Premium Full Access Card - Enhanced */}
          <Card className="relative rounded-3xl shadow-2xl bg-gradient-to-br from-hc-primary via-hc-primary to-hc-secondary border-0 hover-lift transition-all duration-500 hover:scale-105 overflow-hidden group">
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-2 -right-2 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors duration-500"></div>
            
            <CardContent className="p-10 relative z-10">
              <Badge className="absolute -top-4 right-8 bg-gradient-to-r from-hc-accent to-hc-primary text-white font-bold px-4 py-2 text-sm shadow-lg animate-pulse">
                💎 Premium
              </Badge>
              
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-white to-white/80 rounded-2xl flex items-center justify-center text-4xl shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                  ✨
                </div>
                <h3 className="text-3xl font-inter font-bold text-white mb-4">
                  Full Access
                </h3>
                <div className="flex items-baseline justify-center mb-3">
                  <span className="text-6xl font-black text-white">₹1,000</span>
                  <span className="text-2xl font-medium text-white/80 ml-2">/month</span>
                </div>
                <p className="text-lg text-white/90 font-medium">Complete healing transformation</p>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">Unlimited mentor connections</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">1000+ premium sessions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">Personal progress tracking</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">1-on-1 video sessions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">Priority support</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-hc-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white font-medium text-lg">Weekly new content</span>
                </div>
              </div>

              <Button className="w-full h-16 bg-white hover:bg-gray-50 text-hc-primary font-bold py-4 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                💎 Choose Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Guarantee & Trust Signals */}
        <div className="text-center space-y-8 fade-in">
          <div className="inline-flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-br from-hc-tertiary to-hc-secondary rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-xl mb-1">30-Day Money-Back Guarantee</div>
              <div className="text-gray-600 font-medium">Try risk-free. If you're not completely satisfied, we'll refund every penny.</div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl mb-3">⚡</div>
              <div className="font-bold text-gray-900 mb-2">Instant Access</div>
              <div className="text-gray-600 text-sm">Start your journey immediately after signup</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl mb-3">🔒</div>
              <div className="font-bold text-gray-900 mb-2">Secure & Private</div>
              <div className="text-gray-600 text-sm">Your data is protected with enterprise-grade security</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl mb-3">📱</div>
              <div className="font-bold text-gray-900 mb-2">Mobile Friendly</div>
              <div className="text-gray-600 text-sm">Access your healing tools anywhere, anytime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;