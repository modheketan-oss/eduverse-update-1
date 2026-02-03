import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Award, Star, ShieldCheck, Zap, CreditCard, Smartphone, Lock, X, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';

// Payment Modal Component
interface PaymentModalProps {
  amount: string;
  cycle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, cycle, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate secure gateway handshake and processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-700">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="font-bold text-sm">Secure Checkout</span>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total Amount</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-3xl font-bold text-slate-900">{amount}</h2>
              <span className="text-sm text-slate-500">/ {cycle}</span>
            </div>
            <p className="text-xs text-purple-600 font-medium mt-1">Includes all taxes</p>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex gap-3 mb-6">
            <button 
              type="button"
              onClick={() => setMethod('card')}
              className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                method === 'card' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Card
            </button>
            <button 
              type="button"
              onClick={() => setMethod('upi')}
              className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                method === 'upi' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              UPI
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'card' ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">Card Number</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">Expiry</label>
                    <input 
                      required
                      type="text" 
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">CVC</label>
                    <input 
                      required
                      type="password" 
                      placeholder="123"
                      maxLength={3}
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">Cardholder Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1.5 py-4">
                <label className="text-xs font-bold text-slate-600 ml-1">UPI ID</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="username@bank"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 px-1 pt-1">Google Pay, PhonePe, Paytm, etc.</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-4 mt-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay {amount}
                  <Lock className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400">
               <ShieldCheck className="w-3 h-3" />
               <span>Payments are processed securely via Stripe</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Premium: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { upgradeToPremium } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setIsSuccess(true);
    upgradeToPremium();
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSuccess && location.state?.from) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Navigate back to the course, passing the lessonId to maintain state
            // Add justPurchased flag so CoursePlayer can show a success message
            navigate(location.state.from, { 
                state: { 
                    lessonId: location.state.lessonId,
                    justPurchased: true 
                } 
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccess, location.state, navigate]);

  if (isSuccess) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Premium!</h1>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your subscription has been activated successfully. You now have unlimited access to all courses and features.</p>
        
        {location.state?.from ? (
           <div className="space-y-3 w-full">
               <p className="text-sm text-purple-600 font-semibold animate-pulse">
                   Redirecting you back to your course in {countdown}...
               </p>
               <Button 
                   variant="gradient" 
                   fullWidth 
                   onClick={() => navigate(location.state.from, { 
                       state: { 
                           lessonId: location.state.lessonId,
                           justPurchased: true
                       } 
                   })}
               >
                  Return Immediately
               </Button>
           </div>
        ) : (
            <Button variant="gradient" fullWidth onClick={() => navigate('/dashboard')}>
                Start Learning
            </Button>
        )}
      </div>
    );
  }

  const currentPrice = billingCycle === 'annual' ? '₹2,999' : '₹399';

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
       
       <div className="p-4 pt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 mb-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 px-6 pb-8 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
             <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full"></div>
             <Award className="w-16 h-16 text-purple-600 mb-4 relative z-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EduVerse Premium</h1>
          <p className="text-slate-500">Invest in your future today</p>
        </div>

        {/* Toggle */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex mb-8 max-w-xs mx-auto">
            <button 
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
            >
                Monthly
            </button>
            <button 
                 onClick={() => setBillingCycle('annual')}
                 className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all relative ${billingCycle === 'annual' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500'}`}
            >
                Annual
                {billingCycle !== 'annual' && (
                    <span className="absolute -top-3 -right-3 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">SAVE 40%</span>
                )}
            </button>
        </div>

        {/* Pricing Card */}
        <div className={`bg-gradient-to-br transition-all duration-300 ${billingCycle === 'annual' ? 'from-fuchsia-600 to-pink-600 shadow-fuchsia-200' : 'from-slate-800 to-slate-900 shadow-slate-200'} rounded-3xl p-8 text-center text-white shadow-xl mb-8 relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/15 transition-all"></div>
          
          <p className="text-white/90 font-medium mb-1">
             {billingCycle === 'annual' ? 'Best Value Plan' : 'Standard Plan'}
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <span className="text-4xl font-bold">
                {currentPrice}
            </span>
            <span className="opacity-80">
                /{billingCycle === 'annual' ? 'year' : 'mo'}
            </span>
          </div>
          
          {billingCycle === 'annual' && (
              <p className="text-sm bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Just ₹8.2 per day!</p>
          )}
           {billingCycle === 'monthly' && (
              <p className="text-sm text-white/60">Cancel anytime.</p>
          )}
        </div>

        {/* Benefits List */}
        <div className="space-y-5 mb-10">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">What's Included</h3>
          {[
            { text: 'Complete Academic Content (1st-12th)', icon: <CheckCircle className="w-5 h-5 text-purple-600" /> },
            { text: 'Unlimited AI Study Buddy Access', icon: <Zap className="w-5 h-5 text-amber-500" /> },
            { text: 'Certified Skill Development Courses', icon: <Star className="w-5 h-5 text-purple-600" /> },
            { text: 'Verified Internship Opportunities', icon: <ShieldCheck className="w-5 h-5 text-green-600" /> },
            { text: 'Business & Entrepreneurship Modules', icon: <CheckCircle className="w-5 h-5 text-purple-600" /> },
            { text: 'Instant PDF Certificates', icon: <CheckCircle className="w-5 h-5 text-purple-600" /> }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-50">
              <div className="shrink-0">{item.icon}</div>
              <span className="text-slate-700 text-sm font-medium leading-tight">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mb-4">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure 256-bit SSL Encrypted Payment</span>
        </div>

        <Button variant="gradient" fullWidth onClick={() => setShowPaymentModal(true)}>
          Subscribe Now
        </Button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          amount={currentPrice} 
          cycle={billingCycle === 'annual' ? 'Yearly' : 'Monthly'}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};