export enum Timeframe {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1D',
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketMetrics {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  sma20: number;
  sma50: number;
  volatility: number; // ATR-based or similar
}

export interface Asset {
  symbol: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Equities' | 'Commodities';
}

export interface NarrativePoint {
  headline: string;
  explanation: string;
  confidence: number;
}

export interface RiskFactor {
  factor: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface AIAnalysisResult {
  marketState: 'Trending' | 'Ranging' | 'Volatile' | 'Uncertain';
  narrativePoints: NarrativePoint[];
  riskAnalysis: {
    overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: RiskFactor[];
  };
  mainConfidenceScore: number;
  timestamp: number;
}

export interface SystemHealth {
  latency: number;
  status: 'Operational' | 'Degraded' | 'Down';
  dataIntegrity: number;
}

export interface NewsItem {
  id: string;
  time: number;
  source: string;
  headline: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
}