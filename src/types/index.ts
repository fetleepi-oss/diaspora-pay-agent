export type CategoryType = 'groceries' | 'utilities' | 'school' | 'rides' | 'health';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateToETB: number; // e.g. 1 USD = 132.50 ETB
  flag: string;
}

export interface Recipient {
  id: string;
  name: string;
  relationship: string;
  phone: string; // e.g. +251 91 123 4567
  city: string; // e.g. Addis Ababa
  subcity?: string; // e.g. Bole, Kirkos, Yeka
  specificAddress?: string; // e.g. Near Medhanialem Church, House 412
  meterNumber?: string; // EEU Prepaid Electricity Meter
  waterContractNumber?: string; // AAWSA
  notes?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  nameAmharic: string;
  category: CategoryType;
  description: string;
  descriptionAmharic?: string;
  priceETB: number;
  unit: string;
  deliveryTime: string;
  fulfillmentType: 'doorstep_delivery' | 'sms_token' | 'direct_topup' | 'digital_voucher';
  icon: string;
  badge?: string;
  popular?: boolean;
  options?: string[];
  placeholderField?: {
    label: string;
    key: string;
    placeholder: string;
  };
}

export interface CartItem {
  cartItemId: string;
  catalogItemId: string;
  name: string;
  nameAmharic: string;
  category: CategoryType;
  priceETB: number;
  quantity: number;
  fulfillmentType: 'doorstep_delivery' | 'sms_token' | 'direct_topup' | 'digital_voucher';
  recipient: Recipient;
  customDetails?: {
    meterNumber?: string;
    phoneNumber?: string;
    accountNumber?: string;
    specialInstructions?: string;
    selectedOption?: string;
  };
  addedByAgent?: boolean;
}

export interface StructuredAgentItem {
  name: string;
  vendor: string;
  price_usd: number;
  category: string;
}

export interface StructuredAgentResponse {
  items: StructuredAgentItem[];
  delivery_notes: string;
  total_usd: number;
  summary: string;
  clarifying_question: string | null;
}

export type SafetyRiskLevel = 'Low' | 'Medium' | 'High';

export interface SafetyCheckResult {
  isSuspicious: boolean;
  riskLevel: SafetyRiskLevel;
  reason: string;
  reasoning?: string;
  recommendedAction: string;
  flaggedTriggers: string[];
  total_audited_usd?: number;
  timestamp?: string;
}

export interface ToolCallActivity {
  id: string;
  toolName: 'search_catalog' | 'build_cart' | 'run_safety_check' | 'create_paypal_order' | 'get_order_status';
  args: any;
  result: any;
  status: 'success' | 'awaiting_approval' | 'error' | 'in_progress';
  timestamp: string;
  durationMs?: number;
  reasoningNote?: string;
}

export interface HumanApprovalRequest {
  requestId: string;
  cart: {
    items: Array<{ name: string; price_usd: number; quantity: number }>;
    total_usd: number;
  };
  recipientName: string;
  totalUSD: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  textAmharic?: string;
  timestamp: string;
  suggestedItems?: CatalogItem[];
  actionsApplied?: {
    type: 'add' | 'remove' | 'update_recipient';
    description: string;
  }[];
  structuredResponse?: StructuredAgentResponse;
  toolActivities?: ToolCallActivity[];
  approvalRequest?: HumanApprovalRequest;
  isTyping?: boolean;
}

export type Language = 'en' | 'am' | 'om' | 'ti' | 'ar' | 'fr';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  currency: Currency;
  items: CartItem[];
  subtotalETB: number;
  subtotalCurrency: number;
  serviceFeeCurrency: number;
  totalCurrency: number;
  paymentMethod: string;
  senderName: string;
  senderEmail: string;
  status: 'confirmed' | 'fulfilled' | 'in_transit';
  amharicGreeting?: string;
  paypalDetails?: {
    orderId: string;
    captureId?: string;
    payerEmail?: string;
    payerName?: string;
    status: string;
    isSandbox: boolean;
    recipientDescription?: string;
    isDemoMode?: boolean;
  };
  smsDispatches: {
    recipientName: string;
    recipientPhone: string;
    type: string;
    messageText: string;
    token?: string;
    trackingId?: string;
  }[];
}
