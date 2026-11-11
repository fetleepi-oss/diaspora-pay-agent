import React, { useEffect, useRef, useState } from 'react';
import { CartItem, Currency, OrderRecord, Recipient } from '../types';
import confetti from 'canvas-confetti';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  RotateCcw, 
  XCircle, 
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info
} from 'lucide-react';

interface PayPalButtonProps {
  items: CartItem[];
  currency: Currency;
  totalUSD: number;
  senderName: string;
  senderEmail: string;
  recipient?: Recipient;
  onPaymentSuccess: (order: OrderRecord) => void;
  onError?: (errorMsg: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({
  items,
  currency,
  totalUSD,
  senderName,
  senderEmail,
  recipient,
  onPaymentSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsInstanceRef = useRef<any>(null);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  
  // Friendly error states
  const [errorType, setErrorType] = useState<'declined' | 'cancelled' | 'network' | 'credentials' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Offline demo mode toggle (default: OFF, real sandbox mode)
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [sandboxConfig, setSandboxConfig] = useState<{ clientId: string; isConfigured: boolean }>({
    clientId: 'sb',
    isConfigured: false,
  });

  // Fetch PayPal config from server
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/paypal/config');
      const data = await res.json();
      if (data.clientId) {
        setSandboxConfig({
          clientId: data.clientId,
          isConfigured: Boolean(data.isConfigured),
        });
      }
    } catch (err) {
      console.warn('Could not fetch PayPal config from server:', err);
    } finally {
      setConfigLoaded(true);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Initialize official PayPal JS SDK Buttons
  const renderPayPalButtons = () => {
    if (!window.paypal || !containerRef.current) return;

    if (buttonsInstanceRef.current && typeof buttonsInstanceRef.current.close === 'function') {
      try {
        buttonsInstanceRef.current.close().catch(() => {});
      } catch {
        // ignore zoid close errors
      }
      buttonsInstanceRef.current = null;
    }

    containerRef.current.innerHTML = '';
    setErrorType(null);
    setErrorMessage(null);

    try {
      const instance = window.paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 46,
          },
          // 1. Create order server-side with line items & recipient in description
          createOrder: async () => {
            setIsProcessing(true);
            setErrorType(null);
            setErrorMessage(null);

            try {
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items,
                  currency,
                  totalUSD,
                  recipient,
                  senderName,
                  senderEmail,
                  isDemoMode: false, // Strict real sandbox
                }),
              });

              const data = await res.json();

              if (!res.ok) {
                if (data.needsCredentials) {
                  setErrorType('credentials');
                  throw new Error(data.error || 'PayPal Sandbox credentials not configured in environment.');
                }
                setErrorType('declined');
                throw new Error(data.error || 'PayPal Orders v2 rejected order creation.');
              }

              if (data.id || data.orderID) {
                return data.id || data.orderID;
              }

              throw new Error('PayPal did not return an order ID.');
            } catch (err: any) {
              console.error('PayPal createOrder error:', err);
              setIsProcessing(false);
              const message = err.message || 'Network failure while communicating with PayPal Orders v2.';
              setErrorMessage(message);
              if (!errorType) setErrorType('network');
              if (onError) onError(message);
              throw err;
            }
          },

