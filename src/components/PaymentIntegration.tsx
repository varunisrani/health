import React, { useState } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Crown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { SubscriptionPlan } from '@/types';
import { toast } from 'sonner';

interface PaymentIntegrationProps {
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  plan,
  billingCycle,
  onClose,
  onSuccess
}) => {
  const { addPaymentMethod, upgradeToPremium, upgrading, hasPaymentMethod } = useSubscription();
  
  const [paymentStep, setPaymentStep] = useState<'payment' | 'confirmation' | 'processing'>('payment');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  const price = plan.price[billingCycle];
  const isYearly = billingCycle === 'yearly';
  const monthlyCost = plan.price.monthly * 12;
  const savings = isYearly ? monthlyCost - price : 0;
  const savingsPercentage = isYearly ? (savings / monthlyCost) * 100 : 0;

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.push('Valid card number is required');
    }
    
    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      errors.push('Expiry date is required');
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      errors.push('Valid CVV is required');
    }
    
    if (!paymentData.cardholderName.trim()) {
      errors.push('Cardholder name is required');
    }
    
    if (!agreedToTerms) {
      errors.push('You must agree to the terms and conditions');
    }

    return errors;
  };

  const handlePaymentSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setPaymentStep('confirmation');
  };

  const handleConfirmPayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Add payment method if needed
      let paymentMethodId = 'existing_method';
      
      if (savePaymentMethod || !hasPaymentMethod) {
        const success = await addPaymentMethod({
          cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
          expiryMonth: parseInt(paymentData.expiryMonth),
          expiryYear: parseInt(paymentData.expiryYear),
          cardholderName: paymentData.cardholderName,
          last4: paymentData.cardNumber.slice(-4),
          brand: 'visa' // In real app, this would be detected
        });

        if (!success) {
          setPaymentStep('payment');
          return;
        }
        
        paymentMethodId = 'new_method_id';
      }

      // Upgrade subscription
      const upgradeSuccess = await upgradeToPremium(billingCycle, paymentMethodId);
      
      if (upgradeSuccess) {
        onSuccess();
      } else {
        setPaymentStep('payment');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStep('payment');
      toast.error('Payment failed. Please try again.');
    }
  };

  const renderPaymentForm = () => (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card className="bg-hc-surface">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-hc-primary" />
              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-600">{billingCycle} billing</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${price.toFixed(2)}</div>
              {isYearly && (
                <div className="text-xs text-hc-accent">
                  Save ${savings.toFixed(0)} ({savingsPercentage.toFixed(0)}% off)
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <div className="space-y-4">
        {/* Card Information */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Information
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  placeholder="MM"
                  value={paymentData.expiryMonth}
                  onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  placeholder="YYYY"
                  value={paymentData.expiryYear}
                  onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Billing Address</Label>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={paymentData.billingAddress.street}
                onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={paymentData.billingAddress.city}
                  onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={paymentData.billingAddress.state}
                  onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={paymentData.billingAddress.zipCode}
                onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="savePaymentMethod"
              checked={savePaymentMethod}
              onCheckedChange={(checked) => setSavePaymentMethod(checked as boolean)}
            />
            <Label htmlFor="savePaymentMethod" className="text-sm">
              Save payment method for future purchases
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label htmlFor="agreeTerms" className="text-sm">
              I agree to the <a href="#" className="text-hc-primary hover:underline">Terms of Service</a> and <a href="#" className="text-hc-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 bg-hc-surface rounded-lg">
          <Lock className="h-4 w-4 text-hc-primary mt-0.5" />
          <div className="text-sm">
            <p className="text-hc-primary font-medium">Secure Payment</p>
            <p className="text-hc-primary">Your payment information is encrypted and secure. We use industry-standard SSL encryption.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-hc-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Confirm Your Purchase</h3>
        <p className="text-gray-600">Please review your order before completing the payment</p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>{plan.name} ({billingCycle})</span>
            <span>${price.toFixed(2)}</span>
          </div>
          
          {isYearly && (
            <div className="flex justify-between text-hc-accent">
              <span>Yearly discount</span>
              <span>-${savings.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${price.toFixed(2)}</span>
          </div>
          
          <div className="text-xs text-gray-600">
            * Recurring {billingCycle}. Cancel anytime.
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4" />
            <span>**** **** **** {paymentData.cardNumber.slice(-4)}</span>
            <Badge variant="outline">{paymentData.expiryMonth}/{paymentData.expiryYear}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin h-12 w-12 border-4 border-hc-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
      <p className="text-gray-600">Please wait while we process your payment. This may take a few moments.</p>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-hc-primary" />
            Upgrade to {plan.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {paymentStep === 'payment' && renderPaymentForm()}
          {paymentStep === 'confirmation' && renderConfirmation()}
          {paymentStep === 'processing' && renderProcessing()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {paymentStep === 'payment' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handlePaymentSubmit} className="flex-1 bg-hc-primary hover:bg-hc-primary/90">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Continue to Payment
                </Button>
              </>
            )}
            
            {paymentStep === 'confirmation' && (
              <>
                <Button variant="outline" onClick={() => setPaymentStep('payment')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirmPayment} className="flex-1 bg-hc-primary hover:bg-hc-primary/90">
                  <Lock className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};