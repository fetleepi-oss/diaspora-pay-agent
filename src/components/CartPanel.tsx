import React, { useState } from 'react';
import { CartItem, Currency, Recipient } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  MapPin, 
  Zap, 
  Phone, 
  FileText, 
  Edit2, 
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../utils/translations';

interface CartPanelProps {
  items: CartItem[];
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onUpdateCustomDetails?: (cartItemId: string, details: any) => void;
  onQuickAddItem: (itemId: string) => void;
  language?: Language;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  items,
  currency,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onUpdateCustomDetails,
  onQuickAddItem,
  language = 'en',
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [customFieldText, setCustomFieldText] = useState('');
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];

  // Calculations
  const subtotalETB = items.reduce((sum, item) => sum + item.priceETB * item.quantity, 0);
  const subtotalCurrency = subtotalETB / currency.rateToETB;
  const isFreeDelivery = subtotalCurrency >= 50;
  const serviceFeeCurrency = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 1.99);
  const totalCurrency = subtotalCurrency + serviceFeeCurrency;

  // Group items by recipient
  const groupedItems = items.reduce((acc, item) => {
    const recId = item.recipient.id || 'default';
    if (!acc[recId]) {
      acc[recId] = {
        recipient: item.recipient,
        items: [],
      };
    }
    acc[recId].items.push(item);
    return acc;
  }, {} as Record<string, { recipient: Recipient; items: CartItem[] }>);

  const startEditField = (item: CartItem) => {
    setEditingItemId(item.cartItemId);
    const currentValue = item.customDetails?.meterNumber || 
                         item.customDetails?.phoneNumber || 
                         item.customDetails?.specialInstructions || '';
    setCustomFieldText(currentValue);
  };

  const saveEditField = (item: CartItem) => {
    if (onUpdateCustomDetails) {
      if (item.category === 'utilities' && item.fulfillmentType === 'sms_token') {
        onUpdateCustomDetails(item.cartItemId, { meterNumber: customFieldText });
      } else if (item.fulfillmentType === 'direct_topup') {
        onUpdateCustomDetails(item.cartItemId, { phoneNumber: customFieldText });
      } else {
        onUpdateCustomDetails(item.cartItemId, { specialInstructions: customFieldText });
      }
    }
    setEditingItemId(null);
  };

  const getFulfillmentBadge = (type: string) => {
    switch (type) {
      case 'sms_token':
        return { label: 'Instant SMS Token', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'direct_topup':
        return { label: 'Instant Airtime', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'digital_voucher':
        return { label: 'Digital Ride Credit', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'doorstep_delivery':
      default:
        return { label: 'Doorstep Courier', color: 'bg-stone-100 text-stone-800 border-stone-300' };
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Cart Container */}
      <aside
        className={`fixed lg:static top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-stone-200 z-50 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-700 text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.diasporaCart}
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                {items.length} {t.itemsSelected}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-500 hover:text-rose-600 transition-colors px-2 py-1"
                title="Clear all items"
              >
                {t.clearAll}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-emerald-600/70" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">
                {t.emptyCartTitle}
              </h4>
              <p className="mt-1 text-xs text-stone-500 max-w-[240px] leading-relaxed">
                {t.emptyCartDesc}
              </p>

              {/* Quick Add Suggestions */}
              <div className="mt-6 w-full space-y-2">
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider text-left">
                  Popular Diaspora Choices:
                </p>
                <button
                  type="button"
                  onClick={() => onQuickAddItem('groc-teff-50kg')}
                  className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌾</span>
                    <span className="font-medium text-stone-800">50kg Magna Teff</span>
                  </div>
                  <span className="font-bold text-emerald-800">7,800 ETB</span>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickAddItem('util-eeu-power-2000')}
                  className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="font-medium text-stone-800">2,000 ETB EEU Electricity</span>
                  </div>
                  <span className="font-bold text-emerald-800">2,000 ETB</span>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickAddItem('rides-feres-taxi-2500')}
                  className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🚕</span>
                    <span className="font-medium text-stone-800">2,500 ETB Feres Ride Credit</span>
                  </div>
                  <span className="font-bold text-emerald-800">2,500 ETB</span>
                </button>
              </div>
            </div>
          ) : (
            Object.values(groupedItems).map(({ recipient, items: recItems }) => (
              <div 
                key={recipient.id}
                className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs space-y-3"
              >
                {/* Recipient Group Header */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <div>
                      <span className="font-bold text-stone-900">{recipient.name}</span>
                      <span className="text-stone-400 ml-1">
                        • {recipient.city}{recipient.subcity ? `, ${recipient.subcity}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {recipient.phone}
                  </span>
                </div>

                {/* Items in this recipient group */}
                <div className="space-y-3">
                  {recItems.map((item) => {
                    const itemSubtotalETB = item.priceETB * item.quantity;
                    const itemSubtotalCurrency = (itemSubtotalETB / currency.rateToETB).toFixed(2);
                    const badge = getFulfillmentBadge(item.fulfillmentType);
                    const isEditing = editingItemId === item.cartItemId;

                    return (
                      <div 
                        key={item.cartItemId}
                        className="rounded-xl border border-stone-100 bg-stone-50/60 p-3 text-xs space-y-2 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h5 className="font-bold text-stone-900 leading-snug">
                              {item.name}
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              {item.nameAmharic}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-stone-400 hover:text-rose-600 p-1 shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Fulfillment Badge & Agent indicator */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {item.addedByAgent && (
                            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Via Agent
                            </span>
                          )}
                        </div>

                        {/* Custom fields (Meter #, Phone #, Notes) */}
                        <div className="pt-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5 mt-1">
                              <input
                                type="text"
                                value={customFieldText}
                                onChange={(e) => setCustomFieldText(e.target.value)}
                                placeholder="Enter meter # or details"
                                className="w-full bg-white border border-emerald-400 rounded px-2 py-1 text-xs text-stone-900 focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => saveEditField(item)}
                                className="bg-emerald-700 text-white p-1 rounded hover:bg-emerald-800"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-[11px] text-stone-600 bg-white/80 px-2 py-1 rounded border border-stone-200/60">
                              <span className="truncate">
                                {item.fulfillmentType === 'sms_token' ? (
                                  <>⚡ Meter: <span className="font-mono font-medium">{item.customDetails?.meterNumber || recipient.meterNumber || '01429810523'}</span></>
                                ) : item.fulfillmentType === 'direct_topup' ? (
                                  <>📱 Top-up Phone: <span className="font-mono font-medium">{item.customDetails?.phoneNumber || recipient.phone}</span></>
                                ) : (
                                  <>📍 Note: {item.customDetails?.specialInstructions || 'Doorstep delivery'}</>
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => startEditField(item)}
                                className="text-stone-400 hover:text-emerald-700 ml-1 shrink-0"
                                title="Edit details"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-stone-900 text-sm">
                              {currency.symbol}{itemSubtotalCurrency}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              ({itemSubtotalETB.toLocaleString()} ETB)
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-bold text-stone-900 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3.5">
            
            {/* Calculation rows */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-stone-900">
                  {currency.symbol}{subtotalCurrency.toFixed(2)}
                  <span className="text-stone-400 text-[11px] ml-1">
                    ({subtotalETB.toLocaleString()} ETB)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  Exchange Rate
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-semibold">
                    0% Spread
                  </span>
                </span>
                <span className="font-mono text-stone-700">
                  1 {currency.code} = {currency.rateToETB} ETB
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>Diaspora Service & SMS Fee</span>
                <span>
                  {serviceFeeCurrency === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    <span>{currency.symbol}{serviceFeeCurrency.toFixed(2)}</span>
                  )}
                </span>
              </div>

              {isFreeDelivery && (
                <div className="text-[11px] text-emerald-700 font-medium">
                  🎉 Free service fee unlocked on orders over $50!
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="font-bold text-stone-900 text-sm">Total Due</span>
                  <div className="text-[10px] text-stone-400">
                    Billed to your card in {currency.code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-stone-900 text-lg">
                    {currency.symbol}{totalCurrency.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800">
                    ~{subtotalETB.toLocaleString()} ETB delivered
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout CTA Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Proceed to Diaspora Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 bg-amber-50/70 hover:bg-amber-100/80 text-stone-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-1 font-black text-[#003087]">
                  <span>Pay</span><span className="text-[#0070BA]">Pal</span>
                </div>
                <span className="bg-amber-400 text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  SANDBOX
                </span>
                <span className="text-stone-600 font-medium">Test Payment</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <span>Instant SMS token & PayPal Sandbox testing supported</span>
            </div>

          </div>
        )}

      </aside>
    </>
  );
};
