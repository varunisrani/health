
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TherapistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hc-surface p-6">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="ghost" 
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Therapist Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Therapist ID: {id}</p>
            <p>This is a placeholder for the therapist profile page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistProfile;
