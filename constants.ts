import { Asset, Timeframe } from './types';

export const SUPPORTED_ASSETS: Asset[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'Crypto' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex' },
  { symbol: 'XAU/USD', name: 'Gold Spot', category: 'Commodities' },
  { symbol: 'SPX500', name: 'S&P 500 Index', category: 'Equities' },
];

export const BINANCE_SYMBOL_MAP: Record<string, string> = {
  'BTC/USD': 'BTCUSDT',
  'ETH/USD': 'ETHUSDT',
};

export const INITIAL_TIMEFRAME = Timeframe.H1;

// Simulation constants
export const UPDATE_INTERVAL_MS = 2000;
export const AI_ANALYSIS_INTERVAL_MS = 15000; 

export const DISCLAIMER_TEXT = "INVESTMAL AI IS A DECISION INTELLIGENCE PLATFORM. IT DOES NOT PROVIDE PERSONALIZED FINANCIAL ADVICE OR TRADING SIGNALS. PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.";