
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Jessica M.",
    role: "Working Mother",
    content: "Mended Minds helped me find balance during the most stressful period of my life. Sarah's yoga sessions became my daily anchor, and the community support was incredible.",
    rating: 5,
    avatar: "👩‍💼"
  },
  {
    name: "Alex T.",
    role: "College Student",
    content: "The meditation library got me through finals week and beyond. Marcus's music therapy sessions are pure magic for anxiety relief. This platform changed my life.",
    rating: 5,
    avatar: "👨‍🎓"
  },
  {
    name: "Maya R.",
    role: "Entrepreneur",
    content: "After trying countless consultant apps, Mended Minds is the first that felt truly personal. Priya understands my journey and provides exactly the support I need.",
    rating: 5,
    avatar: "👩‍💻"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl lg:text-5xl font-inter font-semibold text-gray-900 mb-6">
            Stories of <span className="hc-primary">Transformation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real healing journeys from our community members who found their path to consultant with Mended Minds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="rounded-2xl shadow-md hover-lift bg-hc-surface/50 border-0 transition-all duration-300 hover:shadow-xl relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Mark */}
                <div className="text-6xl hc-secondary/30 font-serif leading-none mb-4">"</div>
                
                {/* Testimonial Content */}
                <blockquote className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  {testimonial.content}
                </blockquote>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {"★".repeat(testimonial.rating)}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 text-center fade-in">
          <div className="inline-flex items-center justify-center space-x-12 bg-white rounded-2xl px-8 py-6 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold hc-primary">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold hc-primary">10,000+</div>
              <div className="text-sm text-gray-600">Happy Members</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold hc-primary">50,000+</div>
              <div className="text-sm text-gray-600">Sessions Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
