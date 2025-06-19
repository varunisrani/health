
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingDialog } from '@/components/BookingDialog';
import { Search } from 'lucide-react';

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

  const filteredTherapists = mockTherapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || therapist.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBookSession = (therapist: any) => {
    setSelectedTherapist(therapist);
    setShowBookingDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search therapists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {specialtyFilters.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(specialty)}
              className={selectedSpecialty === specialty ? "bg-hc-primary text-white" : ""}
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <Card 
            key={therapist.id} 
            className="hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={therapist.avatar} />
                  <AvatarFallback className="bg-hc-primary text-white">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
                  <p className="text-sm text-gray-600">{therapist.experience} experience</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {therapist.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium">{therapist.rating}</span>
                </div>
                <Button 
                  onClick={() => handleBookSession(therapist)}
                  className="bg-hc-accent hover:bg-hc-accent/90 text-white"
                >
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        therapist={selectedTherapist}
      />
    </div>
  );
};
