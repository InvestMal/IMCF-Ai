import { Asset, Candle, Timeframe } from '../types';
import { BINANCE_SYMBOL_MAP } from '../constants';

// --- Simulation Helpers ---

const generateCandle = (prevCandle: Candle, volatility: number = 0.002): Candle => {
  const movement = (Math.random() - 0.5) * prevCandle.close * volatility;
  const open = prevCandle.close;
  const close = open + movement;
  const high = Math.max(open, close) + Math.random() * Math.abs(movement);
  const low = Math.min(open, close) - Math.random() * Math.abs(movement);
  const volume = Math.floor(Math.random() * 1000) + 500;

  return {
    time: prevCandle.time + 60 * 1000, 
    open,
    high,
    low,
    close,
    volume
  };
};

export const generateInitialData = (points: number = 100, startPrice: number = 45000): Candle[] => {
  const data: Candle[] = [];
  let currentPrice = startPrice;
  // Align time to recent history
  let currentTime = Date.now() - (points * 60 * 60 * 1000); 

  for (let i = 0; i < points; i++) {
    const volatility = 0.003;
    const movement = (Math.random() - 0.48) * currentPrice * volatility;
    const open = currentPrice;
    const close = open + movement;
    
    data.push({
      time: currentTime,
      open,
      high: Math.max(open, close) + Math.abs(movement * 0.5),
      low: Math.min(open, close) - Math.abs(movement * 0.5),
      close,
      volume: Math.floor(Math.random() * 5000)
    });

    currentPrice = close;
    currentTime += 60 * 60 * 1000; // 1 hour steps
  }
  return data;
};

export const getNextTick = (currentData: Candle[]): Candle => {
  const lastCandle = currentData[currentData.length - 1];
  return generateCandle(lastCandle);
};

// --- Binance / Real-time Integration ---

const mapBinanceCandle = (data: any[]): Candle => ({
  time: data[0],
  open: parseFloat(data[1]),
  high: parseFloat(data[2]),
  low: parseFloat(data[3]),
  close: parseFloat(data[4]),
  volume: parseFloat(data[5]),
});

export const fetchHistoricalData = async (asset: Asset, timeframe: Timeframe): Promise<Candle[]> => {
  const binanceSymbol = BINANCE_SYMBOL_MAP[asset.symbol];
  
  if (binanceSymbol) {
    // Real Data Source
    try {
      const interval = timeframe === Timeframe.D1 ? '1d' : timeframe.toLowerCase();
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=100`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.map(mapBinanceCandle);
    } catch (e) {
      console.warn("Binance API unavailable, falling back to simulation", e);
      return generateInitialData(100, asset.category === 'Crypto' ? 65000 : 4500);
    }
  } else {
    // Simulated Data Source for non-crypto assets
    const startPrice = asset.category === 'Forex' ? 1.08 : asset.category === 'Equities' ? 4500 : 2000;
    return generateInitialData(100, startPrice);
  }
};

/**
 * Subscribes to market updates. 
 * Returns a cleanup function (unsubscribe).
 */
export const subscribeToMarket = (
  asset: Asset, 
  timeframe: Timeframe, 
  lastKnownCandle: Candle | null,
  onUpdate: (candle: Candle, isFinal: boolean) => void
): () => void => {
  const binanceSymbol = BINANCE_SYMBOL_MAP[asset.symbol];
  
  if (binanceSymbol) {
    // --- Real WebSocket Connection ---
    const interval = timeframe === Timeframe.D1 ? '1d' : timeframe.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@kline_${interval}`);
    
    ws.onopen = () => {
      console.log(`[WS] Connected to ${binanceSymbol}`);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.e === 'kline') {
          const k = message.k;
          const candle: Candle = {
              time: k.t,
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
              volume: parseFloat(k.v)
          };
          onUpdate(candle, k.x); // k.x is true if candle is closed (final)
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };
    
    ws.onerror = (err) => {
      console.error("WS Error", err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

  } else {
    // --- Simulated Real-time Stream ---
    // This creates a "fake socket" that updates the current candle
    
    let currentCandle = lastKnownCandle ? { ...lastKnownCandle } : generateInitialData(1)[0];
    let ticks = 0;
    const MAX_TICKS_PER_CANDLE = 20; // Simulate closing candle after 20 updates

    const intervalId = setInterval(() => {
      const volatility = 0.0002; // Lower volatility for tick emulation
      const change = currentCandle.close * volatility * (Math.random() - 0.5);
      const newPrice = currentCandle.close + change;
      
      // Update High/Low/Close/Volume
      currentCandle.close = newPrice;
      currentCandle.high = Math.max(currentCandle.high, newPrice);
      currentCandle.low = Math.min(currentCandle.low, newPrice);
      currentCandle.volume += Math.floor(Math.random() * 50);

      ticks++;
      const isFinal = ticks >= MAX_TICKS_PER_CANDLE;

      onUpdate({ ...currentCandle }, isFinal);

      if (isFinal) {
        // Prepare next candle
        ticks = 0;
        const nextTime = currentCandle.time + (timeframe === '1h' ? 3600000 : 60000); 
        currentCandle = {
          time: nextTime,
          open: newPrice,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume: 0
        };
      }
    }, 1000); 

    return () => clearInterval(intervalId);
  }
};