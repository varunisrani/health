import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

const ConsultantLibrarySection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const handleExploreSection = (category: string) => {
    if (isAuthenticated) {
      // For meditation, redirect to therapists page; for yoga routines and music therapy, redirect to Healing Mate dashboard
      if (category.toLowerCase().includes('meditation')) {
        navigate('/dashboard'); // Navigate to dashboard which contains therapists
      } else if (category.toLowerCase().includes('yoga') || category.toLowerCase().includes('music')) {
        // Navigate to dashboard and set active tab to healing-mate
        navigate('/dashboard', { state: { activeTab: 'healing-mate' } });
      } else {
        navigate('/library', { state: { category: category.toLowerCase() } });
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleStartItem = (category: string, item: { title: string; duration: string; level: string }) => {
    if (isAuthenticated) {
      // Navigate to the specific item or library category
      navigate('/library', { state: { category: category.toLowerCase(), item: item.title } });
    } else {
      setShowAuthModal(true);
    }
  };
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Your <span className="hc-primary">Consultant Library</span>
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
                        <button 
                          className={`text-sm ${section.accentColor} hover:underline font-medium`}
                          onClick={() => handleStartItem(section.category, item)}
                        >
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="w-full mt-6 bg-white border-2 border-hc-primary text-hc-primary hover:bg-hc-primary hover:text-white font-medium py-3 rounded-xl transition-all duration-300"
                  onClick={() => handleExploreSection(section.category)}
                >
                  Explore All {section.category === 'Meditations' ? 'Meditation' : section.category}
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
                Get unlimited access to our complete consultant library with 1000+ guided sessions, exclusive content, and new releases added weekly.
              </p>
              <button 
                className="bg-hc-primary hover:bg-hc-primary/90 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-md"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/dashboard');
                  } else {
                    setShowAuthModal(true);
                  }
                }}
              >
                Start Free Trial
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConsultantLibrarySection;
