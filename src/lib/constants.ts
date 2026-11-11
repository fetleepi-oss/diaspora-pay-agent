/**
 * Shared application constants and single source of truth for cart/fee calculations.
 */

export const DEFAULT_ETB_RATE = 132.5;
export const SERVICE_FEE_USD = 1.99;
export const FREE_DELIVERY_THRESHOLD_USD = 50;
export const STANDARD_DELIVERY_FEE_USD = 3.5;

// PayPal standard estimated fee for transparency card (2.9% + $0.30)
export const PAYPAL_FEE_PERCENT = 0.029;
export const PAYPAL_FEE_FIXED_USD = 0.3;

export interface CartTotals {
  subtotalUsd: number;
  deliveryFeeUsd: number;
  serviceFeeUsd: number;
  paypalFeeEstimateUsd: number;
  totalUsd: number;
  totalEtb: number;
}

/**
 * Single source of truth for computing cart totals in USD and ETB.
 */
export function calculateCartTotals(
  items: Array<{ priceUsd: number; quantity: number }>,
  etbRate: number = DEFAULT_ETB_RATE
): CartTotals {
  const subtotalUsd = Number(
    items.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0).toFixed(2)
  );
  const deliveryFeeUsd =
    subtotalUsd === 0 || subtotalUsd >= FREE_DELIVERY_THRESHOLD_USD
      ? 0
      : STANDARD_DELIVERY_FEE_USD;
  const serviceFeeUsd = subtotalUsd > 0 ? SERVICE_FEE_USD : 0;
  const baseTotal = subtotalUsd + deliveryFeeUsd + serviceFeeUsd;
  const paypalFeeEstimateUsd =
    subtotalUsd > 0
      ? Number((baseTotal * PAYPAL_FEE_PERCENT + PAYPAL_FEE_FIXED_USD).toFixed(2))
      : 0;
  const totalUsd = Number(baseTotal.toFixed(2));
  const totalEtb = Math.round(totalUsd * etbRate);

  return {
    subtotalUsd,
    deliveryFeeUsd,
    serviceFeeUsd,
    paypalFeeEstimateUsd,
    totalUsd,
    totalEtb,
  };
}
