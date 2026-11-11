import React, { useState, useMemo } from 'react';
import { OrderRecord, Recipient } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Zap, 
  Share2, 
  ExternalLink, 
  Copy, 
  ArrowLeft,
  X,
  CreditCard,
  Building,
  Check
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface OrdersPageProps {
  orders: OrderRecord[];
  recipients?: Recipient[];
  onBackToChat: () => void;
  onViewOrderDetails: (order: OrderRecord) => void;
  onOpenRecipientView: (order: OrderRecord) => void;
  language?: Language;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  recipients = [],
  onBackToChat,
  onViewOrderDetails,
  onOpenRecipientView,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language === 'am' ? 'am' : 'en'];
  const [selectedRecipient, setSelectedRecipient] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Derive unique recipients from orders + recipients list
  const recipientOptions = useMemo(() => {
    const namesSet = new Set<string>();
    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (it.recipient?.name) namesSet.add(it.recipient.name);
      });
      o.smsDispatches.forEach((sd) => {
        if (sd.recipientName) namesSet.add(sd.recipientName);
      });
    });
    recipients.forEach((r) => namesSet.add(r.name));
    return Array.from(namesSet);
  }, [orders, recipients]);

  // Categories list
  const categoryOptions = [
    { key: 'ALL', label: t.allCategories },
    { key: 'groceries', label: language === 'am' ? 'ሸቀጣሸቀጥ (Groceries)' : 'Groceries' },
    { key: 'utilities', label: language === 'am' ? 'የመብራትና ስልክ (Utilities)' : 'Utilities' },
    { key: 'rides', label: language === 'am' ? 'የትራንስፖርትና ታክሲ (Rides)' : 'Rides' },
    { key: 'school', label: language === 'am' ? 'የትምህርት ቁሳቁስ (School)' : 'School' },
    { key: 'health', label: language === 'am' ? 'መድኃኒት (Healthcare)' : 'Healthcare' },
  ];

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Recipient Filter
      if (selectedRecipient !== 'ALL') {
        const matchesOrderRecipient = order.items.some(
          (it) => it.recipient?.name.toLowerCase() === selectedRecipient.toLowerCase()
        ) || order.smsDispatches.some(
          (sd) => sd.recipientName.toLowerCase() === selectedRecipient.toLowerCase()
        );
        if (!matchesOrderRecipient) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL') {
        const matchesCategory = order.items.some(
          (it) => (it.category || '').toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCategory) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = order.orderNumber.toLowerCase().includes(q);
        const matchesPayer = order.senderName.toLowerCase().includes(q) || (order.paypalDetails?.orderId || '').toLowerCase().includes(q);
        const matchesItems = order.items.some(
          (it) => it.name.toLowerCase().includes(q) || (it.nameAmharic || '').toLowerCase().includes(q)
        );
        const matchesRecipient = order.items.some(
          (it) => it.recipient?.name.toLowerCase().includes(q) || (it.recipient?.city || '').toLowerCase().includes(q)
        );
        if (!matchesNum && !matchesPayer && !matchesItems && !matchesRecipient) return false;
      }

      return true;
    });
  }, [orders, selectedRecipient, selectedCategory, searchQuery]);

  // Overall statistics
  const totalSentUSD = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalCurrency, 0);
  }, [orders]);

  const totalDeliveredETB = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.subtotalETB, 0);
  }, [orders]);

  const handleCopyToken = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const getStatusBadge = (status: string, hasToken: boolean) => {
    if (hasToken) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
          <Zap className="w-3 h-3 text-sky-600" />
          {t.statusTokenReady}
        </span>
      );
    }
    if (status === 'fulfilled' || status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {t.statusDelivered}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <Truck className="w-3 h-3 text-amber-600" />
        {t.statusInTransit}
      </span>
    );
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.doneBackToChat}</span>
            </button>
            <div className="h-5 w-px bg-stone-200" />
            <div>
              <h1 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                <span>{t.ordersPageTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {orders.length}
                </span>
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                {t.ordersPageSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 text-right">
            <div className="hidden md:block">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Total Fulfilled
              </span>
              <span className="font-mono font-extrabold text-xs sm:text-sm text-stone-900">
                ${totalSentUSD.toFixed(2)} USD
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                Sent to Ethiopia
              </span>
              <span className="font-bold text-xs sm:text-sm text-emerald-900">
                {totalDeliveredETB.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Filters Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-xs sm:text-sm">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filter Diaspora Orders</span>
            </div>
            {(selectedRecipient !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRecipient('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.clearFilters}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchOrdersPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter by Recipient */}
            <div>
              <div className="relative">
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="ALL">{t.allRecipients}</option>
                  {recipientOptions.map((name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <User className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <span className="absolute right-3 top-2.5 text-stone-400 text-xs pointer-events-none">▼</span>
              </div>
            </div>

            {/* Filter by Category */}
            <div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-hidden focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ShoppingBag className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <span className="absolute right-3 top-2.5 text-stone-400 text-xs pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
            <span>Showing: <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders</span>
            {selectedRecipient !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                Recipient: {selectedRecipient}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-emerald-950" 
                  onClick={() => setSelectedRecipient('ALL')} 
                />
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                Category: {categoryOptions.find((c) => c.key === selectedCategory)?.label || selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-amber-950" 
                  onClick={() => setSelectedCategory('ALL')} 
                />
              </span>
            )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {t.noMatchingOrders}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your recipient or category filters, or search term to locate past orders.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedRecipient('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const primaryRecipient = ord.items[0]?.recipient || {
                name: ord.smsDispatches[0]?.recipientName || 'Family in Ethiopia',
                city: 'Addis Ababa',
                relationship: 'Family Member',
                phone: ord.smsDispatches[0]?.recipientPhone || '+251 91 123 4567',
              };

              const hasToken = ord.smsDispatches.some((s) => Boolean(s.token));
              const tokenString = ord.smsDispatches.find((s) => Boolean(s.token))?.token;

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4"
                >
                  {/* Order Top Bar: Status, Order Number, Date, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-extrabold text-sm text-stone-900">
                          #{ord.orderNumber}
                        </span>
                        {getStatusBadge(ord.status, hasToken)}
                        {ord.paypalDetails && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003087] border border-blue-200">
                            PayPal Sandbox
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Total Display */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        {t.orderTotal}
                      </span>
                      <div className="font-mono font-extrabold text-stone-900 text-lg">
                        {ord.currency.symbol}{ord.totalCurrency.toFixed(2)} {ord.currency.code}
                      </div>
                      <span className="text-xs font-semibold text-emerald-800">
                        {ord.subtotalETB.toLocaleString()} ETB fulfilled
                      </span>
                    </div>
                  </div>

                  {/* Recipient & Delivery Location Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                          {t.recipientLabel}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          {primaryRecipient.name}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {primaryRecipient.relationship} • {primaryRecipient.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                          {t.deliveryTo}
                        </span>
                        <span className="font-semibold text-stone-800 text-xs">
                          {primaryRecipient.city || 'Addis Ababa'}{primaryRecipient.subcity ? `, ${primaryRecipient.subcity}` : ''}
                        </span>
                        {primaryRecipient.specificAddress && (
                          <span className="text-[11px] text-stone-500 block">
                            {primaryRecipient.specificAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Itemized Goods & Services List */}
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block">
                      {t.itemsListTitle}
                    </span>
                    <div className="space-y-1.5">
                      {ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-stone-100 hover:border-stone-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px] font-bold flex items-center justify-center">
                              {it.quantity}x
                            </span>
                            <span className="font-medium text-stone-900">
                              {language === 'am' && it.nameAmharic ? it.nameAmharic : it.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-500 font-semibold uppercase">
                              {it.category}
                            </span>
                          </div>
                          <span className="font-mono text-stone-600 font-semibold">
                            {it.priceETB ? `${(it.priceETB * it.quantity).toLocaleString()} ETB` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 20-Digit EEU STS Keypad Token Card (if available) */}
                  {tokenString && (
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                            {t.meterTokenLabel}
                          </span>
                          <span className="font-mono font-extrabold text-stone-950 text-sm tracking-wider">
                            {tokenString}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCopyToken(tokenString, e)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedToken === tokenString ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-stone-900" />
                            <span>{t.tokenCopied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.copyToken}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Action Buttons: Share with family & View Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-stone-100 text-xs">
                    <span className="text-[11px] text-stone-400">
                      Payment Method: <strong>{ord.paymentMethod}</strong> • {ord.smsDispatches.length} recipient SMS notices generated
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onOpenRecipientView(ord)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="Generate mobile-friendly recipient link for family in Ethiopia"
                      >
                        <Share2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>{t.shareWithFamily}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewOrderDetails(ord)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View SMS Receipt</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
  );
};
