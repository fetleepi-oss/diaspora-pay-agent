import React, { useState, useEffect } from 'react';
import { CartItem, Currency, OrderRecord, Recipient, SafetyCheckResult } from '../types';
import { PayPalButton } from './PayPalButton';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Smartphone,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Check,
  Info,
  PhoneCall
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../utils/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  activeRecipient?: Recipient;
  recentUserText?: string;
  onCheckoutSuccess: (order: OrderRecord) => void;
  language?: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  activeRecipient,
  recentUserText,
  onCheckoutSuccess,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];
  const [senderName, setSenderName] = useState('Abel Kebede');
  const [senderEmail, setSenderEmail] = useState('abel.diaspora@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'apple_pay' | 'google_pay'>('paypal');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Safety Check state
  const [safetyLoading, setSafetyLoading] = useState(true);
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [userConfirmedSafety, setUserConfirmedSafety] = useState(false);
  const [userReconfirmedHighRisk, setUserReconfirmedHighRisk] = useState(false);

  const subtotalETB = items.reduce((sum, item) => sum + item.priceETB * item.quantity, 0);
  const subtotalCurrency = subtotalETB / currency.rateToETB;
  const isFreeDelivery = subtotalCurrency >= 50 || paymentMethod === 'paypal';
  const serviceFeeCurrency = isFreeDelivery ? 0 : 1.99;
  const totalCurrency = subtotalCurrency + serviceFeeCurrency;

  // Estimated PayPal processing fee (standard ~3.49% + $0.49), clearly labeled estimate
  const paypalFeeEstimate = Math.max(0.49, Number(((subtotalCurrency * 0.0349) + 0.49).toFixed(2)));

  // Run AI Safety Check whenever modal opens or cart changes
  useEffect(() => {
    let isMounted = true;
    if (!isOpen || items.length === 0) return;

    setSafetyLoading(true);
    setUserConfirmedSafety(false);
    setUserReconfirmedHighRisk(false);

    async function runSafetyCheck() {
      try {
        const combinedNotes = items
          .map((i) => i.customDetails?.specialInstructions)
          .filter(Boolean)
          .join('; ');

        const res = await fetch('/api/safety-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            totalUSD: totalCurrency,
            recipient: items[0]?.recipient || activeRecipient,
            notes: combinedNotes,
            recentUserText: recentUserText || '',
            isNewRecipient: false,
          }),
        });

        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setSafetyResult(data.data);
        }
      } catch (err) {
        console.warn('AI Safety Check API error:', err);
      } finally {
        if (isMounted) {
          setSafetyLoading(false);
        }
      }
    }

    runSafetyCheck();

    return () => {
      isMounted = false;
    };
  }, [isOpen, items, totalCurrency, recentUserText, activeRecipient]);

  if (!isOpen) return null;

  const currentRiskLevel = safetyResult?.riskLevel || (safetyResult?.isSuspicious ? 'Medium' : 'Low');
  const isHighRisk = currentRiskLevel === 'High';
  const isMediumRisk = currentRiskLevel === 'Medium';
  const isLowRisk = currentRiskLevel === 'Low';

  // Lock payment controls while safety check is loading, or when High/Medium risk has not been confirmed
  const isBlockedBySafety =
    safetyLoading ||
    (isHighRisk
      ? !userReconfirmedHighRisk
      : isMediumRisk && !userConfirmedSafety);

  const handlePayCardOrWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlockedBySafety) {
      setErrorMsg(isHighRisk ? t.highRiskLockedMessage : 'Please review and confirm the AI Safety Warning before proceeding.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          currency,
          senderName,
          senderEmail,
          paymentMethod: paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Credit/Debit Card (Visa/MC)',
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#009639', '#FED100', '#D92B2B', '#10B981'],
        });

        onCheckoutSuccess(data.order);
      } else {
        throw new Error(data.error || 'Failed to process checkout');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Payment processing error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-700 text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Diaspora Checkout & Fulfillment
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Encrypted checkout • Instant SMS tokens & delivery to Ethiopia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-rose-950 block">Payment Notice</span>
                <span className="text-[11px] text-rose-800 leading-relaxed block mt-0.5">{errorMsg}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="p-1 rounded-lg text-rose-600 hover:text-rose-900 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* ======================================================== */}
          {/* "WHY THIS MATTERS" TRANSPARENCY CARD */}
          {/* ======================================================== */}
          <div className="rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 p-4 sm:p-5 shadow-xs space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-700 text-white shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{t.whyThisMatters}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      100% Transparent
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Transparent fee breakdown & direct merchant settlement
                  </p>
                </div>
              </div>

              <div className="text-[10px] font-bold text-amber-900 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded-full shrink-0">
                0% Hidden FX Spread
              </div>
            </div>

            {/* Breakdown: Cart Subtotal, PayPal Fee Estimate, Total */}
            <div className="space-y-2 text-xs">
              {/* 1. Cart Subtotal */}
              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{t.cartSubtotal}</span>
                  <span className="text-[10px] text-stone-400">({items.reduce((acc, it) => acc + it.quantity, 0)} items fulfilled)</span>
                </div>
                <div className="font-mono font-bold text-stone-900 text-right">
                  <span>{currency.symbol}{subtotalCurrency.toFixed(2)} {currency.code}</span>
                  <span className="text-[10px] text-stone-400 block font-normal">({subtotalETB.toLocaleString()} ETB)</span>
                </div>
              </div>

              {/* 2. PayPal Fee Estimate */}
              <div className="flex items-center justify-between text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span>{t.paypalFeeEstimate}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                    {t.estimateTag}
                  </span>
                </div>
                <span className="font-mono font-semibold text-stone-700">
                  ~{currency.symbol}{paypalFeeEstimate.toFixed(2)} {currency.code}
                </span>
              </div>

              {/* 3. Delivery / Dispatch Fee */}
              <div className="flex items-center justify-between text-stone-600">
                <span className="text-stone-500">Local Dispatch & SMS Notifications</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {isFreeDelivery ? 'FREE (0.00)' : `${currency.symbol}${serviceFeeCurrency.toFixed(2)}`}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-stone-200 pt-2 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-stone-900 text-sm">{t.totalToPay}</span>
                  <span className="text-[11px] text-stone-500 ml-1.5 font-normal">
                    (Charged securely in USD)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-stone-900 text-base sm:text-lg">
                    {currency.symbol}{totalCurrency.toFixed(2)} {currency.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    {subtotalETB.toLocaleString()} ETB Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Why This Matters Explanatory Callout */}
            <div className="p-3 rounded-xl bg-white/90 border border-emerald-200 text-[11px] text-stone-700 leading-relaxed space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{t.whyThisMatters}: Zero Hidden Remittance Haircut</span>
              </div>
              <p className="text-stone-600 pl-5">
                {t.whyThisMattersDesc}
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* UPGRADED AI SAFETY CHECK (Low / Medium / High + Re-confirm) */}
          {/* ======================================================== */}
          {safetyLoading ? (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5 text-xs text-stone-600">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
              <span>AI Safety Auditor is evaluating transfer risk level, vendor integrity, and urgency language...</span>
            </div>
          ) : isHighRisk ? (
            /* HIGH RISK CARD - REQUIRES USER RE-CONFIRMATION */
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-rose-500 bg-rose-50/95 text-xs space-y-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 shadow-xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-rose-600 text-white">
                        {t.riskHigh}
                      </span>
                      <span className="text-[11px] font-bold text-rose-900">
                        {t.safetyCheckTitle}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-rose-950 text-xs sm:text-sm mt-0.5">
                      {t.highRiskConfirmWarning}
                    </h4>
                  </div>
                </div>
              </div>

              {/* One-Sentence Reason */}
              <div className="p-3 rounded-xl bg-white border border-rose-200 text-rose-950 text-xs font-semibold leading-relaxed shadow-2xs">
                <span className="text-rose-600 uppercase font-black text-[10px] tracking-wider block mb-1">
                  1-Sentence Auditor Reason:
                </span>
                "{safetyResult?.reason || safetyResult?.reasoning}"
              </div>

              {/* Recommended Action */}
              <div className="p-2.5 rounded-xl bg-rose-100/80 border border-rose-300 text-rose-900 text-xs flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-950 block">
                    {t.recommendedActionLabel}:
                  </span>
                  <span className="text-rose-900 font-medium text-[11px]">
                    {safetyResult?.recommendedAction || 'Call your recipient directly in Ethiopia via phone to verify emergency claims before authorizing payment.'}
                  </span>
                </div>
              </div>

              {/* Flagged Triggers if any */}
              {safetyResult?.flaggedTriggers && safetyResult.flaggedTriggers.length > 0 && (
                <div className="space-y-1 pl-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    Detected Risk Factors:
                  </span>
                  <div className="space-y-1">
                    {safetyResult.flaggedTriggers.map((trig, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-rose-900 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{trig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HIGH RISK MANDATORY RE-CONFIRMATION CHECKBOX */}
              <div className="pt-2 border-t border-rose-200">
                <label className="flex items-start gap-3 cursor-pointer select-none bg-white p-3 rounded-xl border-2 border-rose-400 hover:border-rose-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={userReconfirmedHighRisk}
                    onChange={(e) => {
                      setUserReconfirmedHighRisk(e.target.checked);
                      if (e.target.checked) setErrorMsg(null);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-rose-400 text-rose-600 focus:ring-rose-500 shrink-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">
                      {t.highRiskConfirmCheckbox}
                    </span>
                    <span className="text-[11px] text-rose-700 font-medium block mt-0.5">
                      Required for high-risk transfer unlock.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          ) : isMediumRisk ? (
            /* MEDIUM RISK CARD */
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-xs space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950">
                      {t.riskMedium}
                    </span>
                    <h4 className="font-bold text-amber-950 text-xs mt-0.5">
                      {t.safetyCheckTitle} • Moderate Check
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-amber-200 text-amber-950 text-xs font-semibold leading-relaxed">
                <span className="text-amber-700 uppercase font-black text-[10px] tracking-wider block mb-0.5">
                  1-Sentence Reason:
                </span>
                "{safetyResult?.reason || safetyResult?.reasoning}"
              </div>

              <div className="p-2.5 rounded-lg bg-amber-100/70 text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-950">{t.recommendedActionLabel}:</span>
                  <span className="text-[11px] font-medium">{safetyResult?.recommendedAction || 'Review recipient delivery details and meter number.'}</span>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-2 border-t border-amber-200">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={userConfirmedSafety}
                    onChange={(e) => {
                      setUserConfirmedSafety(e.target.checked);
                      if (e.target.checked) setErrorMsg(null);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-950 leading-snug">
                    {t.iConfirmSafe}
                  </span>
                </label>
              </div>
            </div>
          ) : (
            /* LOW RISK CARD */
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900 border border-emerald-300">
                    {t.riskLow}
                  </span>
                  <span className="font-bold text-emerald-900 text-xs">
                    {t.safetyCheckTitle} Passed
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-900 font-semibold pl-6">
                "{safetyResult?.reason || safetyResult?.reasoning || 'This transaction follows normal household transfer limits with verified delivery parameters.'}"
              </p>

              <div className="pl-6 text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{safetyResult?.recommendedAction || 'Verified routine order; safe to proceed to checkout.'}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              
              {/* Pay with PayPal Button Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'paypal'
                    ? 'border-[#0070BA] bg-blue-50/70 text-[#003087] ring-2 ring-[#0070BA]/20 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1 text-[#003087] font-black text-sm">
                  <span className="text-[#003087]">Pay</span>
                  <span className="text-[#0070BA]">Pal</span>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 uppercase tracking-wider">
                  SANDBOX
                </span>
              </button>

              {/* Card Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit</span>
              </button>

              {/* Apple / Google Pay Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  paymentMethod === 'apple_pay' || paymentMethod === 'google_pay'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span>Wallets (Apple/Google)</span>
              </button>
            </div>
          </div>

          {/* Sender Details Form */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Sender Details (Diaspora Supporter)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                  placeholder="e.g. Abel Kebede"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Your Email (for confirmation)
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                  placeholder="e.g. abel.diaspora@gmail.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* If safety check is blocked, show alert notice before payment controls */}
          {isBlockedBySafety && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {isHighRisk ? t.highRiskLockedMessage : 'Payment is locked pending your confirmation of the AI Safety Alert above. Check the box to unlock payment.'}
              </span>
            </div>
          )}

          {/* PAYPAL SANDBOX COMPONENT */}
          {paymentMethod === 'paypal' && (
            <div className={`pt-2 transition-opacity ${isBlockedBySafety ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <PayPalButton
                items={items}
                currency={currency}
                totalUSD={totalCurrency}
                senderName={senderName}
                senderEmail={senderEmail}
                onPaymentSuccess={onCheckoutSuccess}
                onError={(err) => setErrorMsg(err)}
              />
            </div>
          )}

          {/* CARD FORM */}
          {paymentMethod === 'card' && (
            <form onSubmit={handlePayCardOrWallet} className="space-y-4 pt-1">
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 pl-9 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isBlockedBySafety}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Card Authorization...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>Pay {currency.symbol}{totalCurrency.toFixed(2)} with Card</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* WALLET BUTTONS */}
          {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePayCardOrWallet}
                disabled={isSubmitting || isBlockedBySafety}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Pay {currency.symbol}{totalCurrency.toFixed(2)} with 1-Click Wallet</span>
              </button>
            </div>
          )}

          {/* Recipient SMS Dispatch Preview */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Instant Recipient Notification Preview:</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Upon capture, an automated SMS notification (and instant 20-digit EEU power token) will be generated and dispatched to:
            </p>
            <div className="space-y-1">
              {Array.from(new Set(items.map((i) => `${i.recipient.name} (${i.recipient.phone})`))).map((rec, i) => (
                <div key={i} className="text-stone-700 font-mono text-[11px] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
