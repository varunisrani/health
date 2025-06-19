
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Library = () => {
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
            <CardTitle>Wellness Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the library page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Library;
