
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mentors = [
  {
    name: "Sarah Chen",
    avatar: "👩‍🦳",
    expertise: ["Yoga", "Meditation", "Mindfulness"],
    rating: 4.9,
    sessions: 250,
    bio: "Certified yoga instructor with 10+ years helping people find inner peace."
  },
  {
    name: "Marcus Williams",
    avatar: "👨‍🦱",
    expertise: ["Music Therapy", "Sound Healing"],
    rating: 5.0,
    sessions: 180,
    bio: "Professional music therapist specializing in stress reduction and emotional healing."
  },
  {
    name: "Priya Patel",
    avatar: "👩‍🦰",
    expertise: ["Meditation", "Breathwork", "Trauma Support"],
    rating: 4.8,
    sessions: 320,
    bio: "Licensed therapist combining traditional meditation with modern wellness techniques."
  },
  {
    name: "David Kim",
    avatar: "👨‍💼",
    expertise: ["Life Coaching", "Stress Management"],
    rating: 4.9,
    sessions: 150,
    bio: "Executive coach helping professionals achieve work-life balance and mental clarity."
  },
  {
    name: "Elena Rodriguez",
    avatar: "👩‍🌾",
    expertise: ["Nature Therapy", "Mindful Walking"],
    rating: 5.0,
    sessions: 200,
    bio: "Outdoor wellness expert connecting healing with natural environments."
  }
];

const MentorSpotlightSection = () => {
  return (
    <section className="py-20 px-6 bg-hc-surface">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Meet Your <span className="hc-primary">Wellness Mentors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with certified experts who understand your journey and are committed to your healing and growth.
          </p>
        </div>

        {/* Horizontal Scrollable Mentor Cards */}
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 min-w-max px-4">
            {mentors.map((mentor, index) => (
              <Card 
                key={index}
                className="flex-shrink-0 w-80 rounded-2xl shadow-md hover-lift bg-white border-0 transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  {/* Mentor Avatar & Name */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-hc-surface rounded-2xl flex items-center justify-center text-3xl">
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-inter font-semibold text-gray-900">
                        {mentor.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex text-yellow-400">
                          {"★".repeat(5)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {mentor.rating} ({mentor.sessions} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex}
                        className="bg-hc-tertiary/30 text-gray-700 hover:bg-hc-tertiary/40 rounded-full px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {mentor.bio}
                  </p>

                  {/* CTA */}
                  <button className="w-full bg-hc-primary hover:bg-hc-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:shadow-md">
                    View Profile
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Mentors CTA */}
        <div className="text-center mt-12 fade-in">
          <button className="bg-white border-2 border-hc-primary hc-primary hover:bg-hc-primary hover:text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-md">
            View All 500+ Mentors
          </button>
        </div>
      </div>
    </section>
  );
};

export default MentorSpotlightSection;
