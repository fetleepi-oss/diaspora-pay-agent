import React, { useState } from 'react';
import { Currency, Recipient } from '../types';
import { SUPPORTED_CURRENCIES } from '../data/currencies';
import { 
  Globe, 
  ShoppingBag, 
  Users, 
  Clock, 
  Layers, 
  ChevronDown,
  Sparkles,
  MapPin,
  TrendingUp,
  Zap,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SUPPORTED_LANGUAGES } from '../i18n';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  recipients: Recipient[];
  activeRecipient: Recipient;
  onSelectRecipient: (recipient: Recipient) => void;
  onOpenRecipientModal: () => void;
  onOpenCatalogModal: () => void;
  onOpenOrderHistoryModal: () => void;
  cartCount: number;
  onToggleCart: () => void;
  isCartOpen: boolean;
  onToggleAgentActivity?: () => void;
  isAgentActivityOpen?: boolean;
  activityCount?: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentView?: 'chat' | 'orders';
  onNavigateView?: (view: 'chat' | 'orders') => void;
  orderCount?: number;
  onOpenOnboarding?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  recipients,
  activeRecipient,
  onSelectRecipient,
  onOpenRecipientModal,
  onOpenCatalogModal,
  onOpenOrderHistoryModal,
  cartCount,
  onToggleCart,
  isCartOpen,
  onToggleAgentActivity,
  isAgentActivityOpen = false,
  activityCount = 0,
  language,
  onLanguageChange,
  currentView = 'chat',
  onNavigateView,
  orderCount = 0,
  onOpenOnboarding,
  theme = 'light',
  onToggleTheme,
}) => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#17211e]/95 backdrop-blur-md border-b border-stone-200 dark:border-gray-800 shadow-xs transition-colors">
      {/* Top micro-banner with Ethiopian Tibeb-style geometric stripe */}
      <div className="tibeb-stripe w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <button 
            type="button"
            onClick={() => onNavigateView ? onNavigateView('chat') : null}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-700 via-emerald-800 to-stone-900 text-white shadow-sm ring-1 ring-emerald-600/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base tracking-tighter text-amber-300">DP</span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-stone-900 ring-2 ring-white">
                🇪🇹
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Diaspora<span className="text-emerald-700">Pay</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  {t.agentBadge}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                {language === 'am' ? 'የዲያስፖራ ፔይ ረዳት • ለቤተሰብ ሸቀጦች፣ መብራትና ታክሲ' : 'የዲያስፖራ ፔይ ረዳት • Groceries, Bills & Rides to Ethiopia'}
              </p>
            </div>
          </button>

          {/* Center: Live FX Rate indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-xs text-stone-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-stone-500">{t.liveRate}</span>
            <span className="font-bold text-stone-900">
              1 {currentCurrency.code} = {currentCurrency.rateToETB} ETB
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded">
              {t.zeroSpread}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Language Selector (6 languages) */}
            <div className="relative flex items-center">
              <label htmlFor="header-lang-select" className="sr-only">
                Language
              </label>
              <select
                id="header-lang-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select language"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-gray-800 text-stone-800 dark:text-gray-100 border border-stone-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b6e4f] cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                className="p-2 rounded-lg text-stone-600 dark:text-gray-300 bg-stone-100 dark:bg-gray-800 hover:bg-stone-200 dark:hover:bg-gray-700 border border-stone-200 dark:border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b6e4f]"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Active Recipient Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRecipientDropdownOpen(!isRecipientDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
                title="Switch family member in Ethiopia"
              >
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline text-stone-500">{t.forRecipient}</span>
                <span className="font-semibold text-stone-900 max-w-[90px] sm:max-w-[120px] truncate">
                  {activeRecipient.name}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isRecipientDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs"
                  onClick={() => setIsRecipientDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between text-stone-500 font-semibold">
                    <span>{t.familyInEthiopia}</span>
                    <button
                      onClick={onOpenRecipientModal}
                      className="text-emerald-700 hover:text-emerald-800 text-[11px] font-bold"
                    >
                      {t.addNewRecipient}
                    </button>
                  </div>
                  {recipients.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => onSelectRecipient(rec)}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-stone-50 transition-colors ${
                        rec.id === activeRecipient.id ? 'bg-emerald-50/70 text-emerald-950 font-medium' : 'text-stone-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-stone-900 truncate">
                          {rec.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {rec.city}{rec.subcity ? `, ${rec.subcity}` : ''} • {rec.phone}
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="pt-1.5 border-t border-stone-100 px-3">
                    <button
                      onClick={onOpenRecipientModal}
                      className="w-full text-center py-1.5 text-emerald-700 font-medium hover:underline text-xs"
                    >
                      {t.manageFamilyBook}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
              >
                <span>{currentCurrency.flag}</span>
                <span>{currentCurrency.code}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50 text-xs"
                  onClick={() => setIsCurrencyDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {t.currency}
                  </div>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => onCurrencyChange(curr)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        curr.code === currentCurrency.code ? 'bg-amber-50 text-stone-900 font-bold' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.code} - {curr.name}</span>
                      </div>
                      <span className="text-stone-400 text-[11px]">
                        ~{curr.rateToETB} ETB
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* How It Works / Onboarding Button */}
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                title="3-Step Overview: Who, What, and How the Agent Works"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'am' ? 'መመሪያ' : 'How It Works'}</span>
              </button>
            )}

            {/* Catalog Browser Button */}
            <button
              onClick={onOpenCatalogModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              title="Browse catalog of groceries, bills & rides"
            >
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.catalog}</span>
            </button>

            {/* Order History Page Button */}
            <button
              onClick={() => {
                if (onNavigateView) {
                  onNavigateView(currentView === 'orders' ? 'chat' : 'orders');
                } else {
                  onOpenOrderHistoryModal();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                currentView === 'orders'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs ring-1 ring-emerald-600/30'
                  : 'text-stone-700 bg-stone-50 hover:bg-stone-100 border-stone-200'
              }`}
              title="View past orders & tokens with recipient & category filters"
            >
              <Clock className={`w-3.5 h-3.5 ${currentView === 'orders' ? 'text-amber-300' : 'text-stone-600'}`} />
              <span>{t.orders}</span>
              {orderCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentView === 'orders' ? 'bg-amber-400 text-stone-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {orderCount}
                </span>
              )}
            </button>

            {/* Agent Activity Toggle Button (For Judges & Evaluation) */}
            {onToggleAgentActivity && (
              <button
                type="button"
                onClick={onToggleAgentActivity}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isAgentActivityOpen
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
                title="Toggle real-time Gemini agent tool calling activity panel"
              >
                <Zap className={`w-3.5 h-3.5 ${isAgentActivityOpen ? 'text-amber-400 fill-amber-400' : 'text-emerald-700 fill-emerald-700'}`} />
                <span className="hidden md:inline">{t.agentActivity}</span>
                <span className="inline md:hidden">Activity</span>
                {activityCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isAgentActivityOpen ? 'bg-emerald-500 text-stone-900' : 'bg-emerald-700 text-white'
                  }`}>
                    {activityCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Always visible) */}
            <button
              type="button"
              onClick={onToggleCart}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cartCount > 0
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-700/20'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t.cart}</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-amber-400 text-stone-900 text-[11px] font-extrabold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
