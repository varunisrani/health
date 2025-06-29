import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users,
  Check,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { useSessions, SessionBookingData } from '@/hooks/useSessions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  avatar?: string;
  bio: string;
  experience: string;
  location: string;
  languages: string[];
  price: number;
  availability: {
    [key: string]: string[]; // date: time slots
  };
}

interface SessionBookingProps {
  children?: React.ReactNode;
  therapistId?: string;
  initialSessionType?: 'one-on-one' | 'webinar';
  onBookingComplete?: (sessionId: string) => void;
}

// Mock therapist data
const mockTherapists: Therapist[] = [
  {
    id: 'therapist-1',
    name: 'Dr. Sarah Chen',
    title: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Mindfulness', 'CBT'],
    rating: 4.9,
    reviewCount: 127,
    bio: 'Dr. Chen specializes in cognitive behavioral therapy and mindfulness-based interventions. With over 10 years of experience, she helps clients overcome anxiety, depression, and stress-related challenges.',
    experience: '10+ years',
    location: 'San Francisco, CA',
    languages: ['English', 'Mandarin'],
    price: 150,
    availability: {
      [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['09:00', '10:00', '14:00', '15:00'],
      [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: ['09:00', '11:00', '13:00', '16:00'],
      [format(addDays(new Date(), 3), 'yyyy-MM-dd')]: ['10:00', '14:00', '15:00'],
    }
  },
  {
    id: 'therapist-2',
    name: 'Dr. Michael Rodriguez',
    title: 'Licensed Marriage & Family Therapist',
    specialties: ['Relationships', 'Family Therapy', 'Trauma', 'EMDR'],
    rating: 4.8,
    reviewCount: 89,
    bio: 'Dr. Rodriguez focuses on relationship counseling and trauma therapy. He uses evidence-based approaches including EMDR and family systems therapy to help clients heal and build stronger connections.',
    experience: '8+ years',
    location: 'Los Angeles, CA',
    languages: ['English', 'Spanish'],
    price: 140,
    availability: {
      [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['11:00', '13:00', '15:00'],
      [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: ['09:00', '10:00', '14:00', '17:00'],
      [format(addDays(new Date(), 4), 'yyyy-MM-dd')]: ['09:00', '11:00', '16:00'],
    }
  },
  {
    id: 'therapist-3',
    name: 'Dr. Emma Thompson',
    title: 'Licensed Clinical Social Worker',
    specialties: ['Depression', 'Life Transitions', 'Women\'s Issues', 'Group Therapy'],
    rating: 4.9,
    reviewCount: 156,
    bio: 'Dr. Thompson specializes in helping individuals navigate life transitions and overcome depression. She offers both individual and group therapy sessions with a focus on empowerment and resilience building.',
    experience: '12+ years',
    location: 'New York, NY',
    languages: ['English'],
    price: 160,
    availability: {
      [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['08:00', '12:00', '16:00'],
      [format(addDays(new Date(), 3), 'yyyy-MM-dd')]: ['09:00', '13:00', '14:00', '17:00'],
      [format(addDays(new Date(), 5), 'yyyy-MM-dd')]: ['10:00', '11:00', '15:00'],
    }
  }
];

export const SessionBooking: React.FC<SessionBookingProps> = ({
  children,
  therapistId,
  initialSessionType = 'one-on-one',
  onBookingComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'therapist' | 'datetime' | 'details' | 'confirmation'>('therapist');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'one-on-one' | 'webinar'>(initialSessionType);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [duration, setDuration] = useState<number>(45);
  const [isBooking, setIsBooking] = useState(false);

  const { bookSession } = useSessions();

  // Initialize with specific therapist if provided
  useEffect(() => {
    if (therapistId) {
      const therapist = mockTherapists.find(t => t.id === therapistId);
      if (therapist) {
        setSelectedTherapist(therapist);
        setStep('datetime');
      }
    }
  }, [therapistId]);

  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setStep('datetime');
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setStep('details');
    }
  };

  const handleBookSession = async () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) return;

    setIsBooking(true);

    try {
      const scheduledTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduledTime.setHours(hours, minutes);

      const bookingData: SessionBookingData = {
        type: sessionType,
        title: sessionTitle || `${sessionType === 'one-on-one' ? 'Therapy Session' : 'Webinar'} with ${selectedTherapist.name}`,
        description: sessionDescription || `${sessionType === 'one-on-one' ? 'Individual therapy session' : 'Group webinar session'} focusing on your consultant goals.`,
        therapistId: selectedTherapist.id,
        therapistName: selectedTherapist.name,
        scheduledTime,
        duration,
        maxParticipants: sessionType === 'webinar' ? 50 : 1
      };

      const sessionId = await bookSession(bookingData);
      
      if (sessionId) {
        setStep('confirmation');
        toast.success('Session booked successfully!');
        
        if (onBookingComplete) {
          onBookingComplete(sessionId);
        }
      } else {
        toast.error('Failed to book session. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setStep('therapist');
    setSelectedTherapist(null);
    setSelectedDate(undefined);
    setSelectedTime('');
    setSessionTitle('');
    setSessionDescription('');
    setDuration(45);
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!selectedTherapist) return [];
    const dateKey = format(date, 'yyyy-MM-dd');
    return selectedTherapist.availability[dateKey] || [];
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedTherapist) return false;
    if (isBefore(date, startOfDay(new Date()))) return false;
    const dateKey = format(date, 'yyyy-MM-dd');
    return (selectedTherapist.availability[dateKey]?.length || 0) > 0;
  };

  const TherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => (
    <Card 
      className="cursor-pointer hover-lift transition-all duration-200 hover:border-hc-accent"
      onClick={() => handleTherapistSelect(therapist)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-hc-primary text-white text-lg">
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
                <p className="text-sm text-gray-600">{therapist.title}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{therapist.rating}</span>
                  <span className="text-xs text-gray-500">({therapist.reviewCount})</span>
                </div>
                <p className="text-sm font-semibold text-hc-primary">${therapist.price}/session</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{therapist.bio}</p>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {therapist.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {therapist.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{therapist.specialties.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>{therapist.experience}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{therapist.location}</span>
                </div>
              </div>
              <div className="text-hc-accent">
                Languages: {therapist.languages.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-hc-primary hover:bg-hc-primary/90 text-white">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Book Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Book a Session</span>
            {step !== 'therapist' && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (step === 'datetime') setStep('therapist');
                  else if (step === 'details') setStep('datetime');
                  else if (step === 'confirmation') setStep('details');
                }}
                className="text-hc-accent hover:text-hc-accent/80"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {['therapist', 'datetime', 'details', 'confirmation'].map((s, index) => (
            <React.Fragment key={s}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === s ? "bg-hc-primary text-white" :
                ['therapist', 'datetime', 'details', 'confirmation'].indexOf(step) > index 
                  ? "bg-hc-tertiary text-hc-primary" 
                  : "bg-gray-200 text-gray-500"
              )}>
                {['therapist', 'datetime', 'details', 'confirmation'].indexOf(step) > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div className="flex-1 h-0.5 bg-gray-200">
                  <div 
                    className={cn(
                      "h-full bg-hc-primary transition-all duration-300",
                      ['therapist', 'datetime', 'details', 'confirmation'].indexOf(step) > index ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {step === 'therapist' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Therapist</h3>
              <p className="text-gray-600">Select a licensed therapist that matches your needs.</p>
            </div>
            
            <Tabs value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-on-one" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>1-on-1 Session</span>
                </TabsTrigger>
                <TabsTrigger value="webinar" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Group Webinar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              {mockTherapists.map(therapist => (
                <TherapistCard key={therapist.id} therapist={therapist} />
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && selectedTherapist && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Date & Time</h3>
              <p className="text-gray-600">Choose when you'd like to have your session with {selectedTherapist.name}.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateAvailable(date)}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                {selectedDate ? (
                  <div className="space-y-2">
                    {getAvailableTimeSlots(selectedDate).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableTimeSlots(selectedDate).map(time => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "justify-center",
                              selectedTime === time && "bg-hc-primary hover:bg-hc-primary/90"
                            )}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-4 text-center border rounded-lg">
                        No available times for this date
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 p-4 text-center border rounded-lg">
                    Please select a date to see available times
                  </p>
                )}

                {selectedDate && selectedTime && (
                  <div className="mt-4 p-3 bg-hc-surface rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Selected Time:</p>
                    <p className="text-sm text-gray-600">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleDateTimeSelect}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full mt-4 bg-hc-primary hover:bg-hc-primary/90 text-white"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Session Details</h3>
              <p className="text-gray-600">Provide additional information about your session.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="session-title">Session Title (Optional)</Label>
                <Input
                  id="session-title"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g., Anxiety Management Session"
                />
              </div>

              <div>
                <Label htmlFor="session-description">What would you like to focus on? (Optional)</Label>
                <Textarea
                  id="session-description"
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  placeholder="Describe what you'd like to work on during this session..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="duration">Session Duration</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleBookSession}
              disabled={isBooking}
              className="w-full bg-hc-primary hover:bg-hc-primary/90 text-white"
            >
              {isBooking ? 'Booking...' : 'Book Session'}
            </Button>
          </div>
        )}

        {step === 'confirmation' && selectedTherapist && selectedDate && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Booked Successfully!</h3>
              <p className="text-gray-600">Your session has been confirmed. You'll receive a confirmation email shortly.</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Therapist:</span>
                    <span>{selectedTherapist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{sessionType === 'one-on-one' ? '1-on-1 Session' : 'Group Webinar'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetBooking();
                }}
                className="flex-1"
              >
                Book Another Session
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-hc-primary hover:bg-hc-primary/90 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};