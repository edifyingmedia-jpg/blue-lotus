import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  CreditCard, 
  Zap, 
  Gift,
  Shield,
  Sparkles,
  Rocket,
  Crown,
  Star,
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const plans = [
  {
    id: 'creator',
    name: 'Creator',
    price: 9.99,
    monthlyCredits: 150,
    dailyBonus: 10,
    icon: Rocket,
    features: ['Export apps', 'Publish to staging', 'Basic templates', 'Basic support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    monthlyCredits: 400,
    dailyBonus: 10,
    icon: Crown,
    popular: true,
    features: ['Production publishing', 'Advanced templates', 'Priority speed', 'Remove branding'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 29.99,
    monthlyCredits: 800,
    dailyBonus: 10,
    icon: Star,
    features: ['Unlimited publishing', 'Team access (1-3)', 'Premium templates', 'Priority support'],
  },
];

const steps = [
  { id: 'plan_selection', title: 'Choose Plan', number: 1 },
  { id: 'summary', title: 'Review & Pay', number: 2 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getAuthToken, isAuthenticated, loading: authLoading } = useAuth();
  const preselectedPlan = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || 'pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  const plan = plans.find(p => p.id === selectedPlan);

  // Check for returning from Stripe checkout
  useEffect(() => {
    if (sessionId && paymentStatus === 'success') {
      checkPaymentStatus(sessionId);
    }
  }, [sessionId, paymentStatus]);

  // Redirect to login if not authenticated (after auth check completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login?redirect=/checkout?plan=' + selectedPlan);
    }
  }, [isAuthenticated, authLoading, navigate, selectedPlan]);

  const checkPaymentStatus = async (sid) => {
    setIsProcessing(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/billing/status/${sid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        if (data.status === 'paid') {
          setIsComplete(true);
          toast.success('Payment successful! Your plan has been upgraded.');
        } else if (data.status === 'pending') {
          toast.info('Payment is being processed...');
          // Poll again in 3 seconds
          setTimeout(() => checkPaymentStatus(sid), 3000);
        } else {
          setError('Payment was not completed. Please try again.');
        }
      } else {
        setError('Failed to verify payment status');
      }
    } catch (err) {
      setError('Error checking payment status: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/billing/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan,
          origin_url: window.location.origin
        })
      });
      
      if (response.ok) {
        const data = await response.text().then(t => t ? JSON.parse(t) : null);
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        const errorData = await response.text().then(t => t ? JSON.parse(t) : null);
        setError(errorData.detail || 'Failed to create checkout session');
        toast.error(errorData.detail || 'Failed to start checkout');
      }
    } catch (err) {
      setError('Error: ' + err.message);
      toast.error('Failed to connect to payment server');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextBillingDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Success Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Upgrade Successful!</h1>
          <p className="text-gray-400 mb-8">
            Your plan has been updated to {plan?.name}. Credits and features are now active.
          </p>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-white font-medium mb-4">What's next?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                {plan?.monthlyCredits} monthly credits added to your account
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                +{plan?.dailyBonus} daily bonus credits now available
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                All {plan?.name} features unlocked
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/settings/billing')}
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              View Billing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Pricing
          </Link>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-800">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all z-10 ${
                      index < currentStep 
                        ? 'bg-blue-600 text-white' 
                        : index === currentStep 
                          ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' 
                          : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    index <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            {/* Step 1: Plan Selection */}
            {currentStep === 0 && (
              <div data-testid="step-plan-selection">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
                <p className="text-gray-400 mb-8">Select the plan that best fits your needs.</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedPlan === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-600/10' 
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                        }`}
                        data-testid={`plan-option-${p.id}`}
                      >
                        {p.popular && (
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-600/30' : 'bg-gray-700'
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{p.name}</p>
                            <p className="text-gray-400 text-sm">${p.price}/mo</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-300">{p.monthlyCredits} credits/mo</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Gift className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">+{p.dailyBonus}/day bonus</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Order Summary & Checkout */}
            {currentStep === 1 && plan && (
              <div data-testid="step-summary">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Pay</h2>
                <p className="text-gray-400 mb-8">Review your selection and proceed to secure checkout.</p>
                
                <div className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  )}
                  
                  <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center">
                          <plan.icon className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{plan.name} Plan</h3>
                          <p className="text-gray-400">Monthly subscription</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white">${plan.price}<span className="text-gray-400 text-sm font-normal">/mo</span></p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-gray-400 text-sm">Monthly Credits</p>
                          <p className="text-white font-medium">{plan.monthlyCredits}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Daily Bonus Credits</p>
                          <p className="text-white font-medium">+{plan.dailyBonus}/day</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Included Features</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Secure Stripe Checkout</p>
                        <p className="text-gray-400 text-sm">You'll be redirected to Stripe's secure payment page. Cancel anytime.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                      <span className="text-gray-400">Next Billing Date</span>
                      <span className="text-white font-medium">{getNextBillingDate()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-white font-semibold">Total Due Today</span>
                      <span className="text-2xl font-bold text-white">${plan.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
              <Button
                onClick={handleBack}
                variant="ghost"
                className={`text-gray-400 hover:text-white ${currentStep === 0 ? 'invisible' : ''}`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="next-step-btn"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleStartCheckout}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                  data-testid="complete-purchase-btn"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Stripe
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
