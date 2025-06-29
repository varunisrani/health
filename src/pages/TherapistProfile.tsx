import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingDialog } from '@/components/BookingDialog';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Heart, 
  MessageCircle, 
  Calendar,
  ChevronLeft,
  CheckCircle,
  Users,
  PlayCircle,
  BookOpen,
  Globe
} from 'lucide-react';

// Mock therapist data with detailed profiles
const therapistProfiles = {
  '1': {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Therapist & Yoga Instructor',
    specialties: ['Yoga', 'Meditation', 'Anxiety Management', 'Stress Relief'],
    rating: 4.9,
    totalReviews: 127,
    experience: '8 years',
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish'],
    avatar: '',
    verified: true,
    about: 'Dr. Sarah Johnson is a licensed clinical therapist with over 8 years of experience in helping individuals find their path to mental wellness through yoga and meditation. She specializes in anxiety management and stress relief techniques, combining traditional therapeutic approaches with mindfulness practices.',
    education: [
      'Ph.D. in Clinical Psychology - Stanford University',
      'Certified Yoga Instructor (RYT-500)',
      'Mindfulness-Based Stress Reduction Certification'
    ],
    approach: 'I believe in a holistic approach to mental health, integrating evidence-based therapeutic techniques with mindfulness practices. My goal is to empower you with tools that you can use both in our sessions and in your daily life.',
    sessionTypes: [
      { type: 'Individual Therapy', duration: '50 min', price: '₹2,500' },
      { type: 'Yoga Session', duration: '60 min', price: '₹1,800' },
      { type: 'Group Meditation', duration: '45 min', price: '₹1,200' },
      { type: 'Consultation', duration: '30 min', price: '₹1,500' }
    ],
    availability: {
      monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      tuesday: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
      wednesday: ['9:00 AM', '11:00 AM', '2:00 PM'],
      thursday: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
      friday: ['9:00 AM', '11:00 AM', '1:00 PM'],
      saturday: ['10:00 AM', '2:00 PM'],
      sunday: ['Not Available']
    },
    stats: {
      totalSessions: 1250,
      clientsHelped: 89,
      responseTime: '< 2 hours',
      completionRate: '98%'
    }
  },
  '2': {
    id: '2',
    name: 'Michael Chen',
    title: 'Music Therapist & Meditation Guide',
    specialties: ['Music Therapy', 'Meditation', 'Sound Healing', 'PTSD Recovery'],
    rating: 4.8,
    totalReviews: 94,
    experience: '6 years',
    location: 'Los Angeles, CA',
    languages: ['English', 'Mandarin'],
    avatar: '',
    verified: true,
    about: 'Michael Chen is a certified music therapist who uses the power of sound and rhythm to facilitate healing and personal growth. He specializes in working with individuals dealing with trauma, PTSD, and emotional regulation challenges.',
    education: [
      'Master\'s in Music Therapy - Berklee College of Music',
      'Certification in Sound Healing',
      'Trauma-Informed Care Training'
    ],
    approach: 'Music has the unique ability to reach parts of ourselves that words cannot. I use evidence-based music therapy techniques combined with meditation to help clients process emotions, reduce stress, and find their inner voice.',
    sessionTypes: [
      { type: 'Music Therapy', duration: '60 min', price: '₹2,200' },
      { type: 'Sound Healing', duration: '45 min', price: '₹1,800' },
      { type: 'Group Sound Bath', duration: '75 min', price: '₹1,500' },
      { type: 'Meditation Session', duration: '30 min', price: '₹1,200' }
    ],
    availability: {
      monday: ['10:00 AM', '1:00 PM', '4:00 PM'],
      tuesday: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
      wednesday: ['11:00 AM', '2:00 PM', '5:00 PM'],
      thursday: ['9:00 AM', '1:00 PM', '4:00 PM'],
      friday: ['10:00 AM', '2:00 PM', '5:00 PM'],
      saturday: ['9:00 AM', '12:00 PM', '3:00 PM'],
      sunday: ['Not Available']
    },
    stats: {
      totalSessions: 890,
      clientsHelped: 67,
      responseTime: '< 3 hours',
      completionRate: '96%'
    }
  },
  '3': {
    id: '3',
    name: 'Dr. Priya Sharma',
    title: 'Mindfulness Expert & Yoga Therapist',
    specialties: ['Yoga', 'Mindfulness', 'Depression Support', 'Life Coaching'],
    rating: 4.9,
    totalReviews: 156,
    experience: '10 years',
    location: 'Mumbai, India',
    languages: ['English', 'Hindi', 'Sanskrit'],
    avatar: '',
    verified: true,
    about: 'Dr. Priya Sharma brings over a decade of experience in yoga therapy and mindfulness-based interventions. She has helped hundreds of individuals overcome depression, anxiety, and life transitions through ancient wisdom and modern therapeutic techniques.',
    education: [
      'Ph.D. in Psychology - University of Mumbai',
      'Advanced Yoga Therapist Certification',
      'Mindfulness-Based Cognitive Therapy (MBCT) Training'
    ],
    approach: 'I integrate the wisdom of yoga and meditation with evidence-based psychological interventions. My approach is gentle yet transformative, helping you develop sustainable practices for long-term mental health and spiritual growth.',
    sessionTypes: [
      { type: 'Yoga Therapy', duration: '75 min', price: '₹2,800' },
      { type: 'Mindfulness Training', duration: '50 min', price: '₹2,200' },
      { type: 'Life Coaching', duration: '60 min', price: '₹2,500' },
      { type: 'Meditation Intensive', duration: '90 min', price: '₹3,200' }
    ],
    availability: {
      monday: ['7:00 AM', '10:00 AM', '2:00 PM', '6:00 PM'],
      tuesday: ['8:00 AM', '11:00 AM', '3:00 PM', '7:00 PM'],
      wednesday: ['7:00 AM', '12:00 PM', '4:00 PM'],
      thursday: ['8:00 AM', '10:00 AM', '2:00 PM', '6:00 PM'],
      friday: ['7:00 AM', '11:00 AM', '3:00 PM'],
      saturday: ['9:00 AM', '1:00 PM', '5:00 PM'],
      sunday: ['8:00 AM', '12:00 PM']
    },
    stats: {
      totalSessions: 1680,
      clientsHelped: 124,
      responseTime: '< 1 hour',
      completionRate: '99%'
    }
  }
};

