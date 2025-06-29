
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingDialog } from '@/components/BookingDialog';
import { Search, Users, Award, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const mockTherapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialties: ['Yoga', 'Meditation'],
    rating: 4.9,
    avatar: '',
    experience: '8 years',
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialties: ['Music Therapy', 'Meditation'],
    rating: 4.8,
    avatar: '',
    experience: '6 years',
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialties: ['Yoga', 'Mindfulness'],
    rating: 4.9,
    avatar: '',
    experience: '10 years',
  },
  {
    id: '4',
    name: 'James Wilson',
    specialties: ['Music Therapy'],
    rating: 4.7,
    avatar: '',
    experience: '5 years',
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialties: ['Meditation', 'Mindfulness'],
    rating: 4.8,
    avatar: '',
    experience: '7 years',
  },
  {
    id: '6',
    name: 'Raj Patel',
    specialties: ['Yoga', 'Music Therapy'],
    rating: 4.6,
    avatar: '',
    experience: '4 years',
  },
];

const specialtyFilters = ['All', 'Yoga', 'Meditation', 'Music Therapy', 'Mindfulness'];

export const TherapistsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const filteredTherapists = mockTherapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || therapist.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBookSession = (therapist: any) => {
    setSelectedTherapist(therapist);
    setShowBookingDialog(true);
  };

  const handleViewProfile = (therapistId: string) => {
    navigate(`/therapists/${therapistId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search therapists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 sm:h-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {specialtyFilters.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(specialty)}
              className={`h-8 px-3 text-xs sm:text-sm ${
                selectedSpecialty === specialty ? "bg-hc-primary text-white" : ""
              }`}
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Therapists Grid */}
      {filteredTherapists.length === 0 ? (
        <Card className="border-dashed border-2 border-hc-primary/30">
          <CardContent className={isMobile ? "p-6" : "p-8"}>
            <div className="text-center">
              <div className="bg-hc-soft/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-hc-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">No Therapists Found</h3>
              <p className="text-sm text-gray-600 mb-4">
                Try adjusting your search terms or filters to find the perfect therapist for you.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('All');
                }}
                variant="outline"
                className="border-hc-primary text-hc-primary hover:bg-hc-primary/5"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-4 sm:gap-6 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        }`}>
          {filteredTherapists.map((therapist) => (
            <Card 
              key={therapist.id} 
              className="hover-lift cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 border-l-hc-primary/20 hover:border-l-hc-primary"
            >
              <CardContent className={isMobile ? "p-5" : "p-6"}>
                {/* Mobile Layout */}
                <div className={isMobile ? "block" : "hidden"}>
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-hc-primary/20">
                      <AvatarImage src={therapist.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white font-bold text-lg">
                        {therapist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {therapist.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Award className="w-4 h-4 text-hc-secondary" />
                        <p className="text-sm text-gray-600 font-medium">{therapist.experience} experience</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary text-xs px-3 py-1 font-medium">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Rating & Actions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center bg-hc-soft/50 px-3 py-2 rounded-lg">
                      <Star className="w-4 h-4 text-hc-accent fill-current mr-2" />
                      <span className="text-sm font-bold text-gray-900">{therapist.rating}</span>
                      <span className="text-xs text-gray-600 ml-1">rating</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleViewProfile(therapist.id)}
                        variant="outline"
                        className="flex-1 border-hc-primary text-hc-primary hover:bg-hc-primary hover:text-white h-10 font-semibold"
                      >
                        View Profile
                      </Button>
                      <Button 
                        onClick={() => handleBookSession(therapist)}
                        className="flex-1 bg-gradient-to-r from-hc-accent to-hc-accent/90 hover:from-hc-accent/90 hover:to-hc-accent/80 text-slate-800 h-10 font-semibold shadow-md"
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className={isMobile ? "hidden" : "block space-y-4"}>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={therapist.avatar} />
                      <AvatarFallback className="bg-hc-primary text-white text-sm">
                        {therapist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base">{therapist.name}</h3>
                      <p className="text-sm text-gray-600">{therapist.experience} experience</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary text-xs px-2 py-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-hc-accent text-sm">⭐</span>
                      <span className="text-sm font-medium">{therapist.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleViewProfile(therapist.id)}
                        variant="outline"
                        className="border-hc-primary text-hc-primary hover:bg-hc-primary hover:text-white h-9 px-3 text-sm"
                      >
                        View Profile
                      </Button>
                      <Button 
                        onClick={() => handleBookSession(therapist)}
                        className="bg-hc-accent hover:bg-hc-accent/90 text-white h-9 px-4 text-sm"
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        therapist={selectedTherapist}
      />
    </div>
  );
};
