import React, { useState } from 'react';
import { 
  CartItem, 
  CatalogItem, 
  ChatMessage, 
  Currency, 
  OrderRecord, 
  Recipient,
  StructuredAgentItem,
  StructuredAgentResponse,
  ToolCallActivity,
  HumanApprovalRequest
} from './types';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from './data/currencies';
import { INITIAL_RECIPIENTS } from './data/sampleRecipients';
import { CATALOG_ITEMS } from './data/catalog';
import { MOCK_CATALOG_15 } from './data/mockCatalog15';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { CartPanel } from './components/CartPanel';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { CatalogModal } from './components/CatalogModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { RecipientModal } from './components/RecipientModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { RecipientShareView } from './components/RecipientShareView';
import { OrdersPage } from './components/OrdersPage';
import { OnboardingModal } from './components/OnboardingModal';
import { Language } from './types';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { ProgressStepper } from './components/layout/ProgressStepper';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    text: `Selam! I am your Gemini-powered DiasporaPay Agent.

Describe what your family in Ethiopia needs in natural language (e.g., "Send 25kg injera flour and $15 EEU electricity to my mom in Bole" or "Book a taxi ride").

I will match your request against our official 15-item mock vendor catalog, verify vendors, calculate the USD total, and provide clear delivery instructions. If your request is ambiguous, I will ask a clarifying question!`,
    timestamp: 'Just now',
    structuredResponse: {
      items: [
        {
          name: 'Injera Flour (Magna White Teff) 25kg',
          vendor: 'Ada Debre Zeit Grain Traders',
          price_usd: 32.0,
          category: 'Groceries',
        },
        {
          name: 'EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)',
          vendor: 'Ethiopian Electric Utility (EEU)',
          price_usd: 15.0,
          category: 'Utilities',
        },
      ],
      delivery_notes: 'Doorstep courier delivery to home in Addis Ababa within 4 hours; Instant 20-digit STS electricity token sent via SMS to recipient phone.',
      total_usd: 47.0,
      summary: 'Sample starter bundle for Almaz Kebede (Mom): 25kg Injera Flour ($32.00) from Ada Debre Zeit Grain Traders + $15.00 EEU Electricity Top-Up from Ethiopian Electric Utility. Total: $47.00 USD.',
      clarifying_question: null,
    },
  },
];

const SAMPLE_INITIAL_ORDER: OrderRecord = {
  id: 'ord_sample_1',
  orderNumber: 'ET-DP-819204',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  currency: DEFAULT_CURRENCY,
  items: [
    {
      cartItemId: 'sample_item_1',
      catalogItemId: 'util-eeu-power-2000',
      name: 'EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)',
      nameAmharic: 'የመብራት ኃይል ቶከን 2,000 ብር',
      category: 'utilities',
      priceETB: 2000,
      quantity: 1,
      fulfillmentType: 'sms_token',
      recipient: INITIAL_RECIPIENTS[0],
      customDetails: {
        meterNumber: '01429810523',
      },
    },
  ],
  subtotalETB: 2000,
  subtotalCurrency: 2000 / 132.5,
  serviceFeeCurrency: 1.99,
  totalCurrency: 2000 / 132.5 + 1.99,
  paymentMethod: 'Apple Pay',
  senderName: 'Abel Kebede',
  senderEmail: 'abel.diaspora@gmail.com',
  status: 'fulfilled',
  smsDispatches: [
    {
      recipientName: 'Almaz Kebede (Mom)',
      recipientPhone: '+251 91 123 4567',
      type: 'sms_token',
      messageText: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU): የተከበሩ Almaz Kebede (Mom)፣ የ2,000 ብር የመብራት ቶከን ቁጥርዎ: 4819-2049-5510-9281-3310 ነው። ከውጭ አገር ዘመድዎ (Abel Kebede) በስጦታ የተላከ። እናመሰግናለን!',
      token: '4819-2049-5510-9281-3310',
    },
  ],
};

