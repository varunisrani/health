
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  return (
    <section className="py-20 px-6 bg-hc-surface">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Start Your <span className="hc-primary">Healing Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that feels right for you. Cancel anytime, no questions asked.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Trial Card */}
          <Card className="rounded-2xl shadow-lg bg-hc-tertiary/20 border-2 border-hc-tertiary hover-lift transition-all duration-300">
            <CardContent className="p-8 relative">
              <Badge className="absolute -top-3 left-8 bg-hc-tertiary text-gray-700 font-medium">
                Most Popular
              </Badge>
              
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-inter font-semibold text-gray-900 mb-2">
                  Free 14-Day Trial
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₹0
                </div>
                <p className="text-gray-600">Perfect for exploring</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Access to 3 mentors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">50+ guided sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Basic wellness library</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Community forum access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">No credit card required</span>
                </div>
              </div>

              <Button className="w-full bg-hc-tertiary hover:bg-hc-tertiary/90 text-gray-900 font-medium py-4 rounded-2xl text-lg">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Full Access Card */}
          <Card className="rounded-2xl shadow-lg bg-white border-2 border-gray-200 hover-lift transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-inter font-semibold text-gray-900 mb-2">
                  Full Access
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₹3,000
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Complete healing support</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Unlimited mentor connections</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">1000+ premium sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Personal progress tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">1-on-1 video sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-hc-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Weekly new content</span>
                </div>
              </div>

              <Button className="w-full bg-hc-primary hover:bg-hc-primary/90 text-white font-medium py-4 rounded-2xl text-lg">
                Choose Full Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12 fade-in">
          <div className="inline-flex items-center space-x-3 bg-white rounded-2xl px-6 py-4 shadow-md">
            <span className="text-2xl">🛡️</span>
            <div className="text-left">
              <div className="font-semibold text-gray-900">30-Day Money-Back Guarantee</div>
              <div className="text-sm text-gray-600">Try risk-free. If you're not completely satisfied, we'll refund every penny.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
