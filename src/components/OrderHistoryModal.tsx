import React, { useState, useMemo } from 'react';
import { OrderRecord } from '../types';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink,
  Share2,
  Filter,
  User,
  Zap,
  Truck,
  Search,
  Maximize2
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../utils/translations';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onViewOrderDetails: (order: OrderRecord) => void;
  onOpenRecipientView?: (order: OrderRecord) => void;
  onOpenFullPage?: () => void;
  language?: Language;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onViewOrderDetails,
  onOpenRecipientView,
  onOpenFullPage,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];
  const [selectedRecipient, setSelectedRecipient] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique recipients
  const recipientOptions = useMemo(() => {
    const names = new Set<string>();
    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (it.recipient?.name) names.add(it.recipient.name);
      });
      o.smsDispatches.forEach((sd) => {
        if (sd.recipientName) names.add(sd.recipientName);
      });
    });
    return Array.from(names);
  }, [orders]);

  const categoryOptions = [
    { key: 'ALL', label: t.allCategories },
    { key: 'groceries', label: language === 'am' ? 'ሸቀጣሸቀጥ' : 'Groceries' },
    { key: 'utilities', label: language === 'am' ? 'መብራትና ስልክ' : 'Utilities' },
    { key: 'rides', label: language === 'am' ? 'ታክሲ' : 'Rides' },
    { key: 'school', label: language === 'am' ? 'ትምህርት' : 'School' },
    { key: 'health', label: language === 'am' ? 'መድኃኒት' : 'Healthcare' },
  ];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedRecipient !== 'ALL') {
        const matchesRec = order.items.some(
          (it) => it.recipient?.name.toLowerCase() === selectedRecipient.toLowerCase()
        ) || order.smsDispatches.some(
          (sd) => sd.recipientName.toLowerCase() === selectedRecipient.toLowerCase()
        );
        if (!matchesRec) return false;
      }

      if (selectedCategory !== 'ALL') {
        const matchesCat = order.items.some(
          (it) => (it.category || '').toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCat) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = order.orderNumber.toLowerCase().includes(q);
        const matchesRec = order.items.some(
          (it) => it.recipient?.name.toLowerCase().includes(q)
        );
        const matchesItem = order.items.some(
          (it) => it.name.toLowerCase().includes(q)
        );
        if (!matchesNum && !matchesRec && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, selectedRecipient, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <span>{t.ordersPageTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {orders.length}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                {t.ordersPageSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullPage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPage();
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                title="Expand to Full Orders Page"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-3.5 bg-stone-50/80 border-b border-stone-200 space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchOrdersPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
            </div>

            {/* Recipient Filter */}
            <div className="relative">
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full pl-7 pr-6 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 font-medium focus:outline-hidden focus:border-emerald-600 appearance-none cursor-pointer"
              >
                <option value="ALL">{t.allRecipients}</option>
                {recipientOptions.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
              <User className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2 pointer-events-none" />
              <span className="absolute right-2.5 top-2 text-stone-400 text-[10px] pointer-events-none">▼</span>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-7 pr-6 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 font-medium focus:outline-hidden focus:border-emerald-600 appearance-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2 pointer-events-none" />
              <span className="absolute right-2.5 top-2 text-stone-400 text-[10px] pointer-events-none">▼</span>
            </div>
          </div>

          {(selectedRecipient !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
              <span>Found <strong>{filteredOrders.length}</strong> matching orders</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedRecipient('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="font-bold text-rose-600 hover:underline cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-800">{t.noMatchingOrders}</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                No orders match your filter criteria. Try selecting "All Recipients" or "All Categories".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const primaryRecipient = ord.items[0]?.recipient || {
                  name: ord.smsDispatches[0]?.recipientName || 'Family in Ethiopia',
                  city: 'Addis Ababa',
                  relationship: 'Family Member',
                };
                const hasToken = ord.smsDispatches.some((s) => Boolean(s.token));

                return (
                  <div
                    key={ord.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-all space-y-3"
                  >
                    {/* Top Row: Order #, Status, Date, Total */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-stone-900">
                            #{ord.orderNumber}
                          </span>
                          {hasToken ? (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              {t.statusTokenReady}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {t.statusDelivered}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 block">
                          {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-extrabold text-stone-900 text-sm">
                          {ord.currency.symbol}{ord.totalCurrency.toFixed(2)} {ord.currency.code}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold">
                          {ord.subtotalETB.toLocaleString()} ETB
                        </div>
                      </div>
                    </div>

                    {/* Recipient Details Pill */}
                    <div className="flex items-center justify-between text-xs bg-stone-50 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>{primaryRecipient.name}</strong> ({primaryRecipient.relationship})</span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {primaryRecipient.city || 'Addis Ababa'}
                      </span>
                    </div>

                    {/* Items summary */}
                    <div className="text-xs text-stone-600 bg-white border border-stone-100 p-2.5 rounded-xl space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-900">{it.quantity}x</span>
                            <span>{language === 'am' && it.nameAmharic ? it.nameAmharic : it.name}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-stone-100 text-stone-500 font-bold">
                              {it.category}
                            </span>
                          </span>
                          <span className="text-stone-500 font-mono text-[11px]">
                            {it.priceETB ? `${(it.priceETB * it.quantity).toLocaleString()} ETB` : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions row: View details + Share with family */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                      <span className="text-[11px] text-stone-400">
                        {ord.smsDispatches.length} recipient SMS notices generated
                      </span>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {onOpenRecipientView && (
                          <button
                            type="button"
                            onClick={() => onOpenRecipientView(ord)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-stone-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Generate recipient page for family"
                          >
                            <Share2 className="w-3.5 h-3.5 text-amber-700" />
                            <span>{t.shareWithFamily}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onViewOrderDetails(ord)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Receipt & Tokens</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