const INITIAL_TOOL_ACTIVITIES: ToolCallActivity[] = [
  {
    id: 'init_call_1',
    toolName: 'search_catalog',
    args: { query: 'injera flour 25kg and eeu electricity' },
    result: {
      query: 'injera flour 25kg and eeu electricity',
      count: 2,
      results: [
        {
          name: 'Injera Flour (Magna White Teff) 25kg',
          vendor: 'Ada Debre Zeit Grain Traders',
          price_usd: 32.0,
          category: 'Groceries',
        },
        {
          name: 'EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)',
          vendor: 'Ethiopian Electric Utility (EEU)',
          price_usd: 15.0,
          category: 'Utilities',
        },
      ],
      vendor_verification: 'All returned items are verified against the official 15-item catalog with strict vendor integrity.',
    },
    status: 'success',
    timestamp: 'Just now',
    durationMs: 42,
    reasoningNote: 'Agent searched 15-item catalog: found 2 verified items with authorized vendors.',
  },
  {
    id: 'init_call_2',
    toolName: 'build_cart',
    args: {
      items: [
        { name: 'Injera Flour (Magna White Teff) 25kg', quantity: 1 },
        { name: 'EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)', quantity: 1 },
      ],
    },
    result: {
      items_count: 2,
      total_usd: 47.0,
      recipient: 'Almaz Kebede (Mom)',
      delivery_notes: 'Doorstep courier delivery in Addis Ababa; instant 20-digit STS meter token via SMS.',
    },
    status: 'success',
    timestamp: 'Just now',
    durationMs: 28,
    reasoningNote: 'Constructed starter shopping cart with 2 catalog items ($47.00 USD).',
  },
  {
    id: 'init_call_3',
    toolName: 'run_safety_check',
    args: {
      cart: {
        items: [
          { name: 'Injera Flour 25kg', price_usd: 32.0, quantity: 1 },
          { name: 'EEU Electricity Top-Up', price_usd: 15.0, quantity: 1 },
        ],
        total_usd: 47.0,
      },
      notes: 'Initial welcome order',
      is_urgent: false,
    },
    result: {
      isSuspicious: false,
      riskLevel: 'low',
      reasoning: 'This transaction follows normal household transfer limits with verified delivery parameters.',
      flaggedTriggers: [],
      total_audited_usd: 47.0,
    },
    status: 'success',
    timestamp: 'Just now',
    durationMs: 19,
    reasoningNote: 'Audited cart safety: Risk level is LOW. Verified household parameters.',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'orders'>('chat');
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [activeRecipient, setActiveRecipient] = useState<Recipient>(INITIAL_RECIPIENTS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [orders, setOrders] = useState<OrderRecord[]>([SAMPLE_INITIAL_ORDER]);
  const [toolActivities, setToolActivities] = useState<ToolCallActivity[]>(INITIAL_TOOL_ACTIVITIES);
  const [isAgentActivityOpen, setIsAgentActivityOpen] = useState(true);
  const [pendingApprovalRequest, setPendingApprovalRequest] = useState<HumanApprovalRequest | null>(null);
  
  // UI Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeConfirmationOrder, setActiveConfirmationOrder] = useState<OrderRecord | null>(null);
  const [sharedRecipientOrder, setSharedRecipientOrder] = useState<OrderRecord | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isToolExecuting, setIsToolExecuting] = useState(false);

  // Sync with URL hash for navigation & read-only recipient link (e.g. #orders, #recipient-view?order=ET-DP-819204)
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#orders') {
        setCurrentView('orders');
      } else if (hash.startsWith('#recipient-view')) {
        const match = hash.match(/order=([A-Za-z0-9-_]+)/);
        const orderId = match ? match[1] : 'ET-DP-819204';
        const found = orders.find((o) => o.orderNumber === orderId || o.id === orderId) || SAMPLE_INITIAL_ORDER;
        setSharedRecipientOrder(found);
      } else if (!hash || hash === '#chat') {
        setCurrentView('chat');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [orders]);

  // Add individual catalog item to cart
  const handleAddToCart = (
    item: CatalogItem, 
    recipient: Recipient = activeRecipient, 
    customDetails?: any
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.catalogItemId === item.id && ci.recipient.id === recipient.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      const newCartItem: CartItem = {
        cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        catalogItemId: item.id,
        name: item.name,
        nameAmharic: item.nameAmharic,
        category: item.category,
        priceETB: item.priceETB,
        quantity: 1,
        fulfillmentType: item.fulfillmentType,
        recipient: recipient,
        customDetails: customDetails || {
          meterNumber: recipient.meterNumber,
          phoneNumber: recipient.phone,
          specialInstructions: recipient.specificAddress,
        },
      };

      return [...prev, newCartItem];
    });
  };

  // Add structured items returned by Gemini Agent directly into cart
  const handleAddStructuredItemsToCart = (
    structuredItems: StructuredAgentItem[],
    notes?: string
  ) => {
    structuredItems.forEach((it) => {
      // Find matching mock item or catalog item
      const mock = MOCK_CATALOG_15.find(
        (m) => m.name.toLowerCase() === it.name.toLowerCase() || it.name.toLowerCase().includes(m.name.toLowerCase().slice(0, 15))
      );

      const priceETB = Math.round(it.price_usd * currency.rateToETB);
      let catType: any = 'groceries';
      const catLower = (it.category || '').toLowerCase();
      if (catLower.includes('util')) catType = 'utilities';
      else if (catLower.includes('school')) catType = 'school';
      else if (catLower.includes('ride')) catType = 'rides';
      else if (catLower.includes('health')) catType = 'health';

      let fulfillmentType: any = 'doorstep_delivery';
      if (catType === 'utilities' && (it.name.includes('EEU') || it.name.includes('Electricity'))) {
        fulfillmentType = 'sms_token';
      } else if (catType === 'utilities') {
        fulfillmentType = 'direct_topup';
      } else if (catType === 'rides') {
        fulfillmentType = 'digital_voucher';
      }

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (ci) => ci.name === it.name && ci.recipient.id === activeRecipient.id
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += 1;
          return updated;
        }

        const newCartItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          catalogItemId: mock?.id || `mock-${Date.now()}`,
          name: it.name,
          nameAmharic: mock?.nameAmharic || it.name,
          category: catType,
          priceETB: priceETB,
          quantity: 1,
          fulfillmentType: fulfillmentType,
          recipient: activeRecipient,
          customDetails: {
            meterNumber: activeRecipient.meterNumber,
            phoneNumber: activeRecipient.phone,
            specialInstructions: notes || mock?.default_delivery_notes,
          },
          addedByAgent: true,
        };

        return [...prev, newCartItem];
      });
    });

    // Auto open cart on desktop
    if (window.innerWidth >= 1024) {
      setIsCartOpen(true);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateCustomDetails = (cartItemId: string, details: any) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, customDetails: { ...item.customDetails, ...details } }
          : item
      )
    );
  };

  const handleQuickAddItem = (itemId: string) => {
    const item = CATALOG_ITEMS.find((c) => c.id === itemId);
    if (item) {
      handleAddToCart(item, activeRecipient);
    }
  };

  const handleAskAgentAboutItem = (item: CatalogItem) => {
    const prompt = `I want to order ${item.name} ($${(item.priceETB / currency.rateToETB).toFixed(2)}) for ${activeRecipient.name}.`;
    handleSendMessage(prompt);
  };

  // Direct tool execution runner for judges & test buttons
  const handleRunTestTool = async (toolName: ToolCallActivity['toolName'], customArgs?: any) => {
    setIsToolExecuting(true);
    try {
      const currentCartUSD = cartItems.reduce(
        (sum, ci) => sum + (ci.priceETB / currency.rateToETB) * ci.quantity,
        0
      );
      const cartPayload = {
        items: cartItems.map((c) => ({
          name: c.name,
          price_usd: Number((c.priceETB / currency.rateToETB).toFixed(2)),
          quantity: c.quantity,
        })),
        total_usd: Number(currentCartUSD.toFixed(2)),
      };

      const res = await fetch('/api/agent/tool-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          args: customArgs || {},
          activeRecipient,
          cart: cartPayload,
          userConfirmedApproval: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.activity) {
        const activity: ToolCallActivity = data.activity;
        setToolActivities((prev) => [activity, ...prev]);

        // If tool was build_cart, automatically sync with React cart
        if (toolName === 'build_cart' && activity.result?.cart_items) {
          handleAddStructuredItemsToCart(
            activity.result.cart_items.map((it: any) => ({
              name: it.name,
              vendor: it.vendor,
              price_usd: it.price_usd,
              category: it.category,
            })),
            activity.result.delivery_notes
          );
        }

        // If tool was create_paypal_order and required human approval
        if (toolName === 'create_paypal_order' && activity.result?.requires_human_approval) {
          setPendingApprovalRequest({
            requestId: `req_${Date.now()}`,
            cart: {
              items: activity.result.cart_summary.items,
              total_usd: activity.result.cart_summary.total_usd,
            },
            recipientName: activeRecipient.name,
            totalUSD: activity.result.cart_summary.total_usd,
            status: 'pending',
            reason: 'Human-in-the-loop authorization required before creating PayPal Sandbox Order.',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Run test tool error:', err);
    } finally {
      setIsToolExecuting(false);
    }
  };

  // Human-in-the-loop explicit approval handler
  const handleApprovePayment = async (approval: HumanApprovalRequest) => {
    setPendingApprovalRequest(null);
    setIsChatLoading(true);

    const confirmationText = `Approved. Creating PayPal Sandbox payment for $${approval.totalUSD.toFixed(2)} USD for ${approval.recipientName}.`;
    
    // Add user approval message to chat
    const userConfirmMsg: ChatMessage = {
      id: `msg-user-approve-${Date.now()}`,
      role: 'user',
      text: `✓ I approve the PayPal Sandbox payment of $${approval.totalUSD.toFixed(2)} USD for ${approval.recipientName}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userConfirmMsg]);

    try {
      // Execute create_paypal_order tool with user_confirmed_approval: true
      const res = await fetch('/api/agent/tool-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: 'create_paypal_order',
          args: {
            cart: approval.cart,
            user_confirmed_approval: true,
            recipient_name: approval.recipientName,
          },
          activeRecipient,
          cart: approval.cart,
          userConfirmedApproval: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.activity) {
        setToolActivities((prev) => [data.activity, ...prev]);

        const asstMsg: ChatMessage = {
          id: `msg-asst-approved-${Date.now()}`,
          role: 'assistant',
          text: `✅ **Human Authorization Granted!**\n\nI have called \`create_paypal_order\` with confirmed approval. PayPal Sandbox Order **#${data.activity.result.orderNumber}** (PayPal ID: \`${data.activity.result.orderID}\`) has been created. Ready for payment capture!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolActivities: [data.activity],
        };
        setMessages((prev) => [...prev, asstMsg]);

        // Auto-open checkout modal for immediate PayPal Sandbox payment
        setIsCheckoutOpen(true);
      }
    } catch (err) {
      console.error('Error approving payment:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRejectPayment = (requestId: string) => {
    setPendingApprovalRequest(null);
    const rejectMsg: ChatMessage = {
      id: `msg-reject-${Date.now()}`,
      role: 'assistant',
      text: 'Payment creation paused as requested. You can modify your cart, add other Ethiopian items, or ask questions anytime.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, rejectMsg]);
  };

  // Chat message sending to Gemini tool-calling agent
  const handleSendMessage = async (text: string, isExplicitApproval?: boolean) => {
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const currentCartUSD = cartItems.reduce(
        (sum, ci) => sum + (ci.priceETB / currency.rateToETB) * ci.quantity,
        0
      );
      const cartPayload = {
        items: cartItems.map((c) => ({
          name: c.name,
          price_usd: Number((c.priceETB / currency.rateToETB).toFixed(2)),
          quantity: c.quantity,
        })),
        total_usd: Number(currentCartUSD.toFixed(2)),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          activeRecipient: activeRecipient,
          cart: cartPayload,
          userConfirmedApproval: Boolean(isExplicitApproval),
          language: language,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { text: responseText, toolActivities: newActivities, structuredResponse, approvalRequest } = data.data;

        // Record any tool activities into the session trace
        if (newActivities && newActivities.length > 0) {
          setToolActivities((prev) => [...newActivities, ...prev]);
        }

        // Check if create_paypal_order triggered Human-in-the-loop approval
        if (approvalRequest) {
          setPendingApprovalRequest(approvalRequest);
        }

        const assistantMessage: ChatMessage = {
          id: `msg-asst-${Date.now()}`,
          role: 'assistant',
          text: responseText || "I've processed your request with our verified catalog tools.",
          textAmharic: data.data.textAmharic,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: structuredResponse || undefined,
          toolActivities: newActivities || [],
          approvalRequest: approvalRequest || undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // If structured items were built by build_cart tool, auto-populate cart
        if (structuredResponse && structuredResponse.items && structuredResponse.items.length > 0) {
          handleAddStructuredItemsToCart(structuredResponse.items, structuredResponse.delivery_notes);
        }

        // If PayPal order was created with approval
        if (data.data.createdPaypalOrder && isExplicitApproval) {
          setIsCheckoutOpen(true);
        }
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered a temporary connection issue. Please try again or select one of the quick evaluation tools.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleCheckoutSuccess = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setActiveConfirmationOrder(order);

    // Call Gemini to generate personalized Amharic family message in background
    fetch('/api/generate-family-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        recipientName: order.smsDispatches?.[0]?.recipientName || activeRecipient.name,
        relationship: activeRecipient.relationship,
        items: order.items,
        senderName: order.senderName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.amharicMessage) {
          order.amharicGreeting = data.amharicMessage;
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, amharicGreeting: data.amharicMessage } : o))
          );
          setActiveConfirmationOrder((prev) =>
            prev && prev.id === order.id ? { ...prev, amharicGreeting: data.amharicMessage } : prev
          );
        }
      })
      .catch((err) => console.warn('Family greeting generator error:', err));

    const orderChatNotice: ChatMessage = {
      id: `msg-order-${Date.now()}`,
      role: 'assistant',
      text: language === 'am' 
        ? `🎉 ትዕዛዝ #${order.orderNumber} በተሳካ ሁኔታ ተጠናቋል! ፈጣን የኤስኤምኤስ ማረጋገጫ እና ባለ 20-ዲጂት የኤሌክትሪክ ቶከን በኢትዮጵያ ላሉ ቤተሰቦችዎ ተልኳል።`
        : `🎉 Order #${order.orderNumber} successfully processed! Instant SMS notifications and 20-digit EEU power tokens have been generated and dispatched to your family in Ethiopia.`,
      textAmharic: 'እግዚአብሔር ይስጥልኝ! ለቤተሰብዎ በተሳካ ሁኔታ ተልኳል።',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, orderChatNotice]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Navigation Header */}
      <Header
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        recipients={recipients}
        activeRecipient={activeRecipient}
        onSelectRecipient={setActiveRecipient}
        onOpenRecipientModal={() => setIsRecipientModalOpen(true)}
        onOpenCatalogModal={() => setIsCatalogOpen(true)}
        onOpenOrderHistoryModal={() => setIsOrderHistoryOpen(true)}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        isCartOpen={isCartOpen}
        onToggleAgentActivity={() => setIsAgentActivityOpen(!isAgentActivityOpen)}
        isAgentActivityOpen={isAgentActivityOpen}
        activityCount={toolActivities.length}
        language={language}
        onLanguageChange={setLanguage}
        currentView={currentView}
        onNavigateView={(v) => {
          setCurrentView(v);
          window.location.hash = v === 'orders' ? '#orders' : '';
        }}
        orderCount={orders.length}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 4-Step Progress Stepper */}
      <ProgressStepper
        currentStep={
          isCheckoutOpen ? 4 : pendingApprovalRequest ? 3 : cartItems.length > 0 ? 2 : 1
        }
        t={t}
      />

      {/* Main Content Area: Either Orders History Page OR Chat Area + Agent Activity + Cart */}
      {currentView === 'orders' ? (
        <main className="flex-1 overflow-y-auto w-full">
          <OrdersPage
            orders={orders}
            recipients={recipients}
            onBackToChat={() => {
              setCurrentView('chat');
              window.location.hash = '';
            }}
            onViewOrderDetails={(order) => setActiveConfirmationOrder(order)}
            onOpenRecipientView={(order) => setSharedRecipientOrder(order)}
            language={language}
          />
        </main>
      ) : (
        /* Main Layout: Gemini Agent Chat on Left + Agent Activity Panel in Middle/Right + Cart on Right */
        <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto relative">
          
          {/* Left / Center: Interactive AI Agent Chat */}
          <div className="flex-1 min-w-0 flex flex-col">
            <ChatArea
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              currency={currency}
              activeRecipient={activeRecipient}
              onAddToCart={handleAddToCart}
              onAddStructuredItemsToCart={handleAddStructuredItemsToCart}
              onClearChat={handleClearChat}
              onOpenAgentActivity={() => setIsAgentActivityOpen(true)}
              onApprovePayment={handleApprovePayment}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              language={language}
            />
          </div>

          {/* Real-time Agent Activity Side Panel (Desktop, Tablet & Mobile) */}
          {isAgentActivityOpen && (
            <AgentActivityPanel
              activities={toolActivities}
              isOpen={isAgentActivityOpen}
              onClose={() => setIsAgentActivityOpen(false)}
              onClearActivities={() => setToolActivities([])}
              pendingApprovalRequest={pendingApprovalRequest}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              onRunTestTool={handleRunTestTool}
              currency={currency}
              activeRecipient={activeRecipient}
              isExecuting={isToolExecuting}
            />
          )}

          {/* Right: Cart & Order Breakdown Panel (Desktop) */}
          <div className="hidden xl:block shrink-0">
            <CartPanel
              items={cartItems}
              currency={currency}
              isOpen={true}
              onClose={() => setIsCartOpen(false)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onProceedToCheckout={() => setIsCheckoutOpen(true)}
              onUpdateCustomDetails={handleUpdateCustomDetails}
              onQuickAddItem={handleQuickAddItem}
              language={language}
            />
          </div>

          {/* Mobile / Tablet Slide-in Cart Panel */}
          <div className="xl:hidden">
            <CartPanel
              items={cartItems}
              currency={currency}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onProceedToCheckout={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              onUpdateCustomDetails={handleUpdateCustomDetails}
              onQuickAddItem={handleQuickAddItem}
              language={language}
            />
          </div>

        </main>
      )}

      {/* Modals */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        currency={currency}
        activeRecipient={activeRecipient}
        onAddToCart={handleAddToCart}
        onAskAgentAboutItem={handleAskAgentAboutItem}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        activeRecipient={activeRecipient}
        recentUserText={messages.slice().reverse().find((m) => m.role === 'user')?.text || ''}
        onCheckoutSuccess={handleCheckoutSuccess}
        language={language}
      />

      <OrderConfirmationModal
        isOpen={!!activeConfirmationOrder}
        order={activeConfirmationOrder}
        onClose={() => setActiveConfirmationOrder(null)}
        onOpenRecipientView={(ord) => setSharedRecipientOrder(ord)}
        language={language}
      />

      <RecipientModal
        isOpen={isRecipientModalOpen}
        onClose={() => setIsRecipientModalOpen(false)}
        recipients={recipients}
        activeRecipient={activeRecipient}
        onSelectRecipient={setActiveRecipient}
        onAddRecipient={(newRec) => {
          setRecipients((prev) => [...prev, newRec]);
          setActiveRecipient(newRec);
        }}
        onDeleteRecipient={(id) => {
          setRecipients((prev) => prev.filter((r) => r.id !== id));
          if (activeRecipient.id === id) {
            const remaining = recipients.filter((r) => r.id !== id);
            if (remaining.length > 0) setActiveRecipient(remaining[0]);
          }
        }}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onViewOrderDetails={(order) => {
          setIsOrderHistoryOpen(false);
          setActiveConfirmationOrder(order);
        }}
        onOpenRecipientView={(ord) => {
          setIsOrderHistoryOpen(false);
          setSharedRecipientOrder(ord);
        }}
        onOpenFullPage={() => {
          setCurrentView('orders');
          window.location.hash = '#orders';
        }}
        language={language}
      />

      {/* Onboarding 3-Screen Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectPrompt={(prompt) => {
          setIsOnboardingOpen(false);
          setCurrentView('chat');
          window.location.hash = '';
          handleSendMessage(prompt);
        }}
        language={language}
      />

      {/* Visible Global Footer */}
      <footer className="bg-white border-t border-stone-200 py-3.5 px-4 text-center text-xs text-stone-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 tracking-tight">
              Diaspora<span className="text-emerald-700">Pay</span>
            </span>
            <span>•</span>
            <span className="text-stone-600">
              {language === 'am' ? 'የኢትዮጵያ ዲያስፖራ የቤተሰብ ድጋፍ ረዳት' : 'Ethiopian Diaspora Family Support Agent'}
            </span>
          </div>

          {/* Requested visible footer label */}
          <div className="flex items-center gap-2 bg-stone-100/80 px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs font-semibold text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built with PayPal Sandbox + Gemini</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400">
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600 rounded"
            >
              {language === 'am' ? 'የአጠቃቀም መመሪያ' : 'How It Works'}
            </button>
            <span>•</span>
            <span className="font-mono text-[10px]">15 Catalog Merchants</span>
          </div>
        </div>
      </footer>

      <MobileBottomNav
        activeTab={
          currentView === 'orders'
            ? 'orders'
            : isCartOpen
            ? 'cart'
            : isOnboardingOpen
            ? 'help'
            : 'chat'
        }
        onSelectTab={(tab) => {
          if (tab === 'chat') {
            setCurrentView('chat');
            setIsCartOpen(false);
            window.location.hash = '';
          } else if (tab === 'cart') {
            setCurrentView('chat');
            setIsCartOpen(true);
          } else if (tab === 'orders') {
            setCurrentView('orders');
            setIsCartOpen(false);
            window.location.hash = '#orders';
          } else if (tab === 'help') {
            setIsOnboardingOpen(true);
          }
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        t={t}
      />

    </div>
  );
}
