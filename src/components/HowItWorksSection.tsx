
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: "🤝",
    title: "Connect",
    description: "Browse verified mentors and find someone who resonates with your healing goals and preferred wellness practices."
  },
  {
    icon: "🌱",
    title: "Explore",
    description: "Access personalized sessions, guided meditations, yoga routines, and music therapy tailored to your unique journey."
  },
  {
    icon: "✨",
    title: "Grow",
    description: "Track your progress, celebrate milestones, and build lasting wellness habits with continuous mentor support."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            How <span className="hc-primary">HealConnect</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your healing journey made simple with three thoughtful steps designed around your needs and comfort.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative p-8 rounded-2xl shadow-md hover-lift bg-white border-0 transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0 text-center space-y-6">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 w-8 h-8 bg-hc-tertiary rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto bg-hc-surface rounded-2xl flex items-center justify-center text-4xl mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-inter font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Flow Illustration */}
        <div className="mt-16 flex justify-center items-center space-x-4 fade-in">
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-12 h-12 bg-hc-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="w-16 h-1 bg-hc-primary/30 rounded-full"></div>
            <div className="w-12 h-12 bg-hc-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <div className="w-16 h-1 bg-hc-secondary/30 rounded-full"></div>
            <div className="w-12 h-12 bg-hc-tertiary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
