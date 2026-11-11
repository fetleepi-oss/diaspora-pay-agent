import { DEFAULT_ETB_RATE } from './constants';

/**
 * Format a USD amount using Intl.NumberFormat.
 */
export function formatUSD(amount: number, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format an ETB amount using Intl.NumberFormat.
 */
export function formatETB(
  usdAmount: number,
  rate: number = DEFAULT_ETB_RATE,
  locale: string = 'en-US'
): string {
  const etb = Math.round(usdAmount * rate);
  try {
    return `${new Intl.NumberFormat(locale).format(etb)} ETB`;
  } catch {
    return `${etb.toLocaleString()} ETB`;
  }
}

/**
 * Format a date string or timestamp using Intl.DateTimeFormat.
 */
export function formatDateLocale(
  dateInput: string | number | Date,
  locale: string = 'en-US'
): string {
  try {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Get initials from a recipient name (e.g. "Almaz Tadesse" -> "AT").
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