// Mock reviews data
const getReviewsForTherapist = (therapistId: string) => {
  const reviews = {
    '1': [
      {
        id: 1,
        name: 'Emma R.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Dr. Johnson helped me overcome my anxiety through her unique combination of therapy and yoga. Her approach is so calming and effective.',
        verified: true
      },
      {
        id: 2,
        name: 'David M.',
        rating: 5,
        date: '1 month ago',
        comment: 'Amazing therapist! The meditation techniques she taught me have completely changed my stress management. Highly recommend!',
        verified: true
      },
      {
        id: 3,
        name: 'Lisa K.',
        rating: 4,
        date: '2 months ago',
        comment: 'Very professional and caring. The yoga sessions are exactly what I needed for my mental health journey.',
        verified: true
      }
    ],
    '2': [
      {
        id: 1,
        name: 'Alex T.',
        rating: 5,
        date: '1 week ago',
        comment: 'Michael\'s music therapy sessions are incredible. The sound healing helped me process trauma in a way I never thought possible.',
        verified: true
      },
      {
        id: 2,
        name: 'Sarah L.',
        rating: 5,
        date: '3 weeks ago',
        comment: 'The combination of music and meditation is so powerful. Michael creates such a safe and healing space.',
        verified: true
      }
    ],
    '3': [
      {
        id: 1,
        name: 'Ravi P.',
        rating: 5,
        date: '5 days ago',
        comment: 'Dr. Sharma\'s mindfulness approach transformed my perspective on life. Her sessions are deeply healing and insightful.',
        verified: true
      },
      {
        id: 2,
        name: 'Jennifer W.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The yoga therapy sessions helped me through a difficult period. Dr. Sharma\'s wisdom and compassion are unmatched.',
        verified: true
      }
    ]
  };
  return reviews[therapistId as keyof typeof reviews] || [];
};

const TherapistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const therapist = therapistProfiles[id as keyof typeof therapistProfiles];
  const reviews = getReviewsForTherapist(id || '');

  if (!therapist) {
    return (
      <div className="min-h-screen bg-hc-surface p-6">
        <div className="container mx-auto max-w-4xl">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="ghost" 
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Therapist Not Found</h2>
              <p className="text-gray-600">The therapist profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hc-surface">
      {/* Header */}
      <div className="bg-white border-b border-hc-soft">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="ghost" 
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Therapist Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-32 w-32 border-4 border-hc-soft">
                  <AvatarImage src={therapist.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white text-3xl font-bold">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{therapist.name}</h1>
                        {therapist.verified && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                      <p className="text-xl text-hc-primary font-medium mb-3">{therapist.title}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-bold text-gray-900">{therapist.rating}</span>
                          <span className="text-gray-600">({therapist.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>{therapist.experience}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {therapist.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{therapist.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>{therapist.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-1">₹1,200</div>
                    <div className="text-white/90">Starting from</div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowBookingDialog(true)}
                      className="w-full bg-white text-hc-primary hover:bg-gray-50 font-semibold"
                      size="lg"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-white hover:bg-white/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="font-bold text-lg">{therapist.stats.totalSessions}</div>
                        <div className="text-xs text-white/80">Sessions</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg">{therapist.stats.clientsHelped}</div>
                        <div className="text-xs text-white/80">Clients</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-hc-accent" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-6">{therapist.about}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">My Approach</h4>
                      <p className="text-gray-700 leading-relaxed">{therapist.approach}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Education & Certifications</h4>
                      <ul className="space-y-2">
                        {therapist.education.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">{therapist.stats.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium">{therapist.stats.completionRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sessions</span>
                        <span className="font-medium">{therapist.stats.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clients Helped</span>
                        <span className="font-medium">{therapist.stats.clientsHelped}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Available Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {therapist.sessionTypes.map((session, index) => (
                    <div key={index} className="p-4 border border-hc-soft rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{session.type}</h4>
                        <Badge variant="outline">{session.price}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                      <Button 
                        className="w-full mt-3" 
                        variant="outline"
                        onClick={() => setShowBookingDialog(true)}
                      >
                        Book This Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Client Reviews</span>
                  <Badge>{therapist.totalReviews} reviews</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-hc-soft last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(therapist.availability).map(([day, times]) => (
                    <div key={day} className="flex items-center justify-between p-4 border border-hc-soft rounded-lg">
                      <div className="font-medium text-gray-900 capitalize">{day}</div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(times) ? times.map((time, index) => (
                          <Badge key={index} variant="outline">{time}</Badge>
                        )) : (
                          <span className="text-gray-500">{times}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        therapist={therapist}
      />
    </div>
  );
};

export default TherapistProfile;