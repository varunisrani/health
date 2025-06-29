import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealingMateProvider, useHealingMate } from '@/context/HealingMateContext';
import { useRecommendations } from '@/hooks/useHealingMate';

interface HealingMateWidgetProps {
  onNavigateToHealingMate?: () => void;
  className?: string;
}

const HealingMateWidgetContent: React.FC<HealingMateWidgetProps> = ({
  onNavigateToHealingMate,
  className
}) => {
  const { allContent, playContent } = useHealingMate();
  const { continueListening, dailyRecommendations } = useRecommendations();

  // Get quick recommendations based on time of day
  const getCurrentTimeRecommendations = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 12) {
      return dailyRecommendations.morning.slice(0, 2);
    } else if (currentHour >= 12 && currentHour < 17) {
      return dailyRecommendations.afternoon.slice(0, 2);
    } else if (currentHour >= 17 && currentHour < 21) {
      return dailyRecommendations.evening.slice(0, 2);
    } else {
      // Late night/early morning - focus on sleep content
      return allContent.filter(content => 
        content.tags.includes('sleep') || content.tags.includes('relaxation')
      ).slice(0, 2);
    }
  };

  const timeBasedRecommendations = getCurrentTimeRecommendations();
  const totalSessions = allContent.length;

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 12) {
      return { greeting: 'Good Morning', subtitle: 'Start your day mindfully' };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { greeting: 'Good Afternoon', subtitle: 'Take a mindful break' };
    } else if (currentHour >= 17 && currentHour < 21) {
      return { greeting: 'Good Evening', subtitle: 'Unwind and relax' };
    } else {
      return { greeting: 'Good Night', subtitle: 'Prepare for peaceful sleep' };
    }
  };

  const { greeting, subtitle } = getTimeBasedGreeting();

  const QuickActivityCard = ({ content }: { content: any }) => (
    <div className="flex items-center space-x-3 p-3 bg-hc-surface/50 rounded-lg hover:bg-hc-surface transition-colors cursor-pointer"
         onClick={() => playContent(content)}>
      <div className="w-8 h-8 bg-gradient-to-br from-hc-primary to-hc-accent rounded-lg flex items-center justify-center text-white text-sm">
        {content.type === 'music' ? '🎵' : 
         content.type === 'meditation' ? '🧘' :
         content.type === 'breathing' ? '💨' : '🔔'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate">{content.title}</h4>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{content.duration}m</span>
          {content.instructor && (
            <>
              <span>•</span>
              <span className="truncate">{content.instructor}</span>
            </>
          )}
        </div>
      </div>
      <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0">
        <Play className="w-3 h-3" />
      </Button>
    </div>
  );

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Heart className="w-5 h-5 text-hc-accent" />
          <span>Healing Mate</span>
        </CardTitle>
        <div className="text-sm text-gray-600">
          <div className="font-medium">{greeting}</div>
          <div>{subtitle}</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-hc-surface/50 rounded-lg">
            <div className="text-lg font-bold text-hc-primary">{totalSessions}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
          <div className="p-2 bg-hc-surface/50 rounded-lg">
            <div className="text-lg font-bold text-hc-accent">
              {Math.round(allContent.reduce((total, content) => total + content.duration, 0) / 60)}h
            </div>
            <div className="text-xs text-gray-600">Content</div>
          </div>
        </div>

        {/* Continue Listening */}
        {continueListening.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-hc-accent" />
              <span className="text-sm font-medium text-gray-900">Continue Listening</span>
              <Badge variant="secondary" className="text-xs">{continueListening.length}</Badge>
            </div>
            <div className="space-y-2">
              {continueListening.slice(0, 1).map(content => (
                <QuickActivityCard key={content.id} content={content} />
              ))}
            </div>
          </div>
        )}

        {/* Time-based Recommendations */}
        {timeBasedRecommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-hc-accent" />
              <span className="text-sm font-medium text-gray-900">For You Right Now</span>
            </div>
            <div className="space-y-2">
              {timeBasedRecommendations.map(content => (
                <QuickActivityCard key={content.id} content={content} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-2">
          <Button 
            onClick={onNavigateToHealingMate}
            className="w-full bg-gradient-to-r from-hc-primary to-hc-accent hover:from-hc-primary/90 hover:to-hc-accent/90"
            size="sm"
          >
            <Heart className="w-4 h-4 mr-2" />
            Explore Healing Mate
          </Button>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            🎵 Music
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            🧘 Meditation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const HealingMateWidget: React.FC<HealingMateWidgetProps> = (props) => {
  return (
    <HealingMateProvider>
      <HealingMateWidgetContent {...props} />
    </HealingMateProvider>
  );
};