import { Candle, MarketMetrics } from '../types';

export const calculateSMA = (data: Candle[], period: number): number => {
  if (data.length < period) return data[data.length - 1]?.close || 0;
  const slice = data.slice(-period);
  const sum = slice.reduce((acc, candle) => acc + candle.close, 0);
  return sum / period;
};

export const calculateRSI = (data: Candle[], period: number = 14): number => {
  if (data.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  // Simple calculation for demo speed (usually uses EMA smoothing)
  for (let i = data.length - period; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateVolatility = (data: Candle[], period: number = 20): number => {
    if(data.length < 2) return 0;
    const closes = data.slice(-period).map(c => c.close);
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const variance = closes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / closes.length;
    return Math.sqrt(variance);
}

export const getLatestMetrics = (data: Candle[]): MarketMetrics => {
  const latestClose = data[data.length - 1]?.close || 0;
  
  // Simulated MACD for demo purposes
  const sma12 = calculateSMA(data, 12);
  const sma26 = calculateSMA(data, 26);
  const macdValue = sma12 - sma26;
  const signal = macdValue * 0.8; // Rough approximation

  return {
    rsi: calculateRSI(data),
    sma20: calculateSMA(data, 20),
    sma50: calculateSMA(data, 50),
    macd: {
      value: macdValue,
      signal: signal,
      histogram: macdValue - signal
    },
    volatility: calculateVolatility(data)
  };
};
