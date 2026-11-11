import React, { useState } from 'react';
import { ToolCallActivity, HumanApprovalRequest, Currency, Recipient } from '../types';
import { 
  Zap, 
  Search, 
  ShoppingCart, 
  ShieldAlert, 
  CreditCard, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Play, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Terminal,
  Activity
} from 'lucide-react';

interface AgentActivityPanelProps {
  activities: ToolCallActivity[];
  isOpen: boolean;
  onClose: () => void;
  onClearActivities: () => void;
  pendingApprovalRequest: HumanApprovalRequest | null;
  onApprovePayment: (approval: HumanApprovalRequest) => void;
  onRejectPayment: (requestId: string) => void;
  onRunTestTool: (toolName: ToolCallActivity['toolName'], customArgs?: any) => Promise<void>;
  currency: Currency;
  activeRecipient: Recipient;
  isExecuting?: boolean;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  activities,
  isOpen,
  onClose,
  onClearActivities,
  pendingApprovalRequest,
  onApprovePayment,
  onRejectPayment,
  onRunTestTool,
  currency,
  activeRecipient,
  isExecuting = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedTrace, setCopiedTrace] = useState(false);
  const [testRunningTool, setTestRunningTool] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'expert'>('simple');

  if (!isOpen) return null;

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === 'all') return true;
    return act.toolName === selectedFilter;
  });

  const getToolMeta = (toolName: ToolCallActivity['toolName']) => {
    switch (toolName) {
      case 'search_catalog':
        return {
          label: 'search_catalog',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          badgeColor: 'bg-blue-600 text-white',
          icon: Search,
          description: 'Verified 15-item catalog lookup',
        };
      case 'build_cart':
        return {
          label: 'build_cart',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badgeColor: 'bg-emerald-700 text-white',
          icon: ShoppingCart,
          description: 'Constructs recipient shopping cart',
        };
      case 'run_safety_check':
        return {
          label: 'run_safety_check',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          badgeColor: 'bg-amber-600 text-white',
          icon: ShieldAlert,
          description: 'AI fraud & urgency auditing',
        };
      case 'create_paypal_order':
        return {
          label: 'create_paypal_order',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          badgeColor: 'bg-purple-700 text-white',
          icon: CreditCard,
          description: 'PayPal Orders v2 (Human-in-the-loop)',
        };
      case 'get_order_status':
        return {
          label: 'get_order_status',
          color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          badgeColor: 'bg-cyan-700 text-white',
          icon: Package,
          description: 'Live SMS & STS token tracker',
        };
      default:
        return {
          label: toolName,
          color: 'bg-stone-50 text-stone-700 border-stone-200',
          badgeColor: 'bg-stone-700 text-white',
          icon: Activity,
          description: 'Generic tool execution',
        };
    }
  };

  const handleCopyJson = (id: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllTrace = () => {
    navigator.clipboard.writeText(JSON.stringify(activities, null, 2));
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2500);
  };

  const handleRunQuickTest = async (toolName: ToolCallActivity['toolName'], args?: any) => {
    setTestRunningTool(toolName);
    try {
      await onRunTestTool(toolName, args);
    } finally {
      setTestRunningTool(null);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}
      <aside className="fixed md:static inset-y-0 right-0 h-full md:h-[calc(100vh-4.25rem)] sm:md:h-[calc(100vh-4.5rem)] w-full sm:w-[440px] lg:w-[480px] shrink-0 bg-white border-l border-stone-200/90 shadow-2xl md:shadow-xl flex flex-col z-50 md:z-30 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-stone-900 text-white border-b border-stone-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-white">Agent Activity</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Trace
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {viewMode === 'simple'
                  ? 'Plain-language steps of what the agent is doing'
                  : 'Gemini function calls & real-time execution inspect'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700 mr-1">
              <button
                type="button"
                onClick={() => setViewMode('simple')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  viewMode === 'simple'
                    ? 'bg-emerald-600 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Simple
              </button>
              <button
                type="button"
                onClick={() => setViewMode('expert')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  viewMode === 'expert'
                    ? 'bg-emerald-600 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Expert
              </button>
            </div>
            <button
              onClick={handleCopyAllTrace}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 text-xs transition-colors"
              title="Copy JSON Trace"
            >
              {copiedTrace ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClearActivities}
              className="text-stone-300 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-800 text-xs transition-colors"
              title="Clear activities"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Human-in-the-loop guarantee banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-200">
          <Lock className="w-4 h-4 text-purple-400 shrink-0" />
          <p className="text-[11px] leading-tight text-purple-200/90">
            <strong className="text-purple-300">Human-in-the-Loop Enforced:</strong> The agent cannot call <code className="bg-purple-900/60 text-purple-200 px-1 py-0.5 rounded text-[10px]">create_paypal_order</code> without explicit human confirmation.
          </p>
        </div>
      </div>

      {/* Interactive Test Scenario Strip for Judges */}
      <div className="p-3 bg-stone-50 border-b border-stone-200 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-600 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-700" />
            Quick Test Tools (1-Click Evaluation):
          </span>
          <span className="text-[10px] text-stone-400 lowercase">{activities.length} calls logged</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
          <button
            onClick={() => handleRunQuickTest('search_catalog', { query: 'injera teff flour' })}
            disabled={testRunningTool !== null}
            className="text-[11px] bg-white hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 text-stone-700 border border-stone-200 rounded-lg px-2 py-1.5 font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 truncate text-left"
          >
            <Search className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">1. search_catalog</span>
          </button>

          <button
            onClick={() =>
              handleRunQuickTest('build_cart', {
                items: [
                  { name: 'Injera Flour (Magna White Teff) 25kg', quantity: 1 },
                  { name: 'EEU Electricity Prepaid Top-Up ($15 / ~2,000 ETB)', quantity: 1 },
                ],
              })
            }
            disabled={testRunningTool !== null}
            className="text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-stone-700 border border-stone-200 rounded-lg px-2 py-1.5 font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 truncate text-left"
          >
            <ShoppingCart className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">2. build_cart</span>
          </button>

          <button
            onClick={() =>
              handleRunQuickTest('run_safety_check', {
                cart: {
                  items: [{ name: 'Holiday Feast Live Fat-Tailed Sheep', price_usd: 110.0, quantity: 3 }],
                  total_usd: 330.0,
                },
                notes: 'URGENT emergency! Power cutoff in 10 minutes, must send immediately!',
                is_urgent: true,
              })
            }
            disabled={testRunningTool !== null}
            className="text-[11px] bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-stone-700 border border-stone-200 rounded-lg px-2 py-1.5 font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 truncate text-left"
          >
            <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate">3. run_safety_check</span>
          </button>

          <button
            onClick={() =>
              handleRunQuickTest('create_paypal_order', {
                cart: {
                  items: [{ name: 'Injera Flour (Magna White Teff) 25kg', price_usd: 32.0, quantity: 1 }],
                  total_usd: 32.0,
                },
                user_confirmed_approval: false,
                recipient_name: activeRecipient.name,
              })
            }
            disabled={testRunningTool !== null}
            className="text-[11px] bg-white hover:bg-purple-50 hover:text-purple-900 hover:border-purple-300 text-stone-700 border border-stone-200 rounded-lg px-2 py-1.5 font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 truncate text-left"
          >
            <CreditCard className="w-3 h-3 text-purple-600 shrink-0" />
            <span className="truncate">4. create_paypal_order</span>
          </button>

          <button
            onClick={() => handleRunQuickTest('get_order_status', { order_id: 'ET-DP-819204' })}
            disabled={testRunningTool !== null}
            className="text-[11px] bg-white hover:bg-cyan-50 hover:text-cyan-900 hover:border-cyan-300 text-stone-700 border border-stone-200 rounded-lg px-2 py-1.5 font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 truncate text-left col-span-2 sm:col-span-1"
          >
            <Package className="w-3 h-3 text-cyan-600 shrink-0" />
            <span className="truncate">5. get_order_status</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-stone-200/80 bg-white shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {['all', 'search_catalog', 'build_cart', 'run_safety_check', 'create_paypal_order', 'get_order_status'].map((tool) => (
          <button
            key={tool}
            onClick={() => setSelectedFilter(tool)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedFilter === tool
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tool === 'all' ? 'All Tools' : tool.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Human-in-the-loop Pending Approval Banner (when create_paypal_order is waiting) */}
      {pendingApprovalRequest && (
        <div className="m-3 p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-md animate-pulse">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Human-in-the-Loop Action Required
              </span>
              <p className="text-xs text-amber-950 font-medium">
                The agent wants to create a PayPal Sandbox payment of{' '}
                <strong>${pendingApprovalRequest.totalUSD.toFixed(2)} USD</strong> for{' '}
                <strong>{pendingApprovalRequest.recipientName}</strong>.
              </p>
              <p className="text-[11px] text-amber-800">
                Under the strict security policy, payment cannot proceed until you grant explicit authorization.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-amber-200">
            <button
              onClick={() => onApprovePayment(pendingApprovalRequest)}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve & Create PayPal Order
            </button>
            <button
              onClick={() => onRejectPayment(pendingApprovalRequest.requestId)}
              className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Tool Call Activity Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#FAF8F5]">
        {filteredActivities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-stone-400" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">No Tool Invocations Yet</h4>
            <p className="text-xs text-stone-500 max-w-xs mt-1 leading-relaxed">
              Ask the agent to find teff flour, top up electricity, check safety, or click any of the <strong>Quick Test Tools</strong> above to watch the agent execute in real time.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const meta = getToolMeta(act.toolName);
            const Icon = meta.icon;
            const isExpanded = expandedId === act.id;
            const isCopied = copiedId === act.id;
            const isAwaiting = act.status === 'awaiting_approval';
            const isSuccess = act.status === 'success';

            return (
              <div
                key={act.id}
                className={`rounded-2xl border bg-white shadow-xs transition-all overflow-hidden ${
                  isAwaiting
                    ? 'border-amber-400 ring-2 ring-amber-300/40'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Tool header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : act.id)}
                  className="p-3 cursor-pointer flex items-start justify-between gap-2.5 select-none hover:bg-stone-50/60 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white ${meta.badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {act.toolName}()
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isAwaiting
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isSuccess
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}
                        >
                          {isAwaiting ? 'Awaiting Human Approval' : isSuccess ? 'Success' : 'Error'}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {act.reasoningNote || meta.description}
                      </p>

                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-stone-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {act.timestamp}
                        </span>
                        {act.durationMs !== undefined && (
                          <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                            {act.durationMs}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-stone-400 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Inspection Drawer (Inputs & Results) */}
                {isExpanded && (
                  <div className="p-3 bg-stone-50/80 border-t border-stone-100 space-y-3 text-xs">
                    
                    {/* Tool Inputs */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          Tool Inputs (Arguments):
                        </span>
                        <button
                          onClick={() => handleCopyJson(`${act.id}-inputs`, act.args)}
                          className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-[10px]"
                        >
                          {copiedId === `${act.id}-inputs` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-xl bg-stone-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36 border border-stone-800">
                        {JSON.stringify(act.args, null, 2)}
                      </pre>
                    </div>

                    {/* Tool Result */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          Tool Execution Output:
                        </span>
                        <button
                          onClick={() => handleCopyJson(`${act.id}-result`, act.result)}
                          className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-[10px]"
                        >
                          {copiedId === `${act.id}-result` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-[11px] overflow-x-auto max-h-48 border border-stone-800">
                        {JSON.stringify(act.result, null, 2)}
                      </pre>
                    </div>

                    {/* Human Approval Button inside activity card if awaiting approval */}
                    {isAwaiting && pendingApprovalRequest && (
                      <div className="pt-2">
                        <button
                          onClick={() => onApprovePayment(pendingApprovalRequest)}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Confirm Human Authorization (${pendingApprovalRequest.totalUSD.toFixed(2)} USD)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Metrics */}
      <div className="p-3 bg-stone-100 border-t border-stone-200 shrink-0 text-xs text-stone-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
          <span className="text-[11px] font-medium text-stone-700">
            Catalog Integrity: 15/15 vendors locked
          </span>
        </div>
        <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono border border-stone-300">
          Gemini 3.8 Flash Tools
        </span>
      </div>

    </aside>
  </>
  );
};
