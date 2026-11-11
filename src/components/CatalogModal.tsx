import React, { useState } from 'react';
import { CatalogItem, CategoryType, Currency, Recipient } from '../types';
import { CATALOG_ITEMS } from '../data/catalog';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  Filter 
} from 'lucide-react';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  activeRecipient: Recipient;
  onAddToCart: (item: CatalogItem, recipient: Recipient) => void;
  onAskAgentAboutItem: (item: CatalogItem) => void;
}

const CATEGORIES: { id: 'all' | CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: 'All Catalog', icon: '✨' },
  { id: 'groceries', label: 'Groceries & Feasts', icon: '🌾' },
  { id: 'utilities', label: 'Electricity & Telecom', icon: '⚡' },
  { id: 'school', label: 'School Supplies', icon: '📚' },
  { id: 'rides', label: 'Taxi & Rides', icon: '🚕' },
  { id: 'health', label: 'Healthcare & Pharmacy', icon: '💊' },
];

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onClose,
  currency,
  activeRecipient,
  onAddToCart,
  onAskAgentAboutItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAmharic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (item: CatalogItem) => {
    onAddToCart(item, activeRecipient);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                DiasporaPay Service Catalog
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Addis & Beyond
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Available goods, tokens, and vouchers for family in Ethiopia
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-stone-200 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teff, electricity meter, telebirr, feres taxi, school kit..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-stone-500">
              <p className="text-sm">No items found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const convertedPrice = (item.priceETB / currency.rateToETB).toFixed(2);
              const isAdded = addedItemIds[item.id];

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 p-4 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 bg-stone-50 rounded-xl border border-stone-100">
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {item.nameAmharic}
                          </p>
                        </div>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-stone-900 text-sm">
                        {item.priceETB.toLocaleString()} ETB
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium">
                        ~{currency.symbol}{convertedPrice} {currency.code}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onAskAgentAboutItem(item);
                          onClose();
                        }}
                        className="p-2 rounded-xl text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
                        title="Ask DiasporaPay Agent about this"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        disabled={isAdded}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add for {activeRecipient.name.split(' ')[0]}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
