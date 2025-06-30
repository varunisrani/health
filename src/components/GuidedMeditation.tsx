import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidedMeditationProps {
  className?: string;
}

// YouTube meditation videos
const meditationVideos = [
  {
    id: 'HPUyw2YYUPs',
    title: 'Guided Mindfulness Meditation',
    description: 'A peaceful guided meditation session for mindfulness and inner calm',
    duration: '15 min'
  },
  {
    id: '0y0586ffZWQ',
    title: 'Deep Relaxation Journey',
    description: 'Immersive meditation for deep relaxation and stress relief',
    duration: '20 min'
  },
  {
    id: 'UoW4tNwYYcQ',
    title: 'Nature Connection Meditation',
    description: 'Connect with nature through this beautiful meditation experience',
    duration: '18 min'
  },
  {
    id: '8HYLyuJZKno',
    title: 'Evening Wind-Down Meditation',
    description: 'Perfect meditation to end your day with peace and tranquility',
    duration: '25 min'
  }
];

export const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guided Meditation</h1>
            <p className="text-gray-600">Mindfulness practices for inner peace and clarity</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {meditationVideos.length} videos
          </Badge>
        </div>
      </div>

      {/* Video Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-hc-accent" />
            <span>Meditation Video Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {meditationVideos.map((video) => (
              <div key={video.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{video.duration}</Badge>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    style={{border: 0}}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-hc-surface to-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-hc-primary">{meditationVideos.length}</div>
              <div className="text-sm text-gray-600">Video Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">78</div>
              <div className="text-sm text-gray-600">Total Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hc-primary">4</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};