import React, { useState } from 'react';
import { OrderRecord } from '../types';
import { 
  CheckCircle, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Phone, 
  Zap, 
  Truck, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../utils/translations';

interface OrderConfirmationModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecipientView?: (order: OrderRecord) => void;
  language?: Language;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenRecipientView,
  language = 'en',
}) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];

  if (!isOpen || !order) return null;

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleCopyAll = () => {
    const fullText = `DiasporaPay Order #${order.orderNumber}\n\n` +
      order.smsDispatches.map((d) => 
        `To: ${d.recipientName} (${d.recipientPhone})\n${d.messageText}\n${d.token ? `TOKEN: ${d.token}` : ''}`
      ).join('\n\n----------------\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Selam! I just sent you support via DiasporaPay (Order #${order.orderNumber}).\n\n` +
      order.smsDispatches.map((d) => `${d.messageText}\n${d.token ? `⚡ Meter Token: ${d.token}` : ''}`).join('\n\n');
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Success Banner */}
        <div className="p-6 bg-linear-to-b from-emerald-800 to-emerald-950 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/30 text-amber-300 ring-4 ring-emerald-500/20 mb-3 shadow-lg">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Order Confirmed & Fulfilled!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            እግዚአብሔር ይስጥልኝ! Notifications and tokens have been generated and sent to your family in Ethiopia.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono backdrop-blur-xs border border-white/20">
            <span>Order #{order.orderNumber}</span>
            <span>•</span>
            <span>Total: {order.currency.symbol}{order.totalCurrency.toFixed(2)} ({order.subtotalETB.toLocaleString()} ETB)</span>
          </div>
        </div>

        {/* Content: Receipt details & Simulated Ethiopian SMS Cards */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-[#FAF8F5]">
          
          {/* Dedicated PayPal Sandbox Receipt Card if paid with PayPal */}
          {order.paypalDetails && (
            <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center font-black text-sm text-[#003087]">
                    <span className="text-[#003087]">Pay</span>
                    <span className="text-[#0070BA]">Pal</span>
                  </div>
                  <span className="bg-amber-400 text-stone-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    SANDBOX
                  </span>
                </div>

                {/* EXACT BADGE REQUIRED: "Verified via PayPal Sandbox" */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs self-start sm:self-auto">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified via PayPal Sandbox</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 text-[11px] block">PayPal Transaction ID:</span>
                  <span className="font-mono font-bold text-stone-900 select-all">
                    {order.paypalDetails.captureId || order.paypalDetails.orderId}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Capture Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {order.paypalDetails.status || 'COMPLETED'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Payer Email:</span>
                  <span className="font-medium text-stone-900 select-all">
                    {order.paypalDetails.payerEmail || order.senderEmail}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Payer Name:</span>
                  <span className="font-medium text-stone-900">
                    {order.paypalDetails.payerName || order.senderName}
                  </span>
                </div>
              </div>

              {order.paypalDetails.recipientDescription && (
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                  <span>PayPal Order Description: </span>
                  <strong className="text-stone-700">{order.paypalDetails.recipientDescription}</strong>
                </div>
              )}

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Captured Amount in USD:</span>
                <span className="font-black text-stone-900 text-sm">
                  {order.currency.symbol}{order.totalCurrency.toFixed(2)} USD
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                Generated SMS Dispatches to Ethiopia
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="text-xs font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied All' : 'Copy All SMS'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* SMS Dispatch List */}
          <div className="space-y-3">
            {order.smsDispatches.map((sms, index) => (
              <div
                key={index}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">
                      To: {sms.recipientName}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      ({sms.recipientPhone})
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Delivered via SMS
                  </span>
                </div>

                {/* Simulated SMS Message Bubble */}
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-stone-800 font-sans leading-relaxed">
                  <p className="whitespace-pre-wrap">{sms.messageText}</p>

                  {/* Highlighted 20-digit STS Token if Electricity */}
                  {sms.token && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          20-Digit EEU Keypad STS Token
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold tracking-widest text-white mt-0.5">
                          {sms.token}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyToken(sms.token!)}
                        className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {copiedToken === sms.token ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Token</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Tracking link if physical delivery */}
                  {sms.trackingId && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Tracking: <strong className="font-mono text-stone-800">{sms.trackingId}</strong></span>
                      <span>• Driver Abebe (Addis Dispatch)</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            Receipt sent to <strong className="text-stone-800">{order.senderEmail}</strong>
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenRecipientView && (
              <button
                type="button"
                onClick={() => onOpenRecipientView(order)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Generate and view mobile-friendly family recipient page"
              >
                <Share2 className="w-4 h-4 text-stone-900" />
                <span>{t.shareWithFamily}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {t.doneBackToChat}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
