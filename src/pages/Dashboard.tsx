
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TherapistsTab } from '@/components/dashboard/TherapistsTab';
import { SessionsTab } from '@/components/dashboard/SessionsTab';
import { LibraryTab } from '@/components/dashboard/LibraryTab';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('therapists');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-hc-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-semibold text-hc-primary">HealConnect</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback className="bg-hc-primary text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-hc-primary">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>
          
          <TabsContent value="therapists">
            <TherapistsTab />
          </TabsContent>
          
          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>
          
          <TabsContent value="library">
            <LibraryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
