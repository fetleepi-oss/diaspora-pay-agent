import React, { useState } from 'react';
import { OrderRecord } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { 
  Heart, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  Phone, 
  Zap, 
  Truck, 
  MapPin, 
  MessageCircle, 
  Send, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Store,
  Calendar,
  Layers
} from 'lucide-react';

interface RecipientShareViewProps {
  order: OrderRecord;
  language: Language;
  onClose: () => void;
  onLanguageChange?: (lang: Language) => void;
}

export const RecipientShareView: React.FC<RecipientShareViewProps> = ({
  order,
  language,
  onClose,
  onLanguageChange,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];

  // Default heartfelt Gemini blessing in Amharic if not already present on order
  const defaultAmharicGreeting = order.amharicGreeting || 
    `ሰላም እማዬ! ይህ ስጦታ ከውጭ አገር በፍቅር እና በናፍቆት የተላከ ነው። በደብረዘይት እህል ነጋዴዎች እና በኢትዮጵያ ኤሌክትሪክ አገልግሎት በኩል ወደ ቤታችሁ በፍጥነት እንዲደርስ ተዘጋጅቷል። እግዚአብሔር ጤናና ሰላም ይስጣችሁ፤ ሁሌም በልቤ ውስጥ ናችሁ!`;

  const primaryRecipient = order.smsDispatches?.[0]?.recipientName || order.items?.[0]?.recipient?.name || 'ውድ ቤተሰቦቼ';
  const primaryPhone = order.smsDispatches?.[0]?.recipientPhone || order.items?.[0]?.recipient?.phone || '+251 91 123 4567';
  const primaryCity = order.items?.[0]?.recipient?.city || 'Addis Ababa';
  const primarySubcity = order.items?.[0]?.recipient?.subcity || 'Bole';

  const shareableUrl = `${window.location.origin}${window.location.pathname}#recipient-view?order=${order.orderNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const shareText = `ሰላም ${primaryRecipient}! ከውጭ አገር የተላከልዎ የDiasporaPay ድጋፍ መረጃ (ትዕዛዝ #${order.orderNumber}):\n\n"${defaultAmharicGreeting}"\n\nሙሉ መረጃውንና የመብራት ቶከኑን በዚህ ሊንክ ይመልከቱ: ${shareableUrl}`;

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSMS = () => {
    window.open(`sms:${primaryPhone}?body=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Check if order has STS power tokens
  const tokenDispatch = order.smsDispatches?.find((d) => d.token);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-sans">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Top bar with back button & language toggle */}
        <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{t.backToDiasporaPay}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300">
              #{order.orderNumber}
            </span>
            {onLanguageChange && (
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'am' : 'en')}
                className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white transition-colors"
                title="Switch Language"
              >
                {language === 'en' ? 'አማርኛ' : 'English'}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Hero Banner: Sent with love from Diaspora */}
          <div className="rounded-2xl bg-linear-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 sm:p-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                <Heart className="w-3 h-3 fill-amber-300" />
                {t.giftFromDiaspora}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full ml-auto">
                <CheckCircle2 className="w-3 h-3" />
                {t.statusDelivered}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
              {primaryRecipient}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{primaryCity}, {primarySubcity} • {primaryPhone}</span>
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
              <span>{t.sentBy}: <strong className="text-white">{order.senderName}</strong></span>
              <span className="text-[11px] opacity-80">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Heartfelt Amharic Message Written by Gemini AI */}
          <div className="rounded-2xl bg-white border border-amber-200/80 p-5 shadow-xs relative">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {t.geminiBlessingTitle}
                </h2>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-mono px-2 py-0.5 rounded border border-amber-200">
                Gemini 3.8 Flash
              </span>
            </div>

            <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/70 whitespace-pre-wrap">
              "{defaultAmharicGreeting}"
            </p>
          </div>

          {/* If EEU Prepaid Power Token: Dedicated High-Visibility Card */}
          {tokenDispatch && tokenDispatch.token && (
            <div className="rounded-2xl bg-emerald-950 text-white p-5 border border-emerald-500/40 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {t.meterTokenLabel}
                    </h3>
                    <p className="text-[11px] text-emerald-300">
                      Ethiopian Electric Utility (EEU) STS Keypad Code
                    </p>
                  </div>
                </div>
              </div>

              {/* Big readable 20-digit token */}
              <div className="my-3 p-3.5 rounded-xl bg-black/40 border border-emerald-600/40 text-center">
                <div className="font-mono text-xl sm:text-2xl font-black tracking-widest text-amber-300 select-all">
                  {tokenDispatch.token}
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  {t.directKeypadInstructions}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyToken(tokenDispatch.token!)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
              >
                {copiedToken === tokenDispatch.token ? (
                  <>
                    <Check className="w-4 h-4 text-stone-900" />
                    <span>{t.tokenCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-900" />
                    <span>{t.copyToken} ({tokenDispatch.token})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Items & Services Breakdown */}
          <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.itemsListTitle}</span>
            </h3>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      {item.quantity}x {language === 'am' && item.nameAmharic ? item.nameAmharic : item.name}
                    </div>
                    {item.nameAmharic && language === 'en' && (
                      <div className="text-[11px] text-stone-500 font-serif">
                        {item.nameAmharic}
                      </div>
                    )}
                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-stone-400" />
                      <span>{t.vendorLabel} <strong>{item.category === 'utilities' ? 'Ethiopian Electric Utility (EEU)' : (item.category === 'groceries' ? 'Ada Debre Zeit Grain Traders' : 'Official Ethiopian Partner')}</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.fulfillmentType === 'sms_token' ? '⚡ SMS Token' : '🚚 Doorstep Delivery'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification and Courier note */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium text-[11px]">Fulfilled via DiasporaPay Addis Courier</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-stone-700">
                Total: {order.currency.symbol}{order.totalCurrency.toFixed(2)} ({order.subtotalETB.toLocaleString()} ETB)
              </span>
            </div>
          </div>

          {/* 1-Click Family Share Actions */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.shareWithFamily}</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-medium">
                Read-only family link
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.shareViaWhatsApp}</span>
              </button>

              <button
                type="button"
                onClick={handleTelegram}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.shareViaTelegram}</span>
              </button>

              <button
                type="button"
                onClick={handleSMS}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{t.shareViaSMS}</span>
              </button>
            </div>

            {/* Copyable Share URL bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-white border border-stone-200 text-stone-600 text-xs rounded-xl px-3 py-2 font-mono truncate select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyShareLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span className="text-[11px]">
            DiasporaPay • Verified Ethiopian Support Network
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {t.doneBackToChat}
          </button>
        </div>

      </div>
    </div>
  );
};
