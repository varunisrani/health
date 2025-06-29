
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HealingMate } from '@/components/HealingMate';
import { GuidedMeditation } from '@/components/GuidedMeditation';
import { MusicTherapy } from '@/components/MusicTherapy';

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle navigation state for category selection
  useEffect(() => {
    if (location.state?.category) {
      const category = location.state.category.toLowerCase();
      if (category === 'meditations') {
        setActiveTab('meditation');
      } else if (category === 'music therapy') {
        setActiveTab('music');
      } else if (category === 'yoga routines') {
        setActiveTab('yoga');
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-hc-surface p-6">
      <div className="container mx-auto max-w-7xl">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="ghost" 
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultant Library</h1>
          <p className="text-gray-600">Explore our comprehensive collection of healing and consultant content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="music">Music Therapy</TabsTrigger>
            <TabsTrigger value="yoga">Yoga & Movement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <HealingMate />
          </TabsContent>
          
          <TabsContent value="meditation" className="space-y-6">
            <GuidedMeditation />
          </TabsContent>
          
          <TabsContent value="music" className="space-y-6">
            <MusicTherapy />
          </TabsContent>
          
          <TabsContent value="yoga" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🕉️</span>
                  <span>Yoga & Movement</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧘‍♀️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Yoga Programs Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We're working on bringing you comprehensive yoga routines and movement practices. 
                    Stay tuned for gentle flows, power sessions, and restorative practices.
                  </p>
                  <Button variant="outline">
                    Notify Me When Available
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;
