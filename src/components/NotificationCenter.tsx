import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bell, 
  X, 
  Clock, 
  CreditCard, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Crown
} from 'lucide-react';
import { Notification } from '@/types';
import { toast } from 'sonner';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification } = useSubscription();
  const { isTrialExpiring, isTrialExpired, trialStatus } = useAuth();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const recentNotifications = notifications
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'trial_expiring':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'payment_failed':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      case 'privacy_update':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'consent_renewal':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'security_alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    dismissNotification(notification.id);
    
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      onClose();
      // In a real app, this would use router navigation
      console.log('Navigating to:', notification.actionUrl);
    }
  };

  const handleDismiss = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    dismissNotification(notificationId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadNotifications.length}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Priority Notifications */}
          {(isTrialExpiring || isTrialExpired) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-800">
                      {isTrialExpired ? 'Trial Expired' : 'Trial Expiring Soon'}
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      {isTrialExpired 
                        ? 'Your free trial has expired. Upgrade to continue using premium features.'
                        : `Your trial expires in ${trialStatus?.daysRemaining} day${trialStatus?.daysRemaining !== 1 ? 's' : ''}. Upgrade now to avoid interruption.`
                      }
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2 bg-orange-600 hover:bg-orange-700"
                      onClick={() => {
                        onClose();
                        // Navigate to subscription page
                      }}
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regular Notifications */}
          {recentNotifications.length > 0 ? (
            <div className="space-y-2">
              {recentNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    !notification.read ? 'border-hc-primary bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-hc-primary rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                                {notification.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                            onClick={(e) => handleDismiss(e, notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {notification.actionRequired && notification.actionUrl && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2 text-xs"
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No notifications</p>
              <p className="text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          )}

          {/* Actions */}
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    notifications.forEach(n => dismissNotification(n.id));
                    toast.success('All notifications marked as read');
                  }}
                >
                  Mark All as Read
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Notification Bell Icon Component for Header
interface NotificationBellProps {
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const { notifications } = useSubscription();
  const { isTrialExpiring, isTrialExpired } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUrgentNotifications = isTrialExpiring || isTrialExpired || 
    notifications.some(n => !n.read && (n.priority === 'urgent' || n.priority === 'high'));

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative hover:bg-slate-100"
      onClick={onClick}
    >
      <Bell className={`h-4 w-4 ${hasUrgentNotifications ? 'text-red-500' : 'text-slate-700'}`} />
      {(unreadCount > 0 || isTrialExpiring || isTrialExpired) && (
        <Badge 
          variant={hasUrgentNotifications ? "destructive" : "secondary"}
          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
        >
          {Math.min(unreadCount + (isTrialExpiring || isTrialExpired ? 1 : 0), 9)}
          {(unreadCount + (isTrialExpiring || isTrialExpired ? 1 : 0)) > 9 && '+'}
        </Badge>
      )}
    </Button>
  );
};