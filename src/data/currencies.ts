import { Currency } from '../types';

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToETB: 132.5,
    flag: '🇺🇸',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EU)',
    rateToETB: 143.2,
    flag: '🇪🇺',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToETB: 171.8,
    flag: '🇬🇧',
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    rateToETB: 96.4,
    flag: '🇨🇦',
  },
  {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rateToETB: 36.1,
    flag: '🇦🇪',
  },
  {
    code: 'SEK',
    symbol: 'kr ',
    name: 'Swedish Krona',
    rateToETB: 12.5,
    flag: '🇸🇪',
  },
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];
