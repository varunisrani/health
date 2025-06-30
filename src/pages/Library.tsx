
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealingMate } from '@/components/HealingMate';
import { GuidedMeditation } from '@/components/GuidedMeditation';
import { VideoMeditation } from '@/components/VideoMeditation';
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="video-meditation">Video Meditation</TabsTrigger>
            <TabsTrigger value="music">Music Therapy</TabsTrigger>
            <TabsTrigger value="yoga">Yoga & Movement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <HealingMate />
          </TabsContent>
          
          <TabsContent value="meditation" className="space-y-6">
            <GuidedMeditation />
          </TabsContent>
          
          <TabsContent value="video-meditation" className="space-y-6">
            <VideoMeditation />
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Morning Yoga Flow</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/LiUnFJ8P4gM"
                        title="Morning Yoga Flow"
                        className="w-full h-full"
                        style={{border: 0}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Relaxing Yoga Session</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/N0tY-TaEEQI"
                        title="Relaxing Yoga Session"
                        className="w-full h-full"
                        style={{border: 0}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Gentle Yoga Practice</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/DbDoBzGY3vo"
                        title="Gentle Yoga Practice"
                        className="w-full h-full"
                        style={{border: 0}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Restorative Yoga</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/ZUFvt3Y1yW0"
                        title="Restorative Yoga"
                        className="w-full h-full"
                        style={{border: 0}}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
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
