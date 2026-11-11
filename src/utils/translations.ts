export type { Language } from '../types';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  agentBadge: string;
  liveRate: string;
  zeroSpread: string;
  forRecipient: string;
  familyInEthiopia: string;
  addNewRecipient: string;
  manageFamilyBook: string;
  currency: string;
  catalog: string;
  orders: string;
  agentActivity: string;
  cart: string;
  langEn: string;
  langAm: string;

  // Chat Area
  welcomeTitle: string;
  welcomeDescription: string;
  testPromptsLabel: string;
  chatPlaceholder: string;
  voiceDictate: string;
  voiceListening: string;
  voiceLangAm: string;
  voiceLangEn: string;
  voiceUnsupported: string;
  send: string;
  pressEnter: string;
  clarifyingQuestion: string;
  catalogMatch: string;
  verifiedVendors: string;
  addToCart: string;
  addAllToCart: string;
  addedAll: string;
  viewJson: string;
  hideJson: string;
  copyJson: string;
  copied: string;
  resetChat: string;
  evaluatingAmbiguity: string;

  // Cart Panel
  diasporaCart: string;
  itemsSelected: string;
  clearAll: string;
  emptyCartTitle: string;
  emptyCartDesc: string;
  subtotal: string;
  serviceFee: string;
  freeDelivery: string;
  total: string;
  proceedToCheckout: string;
  deliveryNotes: string;
  meterNumber: string;
  phoneNumber: string;

  // Checkout Modal
  checkoutTitle: string;
  checkoutSubtitle: string;
  recipientSummary: string;
  deliveryTo: string;
  paymentMethod: string;
  sandboxNotice: string;
  payWithPayPal: string;
  offlineDemoMode: string;
  offlineDemoNotice: string;
  completeSandboxPayment: string;
  processingPayment: string;
  safetyCheckTitle: string;
  safetyAuditLow: string;
  safetyAuditMedium: string;
  safetyAuditHigh: string;
  safetyConfirmRequired: string;
  iConfirmSafe: string;
  whyThisMatters: string;
  whyThisMattersDesc: string;
  cartSubtotal: string;
  paypalFeeEstimate: string;
  estimateTag: string;
  totalToPay: string;
  riskLevelLabel: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  recommendedActionLabel: string;
  highRiskConfirmWarning: string;
  highRiskConfirmCheckbox: string;
  highRiskLockedMessage: string;

  // Orders Page & Filters
  ordersPageTitle: string;
  ordersPageSubtitle: string;
  filterByRecipient: string;
  filterByCategory: string;
  allRecipients: string;
  allCategories: string;
  searchOrdersPlaceholder: string;
  orderDate: string;
  orderStatus: string;
  orderTotal: string;
  recipientLabel: string;
  noMatchingOrders: string;
  clearFilters: string;

  // Order Confirmation & Share
  orderConfirmed: string;
  orderConfirmedDesc: string;
  verifiedPayPalSandbox: string;
  shareWithFamily: string;
  shareViaWhatsApp: string;
  shareViaTelegram: string;
  shareViaSMS: string;
  copyShareLink: string;
  linkCopied: string;
  openFamilyPage: string;
  meterTokenLabel: string;
  copyToken: string;
  tokenCopied: string;
  doneBackToChat: string;
  geminiBlessingTitle: string;

  // Recipient Page / Family View
  familyDispatchTitle: string;
  familyDispatchSubtitle: string;
  giftFromDiaspora: string;
  sentBy: string;
  orderNumber: string;
  deliveryStatus: string;
  statusDelivered: string;
  statusInTransit: string;
  statusTokenReady: string;
  itemsListTitle: string;
  vendorLabel: string;
  directKeypadInstructions: string;
  backToDiasporaPay: string;
}

