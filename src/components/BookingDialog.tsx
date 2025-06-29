
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  therapist: any;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
];

const generateFakeMeet = () => {
  const syll = () => Math.random().toString(36).substring(2, 6);
  return `${syll()}-${syll()}-${syll()}`;
};

export const BookingDialog: React.FC<BookingDialogProps> = ({ open, onOpenChange, therapist }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const isMobile = useIsMobile();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(2);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    const generatedLink = `meet.google.com/${generateFakeMeet()}`;
    setMeetLink(generatedLink);
    
    // Save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem('mendedminds_sessions') || '[]');
    const newSession = {
      id: Date.now().toString(),
      therapistId: therapist?.id,
      therapistName: therapist?.name,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      meetLink: generatedLink,
      status: 'upcoming'
    };
    existingSessions.push(newSession);
    localStorage.setItem('mendedminds_sessions', JSON.stringify(existingSessions));
    
    onOpenChange(false);
    setShowSuccessSheet(true);
    toast({ title: "Session booked!", description: "Details added to My Sessions" });
    
    // Reset state
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(meetLink);
    toast({ title: "Link copied!", description: "Meeting link copied to clipboard" });
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`w-full max-w-md mx-4 ${
          isMobile 
            ? 'h-auto max-h-[90vh] overflow-y-auto p-4' 
            : 'sm:max-w-md'
        }`}>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-base sm:text-lg font-semibold text-center">
              Book a Session with {therapist?.name}
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">Select a date for your session:</p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < today || date > maxDate}
                  className={`rounded-md border ${
                    isMobile ? 'text-sm' : ''
                  }`}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                >
                  ← Back to date selection
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Available times for {selectedDate && format(selectedDate, isMobile ? 'MMM d, yyyy' : 'MMMM d, yyyy')}:
                </p>
              </div>
              <div className={`grid gap-2 ${
                isMobile ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => handleTimeSelect(time)}
                    className={`h-10 text-xs sm:text-sm ${
                      selectedTime === time ? 'bg-hc-secondary text-white' : ''
                    }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto mb-2"
              >
                ← Back to time selection
              </Button>
              <div className="bg-hc-surface p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Therapist:</strong> {therapist?.name}</p>
                  <p><strong>Date:</strong> {selectedDate && format(selectedDate, isMobile ? 'MMM d, yyyy' : 'MMMM d, yyyy')}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                </div>
              </div>
              <Button
                onClick={handleConfirmBooking}
                className="w-full h-11 bg-hc-accent hover:bg-hc-accent/90 text-white font-medium"
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={showSuccessSheet} onOpenChange={setShowSuccessSheet}>
        <SheetContent className={isMobile ? 'w-full' : 'w-96'}>
          <SheetHeader>
            <SheetTitle className="text-hc-primary text-lg sm:text-xl">✅ Booking Confirmed!</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="bg-hc-surface p-4 rounded-lg">
              <p className="font-semibold mb-2 text-sm sm:text-base">
                Session confirmed for {selectedDate && format(selectedDate, 'EEE, MMM d')} at {selectedTime}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">with {therapist?.name}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Meeting Link</Label>
              <div className={`flex gap-2 ${
                isMobile ? 'flex-col' : 'flex-row'
              }`}>
                <Input 
                  value={meetLink} 
                  readOnly 
                  className={`h-10 text-sm ${
                    isMobile ? 'w-full' : 'flex-1'
                  }`} 
                />
                <Button 
                  onClick={copyLink} 
                  variant="outline"
                  className={`h-10 px-4 text-sm ${
                    isMobile ? 'w-full' : 'w-auto'
                  }`}
                >
                  Copy Link
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowSuccessSheet(false)}
                className="bg-hc-primary hover:bg-hc-primary/90 text-white flex-1 h-11 font-medium"
              >
                View My Sessions
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
