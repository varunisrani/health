
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MoodProvider } from '@/context/MoodContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TherapistsTab } from '@/components/dashboard/TherapistsTab';
import { SessionsTab } from '@/components/dashboard/SessionsTab';
import { LibraryTab } from '@/components/dashboard/LibraryTab';
import { HealingMateTab } from '@/components/dashboard/HealingMateTab';
import { MoodTab } from '@/components/dashboard/MoodTab';
import { MoodWidget } from '@/components/MoodWidget';
import { HealingMateWidget } from '@/components/HealingMateWidget';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { TrialStatus } from '@/components/TrialStatus';
import { NotificationCenter, NotificationBell } from '@/components/NotificationCenter';
import { useNavigate } from 'react-router-dom';
import { Crown, Clock, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, subscription, trialStatus, isTrialExpiring, isTrialExpired } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('therapists');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigateToMoodTracker = () => {
    setActiveTab('mood');
  };

  const handleNavigateToHealingMate = () => {
    setActiveTab('healing-mate');
  };

  const handleNavigateToTherapists = () => {
    setActiveTab('therapists');
  };

  React.useEffect(() => {
    const handleNavigateToTherapistsEvent = () => {
      setActiveTab('therapists');
    };

    window.addEventListener('navigate-to-therapists', handleNavigateToTherapistsEvent);
    
    return () => {
      window.removeEventListener('navigate-to-therapists', handleNavigateToTherapistsEvent);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getSubscriptionBadge = () => {
    if (!subscription) return null;
    
    if (subscription.planType === 'trial') {
      if (isTrialExpired) {
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Trial Expired
          </Badge>
        );
      } else if (isTrialExpiring) {
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {trialStatus?.daysRemaining}d left
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Free Trial
          </Badge>
        );
      }
    }
    
    if (subscription.planType === 'premium') {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-hc-primary">
          <Crown className="h-3 w-3" />
          Premium
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <SubscriptionProvider>
      <MoodProvider>
          <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/50 to-hc-soft/20">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-hc-soft/50">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-hc-primary to-hc-secondary rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <h1 className="text-2xl font-semibold bg-gradient-to-r from-hc-primary to-hc-secondary bg-clip-text text-transparent">HealConnect</h1>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <NotificationBell onClick={() => setShowNotifications(true)} />
                  
                  {/* Subscription Status Badge */}
                  {getSubscriptionBadge()}
                  
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-800 font-medium">Welcome, {user?.name}</span>
                  <Button variant="outline" onClick={handleLogout} className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                    Logout
                  </Button>
                </div>
              </div>
            </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Trial Expiration Notice */}
          {(isTrialExpiring || isTrialExpired) && (
            <div className="mb-6">
              <TrialStatus 
                compact={true}
                onUpgradeClick={() => setActiveTab('subscription')}
              />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm">
              <TabsTrigger value="therapists" className="text-slate-700 font-medium data-[state=active]:bg-hc-secondary data-[state=active]:text-white">Therapists</TabsTrigger>
              <TabsTrigger value="sessions" className="text-slate-700 font-medium data-[state=active]:bg-hc-primary data-[state=active]:text-white">Sessions</TabsTrigger>
              <TabsTrigger value="healing-mate" className="text-slate-700 font-medium data-[state=active]:bg-hc-tertiary data-[state=active]:text-white">Healing Mate</TabsTrigger>
              <TabsTrigger value="mood" className="text-slate-700 font-medium data-[state=active]:bg-hc-accent data-[state=active]:text-slate-800">Mood</TabsTrigger>
              <TabsTrigger value="library" className="text-slate-700 font-medium data-[state=active]:bg-hc-warm data-[state=active]:text-slate-800">Library</TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-1 text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-hc-primary data-[state=active]:to-hc-secondary data-[state=active]:text-white">
                <Crown className="h-3 w-3" />
                Subscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="therapists">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <TherapistsTab />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <MoodWidget onNavigateToMoodTracker={handleNavigateToMoodTracker} />
                  <HealingMateWidget onNavigateToHealingMate={handleNavigateToHealingMate} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <SessionsTab />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <MoodWidget onNavigateToMoodTracker={handleNavigateToMoodTracker} />
                  <HealingMateWidget onNavigateToHealingMate={handleNavigateToHealingMate} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="healing-mate">
              <HealingMateTab />
            </TabsContent>

            <TabsContent value="mood">
              <MoodTab />
            </TabsContent>
            
            <TabsContent value="library">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <LibraryTab />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <MoodWidget onNavigateToMoodTracker={handleNavigateToMoodTracker} />
                  <HealingMateWidget onNavigateToHealingMate={handleNavigateToHealingMate} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionManager />
            </TabsContent>
          </Tabs>
        </div>

        {/* Notification Center */}
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
        </MoodProvider>
    </SubscriptionProvider>
  );
};

export default Dashboard;
