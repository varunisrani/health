
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MoodProvider } from '@/context/MoodContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TherapistsTab } from '@/components/dashboard/TherapistsTab';
import { SessionsTab } from '@/components/dashboard/SessionsTab';
import { LibraryTab } from '@/components/dashboard/LibraryTab';
import { HealingMateTab } from '@/components/dashboard/HealingMateTab';
import { MoodTab } from '@/components/dashboard/MoodTab';
import { HealingMateWidget } from '@/components/HealingMateWidget';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { TrialStatus } from '@/components/TrialStatus';
import { NotificationCenter, NotificationBell } from '@/components/NotificationCenter';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Crown, Clock, Bell, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, subscription, trialStatus, isTrialExpiring, isTrialExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('therapists');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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

  // Handle navigation state to set active tab when coming from library section
  React.useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
              <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  {/* Logo - Always visible */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-hc-primary to-hc-secondary rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">H</span>
                    </div>
                    <h1 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-hc-primary to-hc-secondary bg-clip-text text-transparent">
                      Mended Minds
                    </h1>
                  </div>
                  
                  {/* Desktop Navigation */}
                  {!isMobile && (
                    <div className="flex items-center space-x-4">
                      <NotificationBell onClick={() => setShowNotifications(true)} />
                      {getSubscriptionBadge()}
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-800 font-medium hidden lg:inline">Welcome, {user?.name}</span>
                      <Button variant="outline" onClick={handleLogout} className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                        Logout
                      </Button>
                    </div>
                  )}
                  
                  {/* Mobile Navigation */}
                  {isMobile && (
                    <div className="flex items-center space-x-2">
                      <NotificationBell onClick={() => setShowNotifications(true)} />
                      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Menu className="h-5 w-5 text-slate-700" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                          <div className="flex flex-col h-full">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-gradient-to-br from-hc-primary to-hc-secondary text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-slate-900">{user?.name}</p>
                                  <p className="text-xs text-slate-600">Mended Minds Member</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Subscription Status */}
                            <div className="p-4 border-b">
                              {getSubscriptionBadge()}
                            </div>
                            
                            {/* Mobile Navigation Menu */}
                            <div className="flex-1 py-4">
                              <nav className="space-y-2">
                                {[
                                  { id: 'therapists', label: 'Therapists', icon: '👨‍⚕️' },
                                  { id: 'sessions', label: 'Sessions', icon: '📅' },
                                  { id: 'healing-mate', label: 'Healing Mate', icon: '🤝' },
                                  { id: 'mood', label: 'Mood Tracker', icon: '😊' },
                                  { id: 'library', label: 'Library', icon: '📚' },
                                  { id: 'subscription', label: 'Subscription', icon: '👑' }
                                ].map((tab) => (
                                  <Button
                                    key={tab.id}
                                    variant={activeTab === tab.id ? "default" : "ghost"}
                                    className={`w-full justify-start h-12 text-left px-4 ${
                                      activeTab === tab.id 
                                        ? 'bg-hc-primary text-white' 
                                        : 'text-slate-700 hover:bg-hc-soft'
                                    }`}
                                    onClick={() => {
                                      setActiveTab(tab.id);
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    <span className="mr-3 text-lg">{tab.icon}</span>
                                    {tab.label}
                                  </Button>
                                ))}
                              </nav>
                            </div>
                            
                            {/* Mobile Logout */}
                            <div className="p-4 border-t">
                              <Button 
                                variant="outline" 
                                onClick={handleLogout} 
                                className="w-full text-slate-700 border-slate-300 hover:bg-slate-100"
                              >
                                Logout
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                </div>
              </div>
            </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Trial Expiration Notice */}
          {(isTrialExpiring || isTrialExpired) && (
            <div className="mb-4 sm:mb-6">
              <TrialStatus 
                compact={true}
                onUpgradeClick={() => setActiveTab('subscription')}
              />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Desktop Tab Navigation */}
            {!isMobile && (
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="therapists" className="text-slate-700 font-medium data-[state=active]:bg-hc-secondary data-[state=active]:text-white px-2 py-2 text-xs md:text-sm">
                  <span className="hidden sm:inline">Therapists</span>
                  <span className="sm:hidden">👨‍⚕️</span>
                </TabsTrigger>
                <TabsTrigger value="sessions" className="text-slate-700 font-medium data-[state=active]:bg-hc-primary data-[state=active]:text-white px-2 py-2 text-xs md:text-sm">
                  <span className="hidden sm:inline">Sessions</span>
                  <span className="sm:hidden">📅</span>
                </TabsTrigger>
                <TabsTrigger value="healing-mate" className="text-slate-700 font-medium data-[state=active]:bg-hc-tertiary data-[state=active]:text-white px-2 py-2 text-xs md:text-sm">
                  <span className="hidden md:inline">Healing Mate</span>
                  <span className="md:hidden hidden sm:inline">Healing</span>
                  <span className="sm:hidden">🤝</span>
                </TabsTrigger>
                <TabsTrigger value="mood" className="text-slate-700 font-medium data-[state=active]:bg-hc-accent data-[state=active]:text-slate-800 px-2 py-2 text-xs md:text-sm">
                  <span className="hidden sm:inline">Mood</span>
                  <span className="sm:hidden">😊</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="text-slate-700 font-medium data-[state=active]:bg-hc-warm data-[state=active]:text-slate-800 px-2 py-2 text-xs md:text-sm">
                  <span className="hidden sm:inline">Library</span>
                  <span className="sm:hidden">📚</span>
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center justify-center gap-1 text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-hc-primary data-[state=active]:to-hc-secondary data-[state=active]:text-white px-2 py-2 text-xs md:text-sm">
                  <Crown className="h-3 w-3" />
                  <span className="hidden sm:inline">Subscription</span>
                </TabsTrigger>
              </TabsList>
            )}
            
            {/* Mobile Current Tab Indicator */}
            {isMobile && (
              <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {activeTab === 'therapists' && '👨‍⚕️'}
                      {activeTab === 'sessions' && '📅'}
                      {activeTab === 'healing-mate' && '🤝'}
                      {activeTab === 'mood' && '😊'}
                      {activeTab === 'library' && '📚'}
                      {activeTab === 'subscription' && '👑'}
                    </span>
                    <div>
                      <h2 className="font-semibold text-slate-900 capitalize">
                        {activeTab === 'healing-mate' ? 'Healing Mate' : activeTab}
                      </h2>
                      <p className="text-xs text-slate-600">Current section</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMobileMenuOpen(true)}
                    className="text-slate-700"
                  >
                    Switch
                  </Button>
                </div>
              </div>
            )}
            
            <TabsContent value="therapists">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <TherapistsTab />
                </div>
                <div className="lg:col-span-1 order-1 lg:order-2 space-y-3 sm:space-y-4">
                  <HealingMateWidget onNavigateToHealingMate={handleNavigateToHealingMate} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <SessionsTab />
                </div>
                <div className="lg:col-span-1 order-1 lg:order-2 space-y-3 sm:space-y-4">
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <LibraryTab />
                </div>
                <div className="lg:col-span-1 order-1 lg:order-2 space-y-3 sm:space-y-4">
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
