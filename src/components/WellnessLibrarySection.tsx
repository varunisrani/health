import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const libraryItems = [
  {
    category: "Meditations",
    icon: "🧘‍♀️",
    items: [
      { title: "Morning Mindfulness", duration: "10 min", level: "Beginner" },
      { title: "Sleep Stories", duration: "20 min", level: "All Levels" },
      { title: "Anxiety Relief", duration: "15 min", level: "Intermediate" }
    ],
    bgColor: "bg-hc-primary/10",
    accentColor: "hc-primary",
    borderColor: "border-hc-primary"
  },
  {
    category: "Yoga Routines",
    icon: "🕉️",
    items: [
      { title: "Gentle Flow", duration: "30 min", level: "Beginner" },
      { title: "Power Vinyasa", duration: "45 min", level: "Advanced" },
      { title: "Restorative Yoga", duration: "25 min", level: "All Levels" }
    ],
    bgColor: "bg-hc-secondary/10",
    accentColor: "hc-secondary",
    borderColor: "border-hc-secondary"
  },
  {
    category: "Music Therapy",
    icon: "🎵",
    items: [
      { title: "Healing Frequencies", duration: "40 min", level: "All Levels" },
      { title: "Nature Sounds", duration: "60 min", level: "All Levels" },
      { title: "Binaural Beats", duration: "30 min", level: "Intermediate" }
    ],
    bgColor: "bg-hc-tertiary/10",
    accentColor: "hc-tertiary",
    borderColor: "border-hc-tertiary"
  }
];

const WellnessLibrarySection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Your <span className="hc-primary">Wellness Library</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access a curated collection of guided practices designed to support every aspect of your healing journey.
          </p>
        </div>

        {/* Masonry Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {libraryItems.map((section, sectionIndex) => (
            <Card 
              key={sectionIndex}
              className={`rounded-2xl shadow-md hover-lift border-0 transition-all duration-300 hover:shadow-xl ${section.bgColor}`}
              style={{ animationDelay: `${sectionIndex * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-3xl">{section.icon}</div>
                  <h3 className="text-xl font-inter font-semibold text-gray-900">
                    {section.category}
                  </h3>
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white/80 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.duration}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.level}</span>
                        <button className={`text-sm ${section.accentColor} hover:underline font-medium`}>
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={`w-full mt-6 bg-white ${section.borderColor} border-2 ${section.accentColor} hover:bg-hc-primary hover:text-white font-medium py-3 rounded-xl transition-all duration-300`}>
                  Explore All {section.category}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Library Access */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto rounded-2xl shadow-lg bg-gradient-to-r from-hc-primary/5 to-hc-secondary/5 border-0">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-inter font-semibold text-gray-900 mb-4">
                Unlock Premium Library Access
              </h3>
              <p className="text-gray-600 mb-6">
                Get unlimited access to our complete wellness library with 1000+ guided sessions, exclusive content, and new releases added weekly.
              </p>
              <button className="bg-hc-accent hover:bg-hc-accent/90 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-md">
                Start Free Trial
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WellnessLibrarySection;
