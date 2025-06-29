import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Crown, Gift, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TrialStatusProps {
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export const TrialStatus: React.FC<TrialStatusProps> = ({
  showUpgradeButton = true,
  onUpgradeClick,
  compact = false
}) => {
  const { trialStatus, isTrialExpiring, isTrialExpired } = useAuth();
  const { getTrialExtension, canUpgrade } = useSubscription();

  if (!trialStatus) return null;

  const handleExtendTrial = async () => {
    const success = await getTrialExtension();
    if (success) {
      toast.success('Trial extended by 3 days!');
    }
  };

  const progressPercentage = Math.max(0, (trialStatus.daysRemaining / 14) * 100);
  
  const getStatusColor = () => {
    if (isTrialExpired) return 'destructive';
    if (isTrialExpiring) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isTrialExpired) return <AlertTriangle className="h-4 w-4" />;
    if (isTrialExpiring) return <Clock className="h-4 w-4" />;
    return <Gift className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isTrialExpired) return 'Trial Expired';
    if (isTrialExpiring) return 'Trial Expiring Soon';
    return 'Free Trial Active';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-hc-surface rounded-lg border">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {isTrialExpired ? 'Trial Expired' : `${trialStatus.daysRemaining} days left`}
          </div>
          <Progress value={progressPercentage} className="h-1 mt-1" />
        </div>
        {showUpgradeButton && canUpgrade && (
          <Button 
            size="sm" 
            onClick={onUpgradeClick}
            className="bg-hc-primary hover:bg-hc-primary/90"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </CardTitle>
          <Badge variant={getStatusColor()}>
            {isTrialExpired ? 'Expired' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trial Progress</span>
            <span className="font-medium">
              {isTrialExpired ? '0' : trialStatus.daysRemaining} of 14 days remaining
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            // Use different colors based on status
            style={{
              '--progress-foreground': isTrialExpired 
                ? 'hsl(var(--destructive))' 
                : isTrialExpiring 
                  ? 'hsl(var(--secondary))' 
                  : 'hsl(var(--primary))'
            } as React.CSSProperties}
          />
        </div>

        {/* Trial Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Started:</span>
            <div className="font-medium">
              {trialStatus.startDate.toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Expires:</span>
            <div className="font-medium">
              {trialStatus.endDate.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-hc-surface p-3 rounded-lg">
          {isTrialExpired ? (
            <div className="text-center space-y-2">
              <p className="text-red-600 font-medium">Your free trial has expired</p>
              <p className="text-sm text-gray-600">
                Upgrade to Premium to regain access to all features
              </p>
            </div>
          ) : isTrialExpiring ? (
            <div className="text-center space-y-2">
              <p className="text-orange-600 font-medium">
                Your trial expires in {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">
                Upgrade now to continue enjoying all premium features
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-hc-primary font-medium">
                Enjoy full access to all premium features
              </p>
              <p className="text-sm text-gray-600">
                Unlimited therapist consultations, advanced tracking, and more
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {trialStatus.canExtend && !isTrialExpired && (
            <Button
              variant="outline"
              onClick={handleExtendTrial}
              className="flex-1"
            >
              <Gift className="h-4 w-4 mr-2" />
              Extend Trial (+3 days)
            </Button>
          )}
          
          {showUpgradeButton && canUpgrade && (
            <Button
              onClick={onUpgradeClick}
              className={`${trialStatus.canExtend && !isTrialExpired ? 'flex-1' : 'w-full'} bg-hc-primary hover:bg-hc-primary/90`}
            >
              <Crown className="h-4 w-4 mr-2" />
              {isTrialExpired ? 'Upgrade Now' : 'Upgrade to Premium'}
            </Button>
          )}
        </div>

        {/* Trial Benefits Reminder */}
        {!isTrialExpired && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">What you get with Premium:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Unlimited therapist consultations</li>
              <li>• Advanced health tracking & analytics</li>
              <li>• Personalized consultant plans</li>
              <li>• Priority support & offline access</li>
              <li>• Data export & enhanced privacy controls</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};