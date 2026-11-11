import React, { useState } from 'react';
import { 
  X, 
  Users, 
  ShoppingBag, 
  Bot, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  CreditCard,
  Sparkles,
  MapPin,
  FileCheck
} from 'lucide-react';
import { Language } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
  language?: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  language = 'en',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = language === 'am' ? [
    {
      stepNumber: 1,
      badge: 'ደረጃ 1 ከ 3 • ተቀባዮች',
      title: 'ለማን ነው ክፍያ የሚፈጽሙት?',
      subtitle: 'በኢትዮጵያ ውስጥ ያሉ የቤተሰብ አባላት፣ ወላጆች፣ ዘመዶች እና የትምህርት ቤት ልጆች',
      icon: Users,
      iconColor: 'bg-emerald-600',
      description: 'የዲያስፖራ ፔይ በውጭ አገር የሚኖሩ ኢትዮጵያውያን በአዲስ አበባና በተለያዩ ከተሞች ለሚገኙ ቤተሰቦቻቸው በቀጥታ ድጋፍ እንዲልኩ ያስችላል።',
      highlights: [
        {
          title: 'የቤተሰብ ማስታወሻ ደብተር',
          desc: 'የእናቴ፣ የአባቴ፣ የልጆች እና የዘመዶች ስልክ፣ ከተማና የመብራት ቆጣሪ ቁጥርን በቀላሉ መመዝገብ።',
          icon: MapPin,
        },
        {
          title: 'ቀጥተኛ የኤስኤምኤስ (SMS) ማሳወቂያ',
          desc: 'ክፍያው ሲጠናቀቅ ተቀባዩ ወዲያውኑ በስልካቸው የ20-ዲጂት ቶከን ወይም የማድረሻ መልዕክት ይደርሳቸዋል።',
          icon: Zap,
        },
        {
          title: 'ምንም መተግበሪያ አያስፈልጋቸውም',
          desc: 'በኢትዮጵያ ያሉ ቤተሰቦች ስማርትፎን ወይም መተግበሪያ መጫን አያስፈልጋቸውም፤ በSMS ወይም በቀላል ሊንክ ይደርሳቸዋል።',
          icon: CheckCircle2,
        },
      ],
    },
    {
      stepNumber: 2,
      badge: 'ደረጃ 2 ከ 3 • ካታሎግ',
      title: 'ምን ዓይነት ዕቃዎችንና አገልግሎቶችን መክፈል ይችላሉ?',
      subtitle: '15 የተረጋገጡ የኢትዮጵያ የዕለት ተዕለት ፍላጎቶች ከታመኑ አቅራቢዎች ጋር',
      icon: ShoppingBag,
      iconColor: 'bg-amber-500',
      description: 'ረዳቱ ከታመኑ አቅራቢዎች ጋር ብቻ የተቆራኘ ነው። ምንም ዓይነት ያልተረጋገጠ ሻጭ ወይም የተጋነነ ዋጋ የለም።',
      highlights: [
        {
          title: 'የደብረዘይት ጤፍና ሸቀጦች',
          desc: '25 ኪ.ግ እና 50 ኪ.ግ ነጭ ማኛ ጤፍ፣ በርበሬና ሽሮ፣ ዘይት፣ የበዓል ሙክት በግ።',
          icon: ShoppingBag,
        },
        {
          title: 'የመብራት ኃይልና የቴሌኮም ክፍያ',
          desc: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) ቅድመ-ክፍያ ቆጣሪ ቶከን እና የEthio Telecom/Safaricom ካርድ።',
          icon: Zap,
        },
        {
          title: 'የትምህርት መሣሪያና የታክሲ ክፍያ',
          desc: 'የተማሪዎች ደብተር፣ የቦርሳና እስክሪብቶ ጥቅል እንዲሁም የRide እና Feres የዲጂታል ታክሲ ቫውቸር።',
          icon: FileCheck,
        },
      ],
    },
    {
      stepNumber: 3,
      badge: 'ደረጃ 3 ከ 3 • የጀሚኒ ረዳት',
      title: 'የጀሚኒ AI ረዳት እንዴት ይሠራል?',
      subtitle: 'በተፈጥሯዊ ቋንቋ ይዘዙ፣ ረዳቱ መሣሪያዎችን ይጠራል፣ በPayPal Sandbox ይክፈሉ',
      icon: Bot,
      iconColor: 'bg-stone-900',
      description: 'ፍላጎትዎን በአማርኛ ወይም English ይተይቡ ወይም በድምፅ ይናገሩ። ረዳቱ የጀሚኒ መሣሪያዎችን (Tool Calling) በመጥራት ቅርጫቱን ያዘጋጃል።',
      highlights: [
        {
          title: 'የተፈጥሮ ቋንቋና ድምፅ ግብዓት',
          desc: '"ለእማማ 25 ኪሎ ጤፍ እና $15 መብራት ላክ" ብለው ሲጽፉ ረዳቱ ወዲያውኑ ይገነዘባል።',
          icon: Sparkles,
        },
        {
          title: 'የሰው ማረጋገጫ (Human-in-the-Loop)',
          desc: 'ክፍያ ከመፈጸሙ በፊት ረዳቱ ፈጽሞ በራሱ ክፍያ አይቆርጥም፤ የእርስዎን ግልጽ ፈቃድ ይጠይቃል።',
          icon: ShieldCheck,
        },
        {
          title: 'የPayPal Sandbox ደህንነቱ የተጠበቀ ክፍያ',
          desc: 'በኦፊሴላዊ የPayPal Orders v2 API በኩል ያለምንም ስጋት በሙከራ ሁነታ ይክፈሉ።',
          icon: CreditCard,
        },
      ],
    },
  ] : [
    {
      stepNumber: 1,
      badge: 'Step 1 of 3 • Recipients',
      title: 'Who are you paying for?',
      subtitle: 'Support parents, siblings, children, and extended family across Ethiopia',
      icon: Users,
      iconColor: 'bg-emerald-600',
      description: 'DiasporaPay connects Ethiopians living abroad directly to their loved ones in Addis Ababa, Hawassa, Bahir Dar, and provincial towns without expensive wire transfer friction.',
      highlights: [
        {
          title: 'Family Address Book',
          desc: 'Easily manage Mom, Dad, and students with their phone numbers, specific addresses, and EEU meter numbers.',
          icon: MapPin,
        },
        {
          title: 'Direct SMS & Token Dispatch',
          desc: 'Recipients immediately receive SMS notifications with 20-digit prepaid power tokens or courier tracking info.',
          icon: Zap,
        },
        {
          title: 'Zero App Required for Family',
          desc: 'Loved ones back home need no app or bank account—goods arrive at their door and tokens type directly into keypads.',
          icon: CheckCircle2,
        },
      ],
    },
    {
      stepNumber: 2,
      badge: 'Step 2 of 3 • Catalog',
      title: 'What can you pay for?',
      subtitle: '15 verified essential Ethiopian items and utility services with official merchants',
      icon: ShoppingBag,
      iconColor: 'bg-amber-500',
      description: 'The agent strictly matches requests against our verified 15-item catalog. No invented vendors, no marked-up exchange rates, and 100% direct settlement.',
      highlights: [
        {
          title: 'Groceries & Staple Teff',
          desc: '25kg & 50kg Magna White Teff from Debre Zeit, berbere & shiro spices, Niger seed oil, and holiday feast sheep.',
          icon: ShoppingBag,
        },
        {
          title: 'Utilities & Power Top-ups',
          desc: 'Instant Ethiopian Electric Utility (EEU) prepaid electricity tokens, Ethio Telecom airtime, and Safaricom data.',
          icon: Zap,
        },
        {
          title: 'School Supplies & Taxi Rides',
          desc: 'Stationery packs, student backpacks, and digital ride vouchers for RIDE (8294) and Feres Technologies.',
          icon: FileCheck,
        },
      ],
    },
    {
      stepNumber: 3,
      badge: 'Step 3 of 3 • The Agent',
      title: 'How does the Gemini agent work?',
      subtitle: 'Natural language chat, real function calling, and PayPal Sandbox checkout',
      icon: Bot,
      iconColor: 'bg-stone-900',
      description: 'Simply tell the agent what you need in English or Amharic (text or microphone voice). It invokes 5 structured Gemini function calls in real time.',
      highlights: [
        {
          title: 'True Gemini Function Calling',
          desc: 'Calls search_catalog, build_cart, and run_safety_check dynamically—inspect every call in the Agent Activity panel.',
          icon: Sparkles,
        },
        {
          title: 'Strict Human-in-the-Loop',
          desc: 'The agent never charges without affirmative approval—you review and authorize every single PayPal order.',
          icon: ShieldCheck,
        },
        {
          title: 'PayPal Sandbox Orders v2',
          desc: 'Real server-side PayPal order creation and capture with zero risk in sandbox mode.',
          icon: CreditCard,
        },
      ],
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const samplePrompts = language === 'am' ? [
    'ለእናቴ 25 ኪ.ግ ነጭ ማኛ ጤፍ እና የ$15 የመብራት ቶከን ወደ ቦሌ ላክ።',
    '20 የተማሪ ደብተር እና የ$10 የኢትዮ ቴሌኮም ካርድ ለዳዊት አዝዝ።',
    'የትዕዛዝ ET-DP-819204 የማድረስ ሁኔታ ምን ደረጃ ላይ ደርሷል?',
  ] : [
    'Send 25kg injera flour and $15 electricity to Mom',
    'Order 20 school notebooks and $10 airtime for Dawit',
    'What is the delivery status of order ET-DP-819204?',
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Ethiopian Accent Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-600 via-amber-400 to-rose-600" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${current.iconColor} text-white flex items-center justify-center shadow-md ring-2 ring-white`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {current.badge}
              </span>
              <h3 id="onboarding-title" className="font-extrabold text-stone-900 text-base sm:text-lg mt-0.5">
                {current.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close onboarding"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[65vh]">
          
          {/* Subtitle & Lead Paragraph */}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug">
              {current.subtitle}
            </p>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Highlights 3-Card Grid */}
          <div className="grid grid-cols-1 gap-3">
            {current.highlights.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:bg-emerald-50/40 hover:border-emerald-300 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-white text-emerald-800 shadow-2xs border border-stone-200 shrink-0 mt-0.5">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* If final step, show quick one-click prompts for judges */}
          {currentStep === 2 && (
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                {language === 'am' ? 'ወዲያውኑ ለመሞከር አንዱን ይጫኑ (ለዳኞች የተዘጋጀ):' : 'Try One Click Example Prompts (Designed for Judges):'}
              </span>
              <div className="space-y-1.5">
                {samplePrompts.map((pText, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (onSelectPrompt) onSelectPrompt(pText);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-stone-900 text-xs font-medium flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <span className="truncate pr-2">"{pText}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Progress Dots & Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between gap-3">
          
          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-1.5" aria-label="Step progress">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx 
                    ? 'w-7 bg-emerald-700' 
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Back & Next / Finish Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <span>
                {currentStep === steps.length - 1 
                  ? (language === 'am' ? 'መተግበሪያውን ጀምር' : 'Get Started') 
                  : (language === 'am' ? 'ቀጣይ' : 'Next Step')}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
