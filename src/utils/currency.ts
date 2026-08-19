export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD';

// Mock exchange rates relative to INR
export const EXCHANGE_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 85,
  EUR: 92,
  GBP: 108,
  AUD: 56
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$'
};

/**
 * Converts an INR amount to the target currency.
 */
export function convertFromINR(amountInINR: number, currency: Currency): number {
  const rate = EXCHANGE_RATES[currency] || 1;
  if (currency === 'INR') return amountInINR;
  return Math.round(amountInINR / rate);
}

/**
 * Formats a given INR base price into a localized string with the selected currency symbol.
 */
export function formatPrice(amountInINR: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const converted = convertFromINR(amountInINR, currency);
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return `${symbol}${converted.toLocaleString(locale)}`;
}

/**
 * Returns currency symbol string.
 */
export function getCurrencySymbol(currency: Currency = 'INR'): string {
  return CURRENCY_SYMBOLS[currency] || '₹';
}
