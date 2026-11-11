import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CatalogItem, Currency, Recipient, StructuredAgentResponse, StructuredAgentItem, HumanApprovalRequest } from '../types';
import { CATALOG_ITEMS } from '../data/catalog';
import { MOCK_CATALOG_15 } from '../data/mockCatalog15';
import { 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Plus, 
  Check, 
  HelpCircle, 
  Clock, 
  Code2, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  ShoppingBag,
  RotateCcw,
  Store,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock
} from 'lucide-react';

import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { createTranslator, getLanguageMeta } from '../i18n';
import { getInitials } from '../lib/formatters';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  currency: Currency;
  activeRecipient: Recipient;
  onAddToCart: (item: CatalogItem, recipient: Recipient, customDetails?: any) => void;
  onAddStructuredItemsToCart: (items: StructuredAgentItem[], notes?: string) => void;
  onClearChat: () => void;
  onOpenAgentActivity?: () => void;
  onApprovePayment?: (approval: HumanApprovalRequest) => void;
  onOpenOnboarding?: () => void;
  language: Language;
}

const QUICK_PROMPTS_EN = [
  { label: '🌾 1. Teff & Electricity: 25kg + $15 Power', prompt: 'I want to send 25kg injera flour and $15 EEU electricity top-up to my mom in Bole.' },
  { label: '📚 2. School Supplies: 20 Notebooks + $10 Airtime', prompt: 'Order 20 school notebooks and $10 Ethio Telecom airtime for Dawit.' },
  { label: '💳 3. Checkout: Test Human-in-the-Loop Approval', prompt: 'I want to checkout and pay for this cart with PayPal now.' },
  { label: '📦 4. Tracking: Lookup Order #ET-DP-819204', prompt: 'What is the delivery status of order ET-DP-819204?' },
  { label: '🚨 5. Safety Audit: Urgent Extortion & $330 Sheep', prompt: 'URGENT emergency! Power cutoff in 10 minutes, must send $250 EEU electricity immediately or big fine!' },
  { label: '❓ 6. Ambiguity Test: "Send some flour"', prompt: 'I want to send some injera flour to my family.' },
];

