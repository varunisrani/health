
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
    const existingSessions = JSON.parse(localStorage.getItem('healconnect_sessions') || '[]');
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
    localStorage.setItem('healconnect_sessions', JSON.stringify(existingSessions));
    
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session with {therapist?.name}</DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select a date for your session:</p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < today || date > maxDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Available times for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => handleTimeSelect(time)}
                    className={`${selectedTime === time ? 'bg-hc-secondary text-white' : ''}`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-hc-surface p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <p><strong>Therapist:</strong> {therapist?.name}</p>
                <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
              </div>
              <Button
                onClick={handleConfirmBooking}
                className="w-full bg-hc-accent hover:bg-hc-accent/90 text-white"
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={showSuccessSheet} onOpenChange={setShowSuccessSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-hc-primary">✅ Booking Confirmed!</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            <div className="bg-hc-surface p-4 rounded-lg">
              <p className="font-semibold mb-2">
                Session confirmed for {selectedDate && format(selectedDate, 'EEE, MMM d')} at {selectedTime}
              </p>
              <p className="text-sm text-gray-600">with {therapist?.name}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Meeting Link</Label>
              <div className="flex space-x-2">
                <Input value={meetLink} readOnly className="flex-1" />
                <Button onClick={copyLink} variant="outline">
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowSuccessSheet(false)}
                className="bg-hc-primary hover:bg-hc-primary/90 text-white flex-1"
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
