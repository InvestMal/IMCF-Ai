import { Asset, OrderBook, NewsItem } from '../types';

// --- Order Book Simulation ---

export const generateOrderBook = (currentPrice: number, volatility: number): OrderBook => {
  const depth = 8; // Number of levels
  const spread = currentPrice * 0.0005; // Tight spread simulation
  const bids = [];
  const asks = [];
  
  // Generate Asks (Sell Orders) - Ascending from current price
  let currentAsk = currentPrice + (spread / 2);
  let totalAskSize = 0;
  for (let i = 0; i < depth; i++) {
    const size = Math.random() * 5 + 0.5; // Random size
    totalAskSize += size;
    asks.push({
      price: currentAsk,
      size: size,
      total: totalAskSize
    });
    currentAsk += currentPrice * 0.0002 * (i + 1); // Widen gaps slightly as we go up
  }

  // Generate Bids (Buy Orders) - Descending from current price
  let currentBid = currentPrice - (spread / 2);
  let totalBidSize = 0;
  for (let i = 0; i < depth; i++) {
    const size = Math.random() * 5 + 0.5;
    totalBidSize += size;
    bids.push({
      price: currentBid,
      size: size,
      total: totalBidSize
    });
    currentBid -= currentPrice * 0.0002 * (i + 1);
  }

  return {
    bids,
    asks: asks.reverse(), // Asks usually displayed highest price at top in vertical views, but for list we want closest to price at bottom
    spread
  };
};