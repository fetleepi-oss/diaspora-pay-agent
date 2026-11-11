import React from 'react';
import { MessageSquare, ShoppingCart, Package, HelpCircle } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'chat' | 'cart' | 'orders' | 'help';
  onSelectTab: (tab: 'chat' | 'cart' | 'orders' | 'help') => void;
  cartCount: number;
  t: (key: string) => string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  t,
}) => {
  const items = [
    { id: 'chat' as const, label: t('nav.chat'), icon: MessageSquare },
    { id: 'cart' as const, label: t('nav.cart'), icon: ShoppingCart, badge: cartCount },
    { id: 'orders' as const, label: t('nav.orders'), icon: Package },
    { id: 'help' as const, label: t('nav.help'), icon: HelpCircle },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#17211e]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 pb-safe"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1.5 px-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b6e4f] ${
                isActive
                  ? 'text-[#0b6e4f] dark:text-emerald-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d9a441] text-gray-950 text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