          // 2. Capture order server-side via Orders v2 capture API
          onApprove: async (data: any) => {
            setIsProcessing(true);
            try {
              const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderID: data.orderID,
                  items,
                  currency,
                  senderName,
                  senderEmail,
                  recipient,
                  isDemoMode: false,
                }),
              });

              const captureResult = await res.json();

              if (!res.ok) {
                setErrorType('declined');
                throw new Error(captureResult.error || 'PayPal payment capture was declined.');
              }

              if (captureResult.success && captureResult.order) {
                confetti({
                  particleCount: 100,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#0070BA', '#009639', '#FED100', '#D92B2B'],
                });
                onPaymentSuccess(captureResult.order);
              } else {
                throw new Error(captureResult.error || 'Failed to capture PayPal payment.');
              }
            } catch (err: any) {
              console.error('PayPal capture error:', err);
              setIsProcessing(false);
              setErrorType('declined');
              const msg = err.message || 'PayPal payment capture was declined or failed.';
              setErrorMessage(msg);
              if (onError) onError(msg);
            }
          },

          // 3. Handle cancellation
          onCancel: () => {
            setIsProcessing(false);
            setErrorType('cancelled');
            setErrorMessage('Payment cancelled, your cart is safe.');
          },

          // 4. Handle SDK error callback
          onError: (err: any) => {
            setIsProcessing(false);
            console.warn('PayPal Buttons SDK error:', err);
            setErrorType('declined');
            setErrorMessage('PayPal Sandbox reported an error or the test card was declined. Please check your credentials or retry.');
          },
        });

      buttonsInstanceRef.current = instance;
      if (containerRef.current) {
        instance.render(containerRef.current).catch((err: any) => {
          if (err?.message && !String(err.message).includes('zoid destroyed')) {
            console.warn('PayPal render error:', err);
          }
        });
      }

      setSdkLoaded(true);
      setSdkLoading(false);
    } catch (err: any) {
      console.warn('Error rendering PayPal Buttons:', err);
      setSdkLoading(false);
      setErrorType('network');
      setErrorMessage('Could not initialize PayPal JS SDK buttons. Please check your connection or retry.');
    }
  };

  // Load SDK Script once config is loaded
  useEffect(() => {
    if (!configLoaded) return;
    let isMounted = true;
    const scriptId = 'paypal-js-sdk-live';
    const existingScript = document.getElementById(scriptId);

    const init = () => {
      if (isMounted) renderPayPalButtons();
    };

    if (window.paypal) {
      init();
    } else if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      const client = sandboxConfig.clientId || 'sb';
      script.src = `https://www.paypal.com/sdk/js?client-id=${client}&currency=USD&intent=capture`;
      script.async = true;

      script.onload = () => {
        if (isMounted) init();
      };

      script.onerror = () => {
        console.warn('PayPal JS SDK script failed to load from paypal.com.');
        if (isMounted) {
          setSdkLoading(false);
          setErrorType('network');
          setErrorMessage('Network failure loading PayPal JS SDK from paypal.com. Please check adblockers or internet connection.');
        }
      };

      document.body.appendChild(script);
    } else {
      existingScript.addEventListener('load', init);
    }

    return () => {
      isMounted = false;
      if (existingScript) {
        existingScript.removeEventListener('load', init);
      }
      if (buttonsInstanceRef.current && typeof buttonsInstanceRef.current.close === 'function') {
        try {
          buttonsInstanceRef.current.close().catch(() => {});
        } catch {
          // ignore
        }
        buttonsInstanceRef.current = null;
      }
    };
  }, [configLoaded, sandboxConfig.clientId, items, currency, totalUSD, senderName, senderEmail, recipient]);

  // Retry handler
  const handleRetry = () => {
    setErrorType(null);
    setErrorMessage(null);
    setIsProcessing(false);
    renderPayPalButtons();
  };

  // Offline Demo Mode Test Flow (ONLY accessible when toggle is explicitly enabled)
  const handleOfflineDemoTest = async () => {
    setIsProcessing(true);
    setErrorType(null);
    setErrorMessage(null);
    try {
      // 1. Create simulated demo order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          currency,
          totalUSD,
          senderName,
          senderEmail,
          recipient,
          isDemoMode: true,
        }),
      });
      const createData = await createRes.json();

      // 2. Capture demo order
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: createData.orderID,
          items,
          currency,
          senderName,
          senderEmail,
          recipient,
          isDemoMode: true,
        }),
      });

      const captureData = await captureRes.json();
      if (captureData.success && captureData.order) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0070BA', '#009639', '#FED100', '#D92B2B'],
        });
        onPaymentSuccess(captureData.order);
      } else {
        throw new Error(captureData.error || 'Offline demo capture failed.');
      }
    } catch (err: any) {
      setErrorType('network');
      setErrorMessage(err.message || 'Offline demo simulation error.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3.5">
      
      {/* VISIBLE SANDBOX BANNER AS REQUIRED */}
      <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/90 p-3.5 text-xs text-amber-950 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black uppercase tracking-wide text-amber-900 text-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded font-black tracking-wider text-[11px]">
              SANDBOX – test payment, no real money
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            Orders v2 API
          </span>
        </div>
        
        <p className="mt-2 text-amber-900 leading-relaxed font-medium">
          Payments are created and captured in <strong>PayPal Sandbox mode</strong> using the PayPal Orders v2 API with cart line items and recipient details.
        </p>

        <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-1 text-[11px] text-amber-800">
          <span>Target Recipient: <strong className="text-stone-900 font-semibold">{recipient?.name || 'Mom in Addis Ababa'}</strong></span>
          <span className="font-semibold text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secret securely in backend .env
          </span>
        </div>
      </div>

      {/* FRIENDLY ERROR MESSAGES & RETRY BUTTON (Declined, Cancelled, Network Failure) */}
      {errorMessage && (
        <div className={`p-4 rounded-xl text-xs space-y-2.5 border shadow-2xs ${
          errorType === 'cancelled' 
            ? 'bg-amber-50 border-amber-300 text-amber-950' 
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-start gap-2">
            {errorType === 'cancelled' ? (
              <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold block text-sm">
                {errorType === 'cancelled' && 'PayPal Checkout Cancelled'}
                {errorType === 'declined' && 'Payment Declined by PayPal'}
                {errorType === 'network' && 'Connection / Network Failure'}
                {errorType === 'credentials' && 'Sandbox Credentials Needed'}
              </span>
              <p className="leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Payment</span>
            </button>
            <span className="text-[11px] text-stone-500">
              Your cart items remain safe in your cart.
            </span>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
          <span className="font-bold">
            Communicating with PayPal Orders v2 Sandbox...
          </span>
        </div>
      )}

      {/* REAL PAYPAL JS SDK BUTTON CONTAINER (DEFAULT FLOW) */}
      <div className="relative min-h-[50px] bg-white rounded-xl p-1">
        {sdkLoading && !sdkLoaded && (
          <div className="flex items-center justify-center py-4 gap-2 text-xs text-stone-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading PayPal JS SDK Sandbox Buttons...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full" />
      </div>

      {/* ========================================================== */}
      {/* OFFLINE DEMO MODE TOGGLE (FAKE FALLBACK IS BEHIND THIS ONLY) */}
      {/* ========================================================== */}
      <div className="pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 transition-colors">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <div>
              <span className="font-bold text-xs text-stone-800 block">
                Offline demo mode
              </span>
              <span className="text-[10px] text-stone-500 block">
                Simulate successful capture without calling live PayPal Sandbox APIs
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => setIsDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070BA]"></div>
          </label>
        </div>

        {/* Demo button ONLY visible when toggle is ON */}
        {isDemoMode && (
          <div className="mt-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Offline Demo Mode Active</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Use this if your PayPal credentials are not yet configured in <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">.env</code>. It creates and captures an order locally using the exact same Orders v2 schema.
            </p>
            <button
              type="button"
              onClick={handleOfflineDemoTest}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Execute Simulated Sandbox Order (${totalUSD.toFixed(2)} USD)</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