const QUICK_PROMPTS_AM = [
  { label: '🌾 1. ጤፍ እና መብራት: 25 ኪ.ግ + $15 ቶከን', prompt: 'ለእናቴ 25 ኪ.ግ ነጭ ማኛ ጤፍ እና የ$15 የመብራት ቶከን ወደ ቦሌ ላክ።' },
  { label: '📚 2. የትምህርት ዕቃዎች: 20 ደብተር + $10 አየር ሰዓት', prompt: '20 የተማሪ ደብተር እና የ$10 የኢትዮ ቴሌኮም ካርድ ለዳዊት አዝዝ።' },
  { label: '💳 3. ክፍያ: የሰው ማረጋገጫ (Human-in-the-Loop)', prompt: 'አሁን የቅርጫቱን ክፍያ በPayPal Sandbox መክፈል እፈልጋለሁ።' },
  { label: '📦 4. ክትትል: የትዕዛዝ #ET-DP-819204 ሁኔታ', prompt: 'የትዕዛዝ ET-DP-819204 የማድረስ ሁኔታ ምን ደረጃ ላይ ደርሷል?' },
  { label: '🚨 5. የአይ ደህንነት: አጣዳፊ ግፊት እና ትልቅ ገንዘብ', prompt: 'አስቸኳይ ችግር! መብራት በ10 ደቂቃ ውስጥ ሊቋረጥ ነው፤ ወዲያውኑ የ$250 ቶከን ካልተላከ ይቀጣሉ!' },
  { label: '❓ 6. ያልተለየ ጥያቄ: "ጤፍ ላክ"', prompt: 'ለቤተሰቦቼ የደብረዘይት ጤፍ መላክ እፈልጋለሁ።' },
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isLoading,
  currency,
  activeRecipient,
  onAddToCart,
  onAddStructuredItemsToCart,
  onClearChat,
  onOpenAgentActivity,
  onApprovePayment,
  onOpenOnboarding,
  language,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'am-ET' | 'en-US'>(language === 'am' ? 'am-ET' : 'en-US');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [expandedJsonMsgId, setExpandedJsonMsgId] = useState<string | null>(null);
  const [copiedJsonMsgId, setCopiedJsonMsgId] = useState<string | null>(null);
  const [addedStructuredMsgId, setAddedStructuredMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];
  const quickPrompts = language === 'am' ? QUICK_PROMPTS_AM : QUICK_PROMPTS_EN;

  // Keep voice language aligned with active UI language
  useEffect(() => {
    setVoiceLang(language === 'am' ? 'am-ET' : 'en-US');
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText;
    setInputText('');
    onSendMessage(textToSend);
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice(
        language === 'am'
          ? 'ይህ አሳሽ የWeb Speech API የድምፅ ግብዓትን አይደግፍም። እባክዎ በአማርኛ ወይም English ይተይቡ (ለምሳሌ: "ለእማማ 25 ኪ.ግ ጤፍ ላክ")።'
          : 'The Web Speech API is not supported in this browser environment. You can type directly in English or Amharic.'
      );
      return;
    }

    try {
      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      setVoiceNotice(null);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getLanguageMeta(language).speechCode || voiceLang;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputText((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice(
            language === 'am' 
              ? 'የማይክሮፎን ፈቃድ ተከልክሏል። እባክዎ በአሳሽዎ የማይክሮፎን ፈቃድ ይስጡ ወይም ይተይቡ።' 
              : 'Microphone permission was denied. Please allow microphone access or type your request.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyJson = (msgId: string, structured: StructuredAgentResponse) => {
    navigator.clipboard.writeText(JSON.stringify(structured, null, 2));
    setCopiedJsonMsgId(msgId);
    setTimeout(() => setCopiedJsonMsgId(null), 2500);
  };

  const handleAddAllToCart = (msgId: string, structured: StructuredAgentResponse) => {
    onAddStructuredItemsToCart(structured.items, structured.delivery_notes);
    setAddedStructuredMsgId(msgId);
    setTimeout(() => setAddedStructuredMsgId(null), 2500);
  };

  // Helper to extract clarification quick option buttons
  const extractClarificationOptions = (question: string) => {
    const options: string[] = [];
    if (question.includes('25kg') && question.includes('50kg')) {
      options.push('Injera Flour (Magna White Teff) 25kg ($32.00)');
      options.push('Injera Flour (Magna White Teff) 50kg ($59.00)');
    } else if (question.includes('$15') && question.includes('$25')) {
      options.push('EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)');
      options.push('EEU Electricity Prepaid Top-Up ($25 / ~3,300 ETB)');
    } else if (question.includes('$10') && question.includes('$20')) {
      options.push('Ethio Telecom Airtime & Telebirr Credit ($10)');
      options.push('Ethio Telecom Airtime & Telebirr Credit ($20)');
    } else if (question.toLowerCase().includes('ride') && question.toLowerCase().includes('feres')) {
      options.push('Ride Taxi Booking Voucher ($15)');
      options.push('Feres Taxi Digital Ride Credit ($20)');
    } else if (question.toLowerCase().includes('notebook') && question.toLowerCase().includes('backpack')) {
      options.push('School Notebooks & Exercise Books Set (Pack of 20 - $16)');
      options.push('Complete School Backpack & Stationery Kit ($26)');
    }
    return options;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] sm:h-[calc(100vh-4.5rem)] bg-[#FAF8F5]">
      
      {/* Top Context Bar */}
      <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
          <span className="font-semibold text-emerald-900">Current Recipient:</span>
          <span className="font-medium text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-200 shadow-2xs">
            {activeRecipient.name} ({activeRecipient.city}{activeRecipient.subcity ? `, ${activeRecipient.subcity}` : ''})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium">
            <Store className="w-3 h-3 text-stone-400" />
            15 Mock Vendor Catalog
          </span>
          <button
            onClick={onClearChat}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors ml-2"
            title="Reset conversation"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Welcome Hero Card */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-linear-to-b from-white to-stone-50 p-6 border border-stone-200 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-600 to-emerald-800 text-white shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-stone-900">
                    {t.welcomeTitle}
                  </h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    {language === 'am' ? 'የተዋቀረ የውጤት ሁነታ' : 'Structured Output Ready'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                  {t.welcomeDescription}
                </p>
              </div>
            </div>

            {/* 3 Prominent 1-Click Example Prompts for Judges */}
            <div className="mt-5 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>
                    {language === 'am' ? 'ለዳኞች የተመረጡ የ1-ጠቅታ የሙከራ ጥያቄዎች:' : 'Try 1-Click Example Prompts (Recommended for Judges):'}
                  </span>
                </p>
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600 rounded px-1"
                  >
                    <span>{language === 'am' ? '📖 መመሪያ (Onboarding)' : '📖 How It Works (3 Steps)'}</span>
                  </button>
                )}
              </div>

              {/* 3 Featured Judge Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePromptClick(
                    language === 'am'
                      ? 'ለእናቴ 25 ኪ.ግ ነጭ ማኛ ጤፍ እና የ$15 የመብራት ቶከን ወደ ቦሌ ላክ።'
                      : 'Send 25kg injera flour and $15 electricity to Mom'
                  )}
                  className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all hover:shadow-xs active:scale-98 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 group-hover:text-emerald-950">
                    <span>🌾</span>
                    <span>{language === 'am' ? 'ጤፍ እና መብራት' : 'Teff + Electricity'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/90 mt-1 font-medium leading-snug">
                    "{language === 'am' ? 'ለእናቴ 25 ኪ.ግ ጤፍ እና $15 መብራት ላክ' : 'Send 25kg injera flour and $15 electricity to Mom'}"
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full">
                    {language === 'am' ? '1-ጠቅታ ሙከራ' : '1-Click Test'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePromptClick(
                    language === 'am'
                      ? '20 የተማሪ ደብተር እና የ$10 የኢትዮ ቴሌኮም ካርድ ለዳዊት አዝዝ።'
                      : 'Order 20 school notebooks and $10 airtime for Dawit'
                  )}
                  className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-left transition-all hover:shadow-xs active:scale-98 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950 group-hover:text-stone-900">
                    <span>📚</span>
                    <span>{language === 'am' ? 'ትምህርት እና ስልክ' : 'School + Airtime'}</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 mt-1 font-medium leading-snug">
                    "{language === 'am' ? '20 የተማሪ ደብተር እና $10 ካርድ ለዳዊት' : 'Order 20 school notebooks and $10 airtime for Dawit'}"
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    {language === 'am' ? '1-ጠቅታ ሙከራ' : '1-Click Test'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePromptClick(
                    language === 'am'
                      ? 'የትዕዛዝ ET-DP-819204 የማድረስ ሁኔታ ምን ደረጃ ላይ ደርሷል?'
                      : 'What is the delivery status of order ET-DP-819204?'
                  )}
                  className="p-3 rounded-xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 text-left transition-all hover:shadow-xs active:scale-98 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-600"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-sky-950 group-hover:text-stone-900">
                    <span>📦</span>
                    <span>{language === 'am' ? 'ክትትል እና ቶከን' : 'Tracking + STS Token'}</span>
                  </div>
                  <p className="text-[11px] text-sky-900/90 mt-1 font-medium leading-snug">
                    "{language === 'am' ? 'የትዕዛዝ ET-DP-819204 ሁኔታ ምን ደረሰ?' : 'What is delivery status of ET-DP-819204?'}"
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-200/70 px-2 py-0.5 rounded-full">
                    {language === 'am' ? '1-ጠቅታ ሙከራ' : '1-Click Test'}
                  </span>
                </button>
              </div>

              {/* Additional Test prompt pills */}
              <div className="mt-4 pt-3 border-t border-stone-200">
                <p className="text-[11px] font-semibold text-stone-500 mb-2">
                  {language === 'am' ? 'ተጨማሪ የሙከራ ጥያቄዎች (የደህንነት ምርመራ፣ የሰው ማረጋገጫ):' : 'Additional Tests (Ambiguity check, Safety alert, PayPal auth):'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.slice(2).map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePromptClick(qp.prompt)}
                      className="text-xs font-medium text-stone-700 bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs transition-all active:scale-95 text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warm Home Greeting, Recipient Card & Category Tiles */}
        {messages.length <= 1 && (
          <div className="mb-6 space-y-4 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-br from-[#0b6e4f]/10 via-white to-[#d9a441]/10 dark:from-[#0b6e4f]/20 dark:via-[#17211e] dark:to-[#d9a441]/10 border border-[#0b6e4f]/20 dark:border-emerald-800/40 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {createTranslator(language)('home.greeting')}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {createTranslator(language)('home.subtitle')}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#1e2b27] px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#0b6e4f] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {getInitials(activeRecipient.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                      {createTranslator(language)('home.supporting')}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {activeRecipient.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activeRecipient.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Category Tiles */}
              <div className="mt-4 pt-4 border-t border-gray-200/70 dark:border-gray-700/60">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5">
                  {createTranslator(language)('home.categories')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: 'cat.groceries', icon: '🌾', prompt: `Send 25kg teff flour and cooking oil to ${activeRecipient.name}` },
                    { key: 'cat.utilities', icon: '⚡', prompt: `Pay $15 electricity bill for ${activeRecipient.name}` },
                    { key: 'cat.school', icon: '📚', prompt: `Pay school supplies for ${activeRecipient.name}` },
                    { key: 'cat.health', icon: '🩺', prompt: `Send a health & pharmacy voucher to ${activeRecipient.name}` },
                    { key: 'cat.rides', icon: '🚕', prompt: `Send a $10 ride voucher to ${activeRecipient.name}` },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => onSendMessage(cat.prompt)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-[#1e2b27] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-800 dark:text-gray-100 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0b6e4f]"
                    >
                      <span className="text-base" aria-hidden="true">{cat.icon}</span>
                      <span className="truncate">{createTranslator(language)(cat.key)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const structured = message.structuredResponse;
          const isJsonExpanded = expandedJsonMsgId === message.id;
          const isJsonCopied = copiedJsonMsgId === message.id;
          const isAddedAll = addedStructuredMsgId === message.id;

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl mx-auto`}
            >
              <div className="flex items-start gap-2.5 max-w-[95%] sm:max-w-[90%]">
                
                {/* Agent Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-700 to-stone-900 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-1 ring-1 ring-emerald-600/30">
                    DP
                  </div>
                )}

                <div className="space-y-3 w-full">
                  
                  {/* Text bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-br-xs'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>

                    {message.textAmharic && !isUser && (
                      <div className="mt-2 pt-2 border-t border-stone-100 text-xs font-medium text-emerald-800 bg-emerald-50/60 p-2 rounded-lg flex items-center justify-between">
                        <span className="font-serif">"{message.textAmharic}"</span>
                        <button
                          onClick={() => handleSpeak(message.text)}
                          className="text-emerald-700 hover:text-emerald-900 p-1"
                          title="Listen to message"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Tool Execution Pill Bar (shows judges which tools Gemini decided to call) */}
                  {!isUser && message.toolActivities && message.toolActivities.length > 0 && (
                    <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          Gemini Tools Called ({message.toolActivities.length}):
                        </span>
                        {onOpenAgentActivity && (
                          <button
                            onClick={onOpenAgentActivity}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                          >
                            View in Agent Activity Panel &rarr;
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {message.toolActivities.map((act) => (
                          <button
                            key={act.id}
                            onClick={onOpenAgentActivity}
                            className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border flex items-center gap-1.5 transition-all shadow-2xs ${
                              act.status === 'awaiting_approval'
                                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                                : act.status === 'success'
                                ? 'bg-white text-stone-800 border-stone-200 hover:border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                            title={act.reasoningNote}
                          >
                            <span>{act.toolName}()</span>
                            {act.durationMs !== undefined && (
                              <span className="text-[10px] text-stone-400">({act.durationMs}ms)</span>
                            )}
                            {act.status === 'awaiting_approval' && (
                              <span className="text-[10px] bg-amber-400 text-stone-900 px-1 rounded font-sans font-bold">
                                Approval Needed
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HUMAN-IN-THE-LOOP AUTHORIZATION CARD */}
                  {!isUser && message.approvalRequest && onApprovePayment && (
                    <div className="rounded-2xl border-2 border-amber-400 bg-linear-to-b from-amber-50 to-amber-100/60 p-4 shadow-sm space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                              Human-in-the-Loop Verification
                            </span>
                            <span className="text-[10px] bg-amber-200/90 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                              Safety Protocol
                            </span>
                          </div>
                          <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                            The agent has prepared a PayPal Sandbox order for <strong>${message.approvalRequest.totalUSD.toFixed(2)} USD</strong> to support <strong>{message.approvalRequest.recipientName}</strong> in Ethiopia.
                          </p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Before the agent can invoke <code className="bg-amber-200 px-1 py-0.5 rounded font-mono text-[10px]">create_paypal_order</code>, you must grant explicit human confirmation.
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-2 border-t border-amber-200/80">
                        <button
                          onClick={() => onApprovePayment(message.approvalRequest!)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve & Create PayPal Order (${message.approvalRequest.totalUSD.toFixed(2)})
                        </button>
                        {onOpenAgentActivity && (
                          <button
                            onClick={onOpenAgentActivity}
                            className="text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-amber-300 text-xs font-medium py-2 px-3 rounded-xl transition-colors"
                          >
                            Inspect Tool Activity
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STRUCTURED RESPONSE CARD (when Gemini returns structured JSON) */}
                  {!isUser && structured && (
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
                      
                      {/* Clarifying Question Banner (if ambiguous) */}
                      {structured.clarifying_question && (
                        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs space-y-2.5">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
                                Clarifying Question from Agent:
                              </span>
                              <p className="text-amber-950 font-medium text-sm mt-0.5">
                                {structured.clarifying_question}
                              </p>
                            </div>
                          </div>

                          {/* Quick clickable options for the clarification */}
                          {extractClarificationOptions(structured.clarifying_question).length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-2">
                              <span className="text-[11px] text-amber-800 font-medium self-center">
                                Select answer:
                              </span>
                              {extractClarificationOptions(structured.clarifying_question).map((opt, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => onSendMessage(opt)}
                                  className="text-xs bg-white text-stone-800 hover:bg-emerald-700 hover:text-white px-2.5 py-1 rounded-lg border border-amber-300 font-semibold shadow-2xs transition-colors"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Plain-Language Summary */}
                      <div className="p-4 bg-stone-50/70 border-b border-stone-200/80">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-700" />
                            Agent Plain-Language Summary
                          </span>
                          <span className="text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 shadow-2xs">
                            Total: ${structured.total_usd.toFixed(2)} USD
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                          {structured.summary}
                        </p>
                      </div>

                      {/* Items List (Matched against 15 mock catalog items) */}
                      {structured.items && structured.items.length > 0 && (
                        <div className="p-4 space-y-2.5">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block">
                            Matched Catalog Items ({structured.items.length})
                          </span>

                          <div className="space-y-2">
                            {structured.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl border border-stone-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-emerald-300 transition-colors"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                                      {item.name}
                                    </h5>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                      {item.category}
                                    </span>
                                  </div>

                                  <div className="mt-1 flex items-center gap-1.5 text-stone-600 text-[11px]">
                                    <Store className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    <span>Verified Vendor:</span>
                                    <strong className="text-stone-900 font-semibold">{item.vendor}</strong>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-extrabold text-stone-900 text-sm">
                                    ${item.price_usd.toFixed(2)} USD
                                  </div>
                                  <div className="text-[10px] text-stone-400">
                                    ~{(item.price_usd * currency.rateToETB).toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Notes */}
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px] uppercase tracking-wider">
                              <Truck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Fulfillment & Delivery Notes:</span>
                            </div>
                            <p className="text-emerald-950 leading-relaxed font-medium">
                              {structured.delivery_notes}
                            </p>
                          </div>

                          {/* Action Bar: Add All to Cart */}
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div className="text-xs text-stone-500">
                              Verified against Ethiopian mock vendor catalog
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddAllToCart(message.id, structured)}
                              disabled={isAddedAll}
                              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isAddedAll
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-95'
                              }`}
                            >
                              {isAddedAll ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Added to Diaspora Cart!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4 text-emerald-200" />
                                  <span>Add All to Cart (${structured.total_usd.toFixed(2)})</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Raw JSON Inspector Accordion */}
                      <div className="border-t border-stone-200 bg-stone-50 px-4 py-2.5 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedJsonMsgId(isJsonExpanded ? null : message.id)}
                          className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 hover:text-stone-900"
                        >
                          <Code2 className="w-3.5 h-3.5 text-stone-500" />
                          <span>Structured JSON Output</span>
                          {isJsonExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyJson(message.id, structured)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-emerald-700 transition-colors"
                        >
                          {isJsonCopied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{isJsonCopied ? 'Copied' : 'Copy JSON'}</span>
                        </button>
                      </div>

                      {/* Expanded JSON Viewer */}
                      {isJsonExpanded && (
                        <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60">
                          <pre>{JSON.stringify(structured, null, 2)}</pre>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] text-stone-400 px-1">
                    {message.timestamp}
                  </span>

                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-1">
                    You
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Polished Loading Skeleton for Gemini Agent */}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-3xl mx-auto animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-700 to-stone-900 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ring-1 ring-emerald-600/30">
              DP
            </div>
            <div className="space-y-2.5 w-full max-w-[90%] sm:max-w-[85%]">
              {/* Agent Thinking Message Bubble */}
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-stone-700 font-semibold ml-1">
                    {language === 'am' 
                      ? 'የጀሚኒ ረዳት ካታሎግ እየፈተሸ እና ተግባራትን እየጠራ ነው...' 
                      : 'Gemini Agent is evaluating catalog vendors & calling functions...'}
                  </span>
                </div>
              </div>

              {/* Shimmering Loading Skeleton Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-stone-200 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-emerald-100 rounded w-16 animate-pulse" />
                </div>
                <div className="space-y-2 pt-1">
                  <div className="h-3 bg-stone-100 rounded w-5/6 animate-pulse" />
                  <div className="h-3 bg-stone-100 rounded w-4/6 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  <div className="h-8 bg-stone-100 rounded-xl animate-pulse" />
                  <div className="h-8 bg-stone-100 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Voice Controls */}
      <div className="bg-white border-t border-stone-200/90 px-4 sm:px-6 lg:px-8 py-3 shadow-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
          
          {/* Graceful Voice Fallback Notification Banner */}
          {voiceNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2 animate-fade-in">
              <span className="flex-1 font-medium">{voiceNotice}</span>
              <button
                type="button"
                onClick={() => setVoiceNotice(null)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold px-2 py-0.5 rounded hover:bg-amber-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Voice Listening Waveform Bar */}
          {isListening && (
            <div className="p-2.5 rounded-xl bg-linear-to-r from-emerald-900 via-stone-900 to-rose-950 text-white text-xs flex items-center justify-between gap-3 shadow-md animate-pulse">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-semibold text-rose-300">
                  {language === 'am' ? 'እያዳመጥኩ ነው...' : 'Listening via Web Speech API...'}
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono text-amber-300">
                  {voiceLang === 'am-ET' ? 'አማርኛ (am-ET)' : 'English (en-US)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice language toggle button */}
                <button
                  type="button"
                  onClick={() => setVoiceLang(voiceLang === 'am-ET' ? 'en-US' : 'am-ET')}
                  className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                  title="Switch Speech Recognition Language"
                >
                  {voiceLang === 'am-ET' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
                </button>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className="px-2.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors"
                >
                  {language === 'am' ? 'አቁም' : 'Stop'}
                </button>
              </div>
            </div>
          )}

          <div className="relative flex items-center rounded-xl border border-stone-300 bg-stone-50/50 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:bg-white transition-all shadow-2xs">
            
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatPlaceholder}
              disabled={isLoading}
              className="w-full bg-transparent px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden disabled:opacity-60"
            />

            {/* Voice Dictation Language Dropdown / Switcher */}
            <button
              type="button"
              onClick={() => setVoiceLang(voiceLang === 'am-ET' ? 'en-US' : 'am-ET')}
              className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700 hover:bg-stone-300 mr-1 transition-colors"
              title="Dictation Language (Click to toggle)"
            >
              {voiceLang === 'am-ET' ? 'አማ' : 'EN'}
            </button>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-colors mr-1 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/60'
              }`}
              title={isListening ? t.voiceListening : t.voiceDictate}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send CTA */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="mr-1.5 p-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 transition-all shadow-xs active:scale-95 cursor-pointer"
              title={t.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>
              {language === 'am' 
                ? 'በጀሚኒ የተደገፈ • 15 የተረጋገጡ የኢትዮጵያ ካታሎግ ዕቃዎችና ነጋዴዎች' 
                : 'Powered by Gemini • Enforces 15 Ethiopian catalog items & vendors with ambiguity checks'}
            </span>
            <span className="hidden sm:inline">{t.pressEnter}</span>
          </div>
        </form>
      </div>

    </div>
  );
};