export const TRANSLATIONS: Record<'en' | 'am', Translations> = {
  en: {
    appTitle: 'DiasporaPay',
    appSubtitle: 'Groceries, Bills & Rides to Ethiopia',
    agentBadge: 'AI Agent',
    liveRate: 'Live Rate:',
    zeroSpread: '0% spread',
    forRecipient: 'For:',
    familyInEthiopia: 'Family in Ethiopia',
    addNewRecipient: '+ Add New',
    manageFamilyBook: 'Manage Family Book',
    currency: 'Currency',
    catalog: 'Catalog',
    orders: 'Orders',
    agentActivity: 'Agent Activity',
    cart: 'Cart',
    langEn: 'English',
    langAm: 'አማርኛ',

    welcomeTitle: 'DiasporaPay Gemini Agent',
    welcomeDescription:
      'Describe what your family in Ethiopia needs in plain English or Amharic. The agent matches your need strictly against our 15-item mock vendor catalog and calls Gemini function tools in real time.',
    testPromptsLabel: 'Quick Prompts to Test Behavior:',
    chatPlaceholder: "Describe your need in English or አማርኛ (e.g. 'Send 25kg injera flour and $15 electricity to mom')...",
    voiceDictate: 'Voice input (Click to speak)',
    voiceListening: 'Listening... Speak now in English or Amharic',
    voiceLangAm: 'Amharic Voice',
    voiceLangEn: 'English Voice',
    voiceUnsupported: 'Voice input is not supported in this browser. You can type in English or Amharic.',
    send: 'Send message',
    pressEnter: 'Press Enter to send',
    clarifyingQuestion: 'Clarifying Question Required',
    catalogMatch: 'Official 15-Item Catalog Match',
    verifiedVendors: 'Strictly Verified Ethiopian Vendors',
    addToCart: 'Add to Cart',
    addAllToCart: 'Add All Items to Cart',
    addedAll: 'Added All to Cart ✓',
    viewJson: 'Inspect Raw Tool JSON',
    hideJson: 'Hide Tool JSON',
    copyJson: 'Copy JSON',
    copied: 'Copied!',
    resetChat: 'Reset Chat',
    evaluatingAmbiguity: 'Gemini Agent is evaluating catalog vendors & checking for ambiguity...',

    diasporaCart: 'Diaspora Cart',
    itemsSelected: 'items selected',
    clearAll: 'Clear',
    emptyCartTitle: 'Your cart is empty',
    emptyCartDesc: 'Ask the Gemini Agent in chat or browse the catalog to add items for your family.',
    subtotal: 'Subtotal',
    serviceFee: 'Delivery & Service Fee',
    freeDelivery: 'FREE (Orders > $50)',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    deliveryNotes: 'Fulfillment & Delivery Notes',
    meterNumber: 'Prepaid Meter Number',
    phoneNumber: 'Recipient Phone',

    checkoutTitle: 'Secure Sandbox Checkout',
    checkoutSubtitle: 'Send real goods & utility tokens directly to family in Addis Ababa',
    recipientSummary: 'Recipient in Ethiopia',
    deliveryTo: 'Delivery To',
    paymentMethod: 'Payment Method',
    sandboxNotice: 'SANDBOX – test payment with PayPal Orders v2',
    payWithPayPal: 'Pay with PayPal',
    offlineDemoMode: 'Offline demo mode',
    offlineDemoNotice: 'Simulates instantaneous payment capture without requiring PayPal sandbox client credentials.',
    completeSandboxPayment: 'Complete Sandbox Payment',
    processingPayment: 'Authorizing with PayPal Sandbox...',
    safetyCheckTitle: 'AI Safety Audit',
    safetyAuditLow: 'LOW RISK: Transaction fits normal household parameters.',
    safetyAuditMedium: 'MODERATE RISK: Review amounts before approving.',
    safetyAuditHigh: 'HIGH RISK: Unusually high transfer or urgent coercion flagged.',
    safetyConfirmRequired: 'You must confirm this transaction to proceed.',
    iConfirmSafe: 'I have verified the recipient and authorize this payment',
    whyThisMatters: 'Why this matters',
    whyThisMattersDesc: 'Zero hidden remittance markup. Traditional wire services charge 8–12% in hidden exchange rate spreads and payout fees. With DiasporaPay, your recipient receives 100% of the purchased goods, electricity tokens, and ride credits in Ethiopia with zero deductions.',
    cartSubtotal: 'Cart Subtotal',
    paypalFeeEstimate: 'PayPal Processing Fee',
    estimateTag: 'estimate',
    totalToPay: 'Total',
    riskLevelLabel: 'Risk Level',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',
    recommendedActionLabel: 'Recommended Action',
    highRiskConfirmWarning: 'High Risk Flagged – Explicit User Confirmation Required',
    highRiskConfirmCheckbox: 'I have re-confirmed with my recipient in Ethiopia and explicitly authorize this high-risk transfer.',
    highRiskLockedMessage: 'Checkout is locked. Because this transaction was flagged as High Risk, you must check the box above to authorize it.',

    ordersPageTitle: 'Orders History',
    ordersPageSubtitle: 'Track status, recipient deliveries, electricity meter tokens & receipts',
    filterByRecipient: 'Recipient',
    filterByCategory: 'Category',
    allRecipients: 'All Recipients',
    allCategories: 'All Categories',
    searchOrdersPlaceholder: 'Search by order #, recipient, or item...',
    orderDate: 'Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    recipientLabel: 'Recipient',
    noMatchingOrders: 'No orders found matching the selected filters.',
    clearFilters: 'Clear Filters',

    orderConfirmed: 'Order Confirmed & Fulfilled!',
    orderConfirmedDesc: 'እግዚአብሔር ይስጥልኝ! Notifications and tokens have been sent to your family in Ethiopia.',
    verifiedPayPalSandbox: 'Verified via PayPal Sandbox',
    shareWithFamily: 'Share with Family',
    shareViaWhatsApp: 'WhatsApp',
    shareViaTelegram: 'Telegram',
    shareViaSMS: 'SMS Message',
    copyShareLink: 'Copy Link',
    linkCopied: 'Link Copied to Clipboard!',
    openFamilyPage: 'Open Recipient Page',
    meterTokenLabel: '20-Digit EEU Keypad STS Token',
    copyToken: 'Copy Token',
    tokenCopied: 'Token Copied!',
    doneBackToChat: 'Done & Back to Chat',
    geminiBlessingTitle: 'Gemini Amharic Family Greeting',

    familyDispatchTitle: 'DiasporaPay Family Dispatch',
    familyDispatchSubtitle: 'የቤተሰብ መረጃ • Read-Only Recipient View',
    giftFromDiaspora: 'A gift sent with love from abroad',
    sentBy: 'Sent with love by',
    orderNumber: 'Order Number',
    deliveryStatus: 'Delivery Status',
    statusDelivered: 'Delivered / Fulfilled',
    statusInTransit: 'Dispatched & In Transit',
    statusTokenReady: 'STS Electricity Token Ready',
    itemsListTitle: 'Items & Services Included',
    vendorLabel: 'Verified Merchant:',
    directKeypadInstructions: 'Type this 20-digit code directly into your CIU prepaid keypad at home.',
    backToDiasporaPay: 'Back to DiasporaPay Portal',
  },

  am: {
    appTitle: 'ዲያስፖራ ፔይ',
    appSubtitle: 'ለቤተሰብ ሸቀጣሸቀጥ፣ የመብራት ክፍያ እና ታክሲ',
    agentBadge: 'የአይ ረዳት',
    liveRate: 'የቀጥታ ምንዛሬ:',
    zeroSpread: '0% ተጨማሪ ክፍያ',
    forRecipient: 'ተቀባይ:',
    familyInEthiopia: 'በኢትዮጵያ ያሉ ቤተሰቦች',
    addNewRecipient: '+ አዲስ ተቀባይ መዝግብ',
    manageFamilyBook: 'የቤተሰብ ማስታወሻ ደብተር',
    currency: 'የገንዘብ ዓይነት',
    catalog: 'ካታሎግ',
    orders: 'ትዕዛዞች',
    agentActivity: 'የረዳቱ ተግባር',
    cart: 'ቅርጫት',
    langEn: 'English',
    langAm: 'አማርኛ',

    welcomeTitle: 'የዲያስፖራ ፔይ ጀሚኒ ረዳት',
    welcomeDescription:
      'በኢትዮጵያ ውስጥ ለቤተሰብዎ የሚያስፈልገውን በእንግሊዝኛ ወይም በአማርኛ በግልጽ ይግለጹ። ረዳቱ ፍላጎትዎን ከ15ቱ የተረጋገጡ ዕቃዎች ካታሎግ ጋር በጥንቃቄ በማዛመድ የጀሚኒ ተግባር መሣሪያዎችን ወዲያውኑ ይጠራል።',
    testPromptsLabel: 'ፈጣን የሙከራ ጥያቄዎች:',
    chatPlaceholder: "ፍላጎትዎን በአማርኛ ወይም English ይጻፉ (ለምሳሌ: 'ለእማማ 25 ኪ.ግ ጤፍ እና የ15 ዶላር መብራት ላክ')...",
    voiceDictate: 'በድምፅ ለመናገር ይጫኑ',
    voiceListening: 'እያዳመጥኩ ነው... አሁን በአማርኛ ወይም English ይናገሩ',
    voiceLangAm: 'የአማርኛ ድምፅ',
    voiceLangEn: 'የእንግሊዝኛ ድምፅ',
    voiceUnsupported: 'ይህ አሳሽ የድምፅ ግብዓትን አይደግፍም። እባክዎ በአማርኛ ወይም እንግሊዝኛ ይተይቡ።',
    send: 'መልዕክት ላክ',
    pressEnter: 'ለመላክ Enter ይጫኑ',
    clarifyingQuestion: 'ተጨማሪ ማብራሪያ ያስፈልጋል',
    catalogMatch: 'ከተረጋገጠው 15 ዕቃዎች ካታሎግ የተገኘ',
    verifiedVendors: 'የተረጋገጡ የኢትዮጵያ ነጋዴዎች',
    addToCart: 'ወደ ቅርጫት ጨምር',
    addAllToCart: 'ሁሉንም ወደ ቅርጫት ጨምር',
    addedAll: 'ሁሉም ተጨምሯል ✓',
    viewJson: 'የረዳቱን የJSON መረጃ መርምር',
    hideJson: 'የJSON መረጃ ደብቅ',
    copyJson: 'JSON ቅዳ',
    copied: 'ተቀድቷል!',
    resetChat: 'ውይይት አድስ',
    evaluatingAmbiguity: 'የጀሚኒ ረዳት ዕቃዎችንና ማብራሪያዎችን በመገምገም ላይ ነው...',

    diasporaCart: 'የዲያስፖራ ቅርጫት',
    itemsSelected: 'የተመረጡ ዕቃዎች',
    clearAll: 'አጽዳ',
    emptyCartTitle: 'ቅርጫትዎ ባዶ ነው',
    emptyCartDesc: 'ለቤተሰብዎ ዕቃዎችን ለመጨመር በውይይቱ ረዳቱን ይጠይቁ ወይም ካታሎጉን ይመልከቱ።',
    subtotal: 'የዕቃዎች ድምር',
    serviceFee: 'የማድረሻ እና የአገልግሎት ክፍያ',
    freeDelivery: 'ነፃ (ከ$50 ዶላር በላይ)',
    total: 'ጠቅላላ ድምር',
    proceedToCheckout: 'ወደ ክፍያ ሂድ',
    deliveryNotes: 'የማድረሻ መመሪያዎች',
    meterNumber: 'የቆጣሪ ቁጥር',
    phoneNumber: 'የተቀባይ ስልክ',

    checkoutTitle: 'ደህንነቱ የተጠበቀ የPayPal Sandbox ክፍያ',
    checkoutSubtitle: 'እውነተኛ ዕቃዎችንና የመብራት ቶከኖችን በቀጥታ በአዲስ አበባ ላሉ ቤተሰቦች ይላኩ',
    recipientSummary: 'በኢትዮጵያ ያለ ተቀባይ',
    deliveryTo: 'ማድረሻ አድራሻ',
    paymentMethod: 'የክፍያ ዘዴ',
    sandboxNotice: 'SANDBOX – የPayPal Orders v2 የሙከራ ክፍያ',
    payWithPayPal: 'በPayPal ክፈል',
    offlineDemoMode: 'ከመስመር ውጭ የሙከራ ሁነታ',
    offlineDemoNotice: 'ያለ PayPal የይለፍ ቃል ክፍያን ወዲያውኑ ለማስመሰል ያስችላል።',
    completeSandboxPayment: 'ክፍያውን አጠናቅቅ',
    processingPayment: 'ከPayPal Sandbox ጋር በመገናኘት ላይ...',
    safetyCheckTitle: 'የአይ ደህንነት ምርመራ',
    safetyAuditLow: 'ዝቅተኛ ስጋት: ክፍያው የተለመደ የቤተሰብ ድጋፍ ወሰንን ያከበረ ነው።',
    safetyAuditMedium: 'መካከለኛ ስጋት: እባክዎ ክፍያውን ከማጽደቅዎ በፊት መጠኑን ያረጋግጡ።',
    safetyAuditHigh: 'ከፍተኛ ስጋት: ያልተለመደ ከፍተኛ መጠን ወይም አጣዳፊ ግፊት ተስተውሏል።',
    safetyConfirmRequired: 'ክፍያውን ለማጠናቀቅ ማረጋገጫ መስጠት አለብዎት።',
    iConfirmSafe: 'ተቀባዩን አረጋግጫለሁ፣ ክፍያው እንዲፈጸም ፈቅጃለሁ',
    whyThisMatters: 'ለምን ይህ አስፈላጊ ሆነ?',
    whyThisMattersDesc: 'ምንም አይነት የተደበቀ የዋጋ ተመን ወይም ቅናሽ የለም። ባህላዊ የገንዘብ አስተላላፊዎች 8–12% የተደበቀ የትርፍ ክፍያ ይወስዳሉ። በዲያስፖራ ፔይ በኩል ግን የከፈሉት ሙሉ ገንዘብ ያለምንም ቅናሽ በኢትዮጵያ ላሉ ቤተሰቦችዎ በቀጥታ ለዕቃዎችና ለመብራት ቶከን ይውላል።',
    cartSubtotal: 'የዕቃዎች ድምር',
    paypalFeeEstimate: 'የPayPal ክፍያ ማስፈጸሚያ',
    estimateTag: 'ግምት',
    totalToPay: 'ጠቅላላ የሚከፈል',
    riskLevelLabel: 'የስጋት ደረጃ',
    riskLow: 'ዝቅተኛ ስጋት',
    riskMedium: 'መካከለኛ ስጋት',
    riskHigh: 'ከፍተኛ ስጋት',
    recommendedActionLabel: 'የሚመከር እርምጃ',
    highRiskConfirmWarning: 'ከፍተኛ ስጋት ተለይቷል – የተጠቃሚ ድጋሚ ማረጋገጫ ግዴታ ነው',
    highRiskConfirmCheckbox: 'በኢትዮጵያ ካለው ተቀባይ ጋር በስልክ አረጋግጫለሁ፤ ይህንን ክፍያ በግልጽ አጸድቃለሁ።',
    highRiskLockedMessage: 'ክፍያው ተቆልፏል። ይህ ትዕዛዝ ከፍተኛ ስጋት ስላለው ከላይ ያለውን ሳጥን ምልክት በማድረግ ማረጋገጥ አለብዎት።',

    ordersPageTitle: 'የትዕዛዝ ታሪክ',
    ordersPageSubtitle: 'የትዕዛዝ ሁኔታዎችን፣ የተላኩ የኤሌክትሪክ ቶከኖችን እና ደረሰኞችን ይከታተሉ',
    filterByRecipient: 'ተቀባይ',
    filterByCategory: 'ዓይነት',
    allRecipients: 'ሁሉም ተቀባዮች',
    allCategories: 'ሁሉም ክፍሎች',
    searchOrdersPlaceholder: 'በትዕዛዝ ቁጥር፣ ተቀባይ ወይም ዕቃ ፈልግ...',
    orderDate: 'ቀን',
    orderStatus: 'ሁኔታ',
    orderTotal: 'ጠቅላላ',
    recipientLabel: 'ተቀባይ',
    noMatchingOrders: 'ከተመረጡት ማጣሪያዎች ጋር የሚስማማ ትዕዛዝ አልተገኘም።',
    clearFilters: 'ማጣሪያዎችን አጽዳ',

    orderConfirmed: 'ትዕዛዝዎ ተጠናቋል!',
    orderConfirmedDesc: 'እግዚአብሔር ይስጥልኝ! መልዕክቶች እና ቶከኖች በኢትዮጵያ ላሉ ቤተሰቦችዎ ተልከዋል።',
    verifiedPayPalSandbox: 'በPayPal Sandbox የተረጋገጠ',
    shareWithFamily: 'ለቤተሰብ አጋራ',
    shareViaWhatsApp: 'ዋትስአፕ',
    shareViaTelegram: 'ቴሌግራም',
    shareViaSMS: 'የአጭር መልዕክት (SMS)',
    copyShareLink: 'ሊንኩን ቅዳ',
    linkCopied: 'ሊንኩ ተቀድቷል!',
    openFamilyPage: 'የተቀባይ ገጽ ክፈት',
    meterTokenLabel: 'የ20-ዲጂት የኤሌክትሪክ ቶከን ቁጥር (EEU STS)',
    copyToken: 'ቶከኑን ገልብጥ',
    tokenCopied: 'ቶከኑ ተገልብጧል!',
    doneBackToChat: 'ተጠናቋል • ወደ ውይይት ተመለስ',
    geminiBlessingTitle: 'በጀሚኒ የተጻፈ የፍቅር እና የመልካም ምኞት መልዕክት',

    familyDispatchTitle: 'የዲያስፖራ ፔይ የቤተሰብ መረጃ ገጽ',
    familyDispatchSubtitle: 'የተላከ ድጋፍ መረጃ • ለተቀባይ ብቻ የሚታይ',
    giftFromDiaspora: 'ከውጭ አገር በውድ ቤተሰብ በፍቅር የተላከ ስጦታ',
    sentBy: 'የላከው ሰው:',
    orderNumber: 'የትዕዛዝ ቁጥር:',
    deliveryStatus: 'የትዕዛዙ ሁኔታ',
    statusDelivered: 'ደርሷል / ተጠናቋል',
    statusInTransit: 'ተረክቦ በመጓዝ ላይ ነው',
    statusTokenReady: 'የመብራት ኃይል ቶከን ዝግጁ ነው',
    itemsListTitle: 'የተላኩ ዕቃዎች እና አገልግሎቶች',
    vendorLabel: 'የተረጋገጠ አቅራቢ:',
    directKeypadInstructions: 'ይህን ባለ 20-ዲጂት ቁጥር በቤትዎ ባለው የቅድመ ክፍያ ቆጣሪ መተየቢያ ላይ ያስገቡ።',
    backToDiasporaPay: 'ወደ ዲያስፖራ ፔይ ዋና ገጽ ተመለስ',
  },
};
