import React from 'react';
import { OrderBook as OrderBookType } from '../types';

interface OrderBookProps {
  data: OrderBookType | null;
}

const OrderBook: React.FC<OrderBookProps> = ({ data }) => {
  if (!data) return <div className="h-full flex items-center justify-center text-institutional-600 text-xs">Loading Depth...</div>;

  const maxTotal = Math.max(
    ...data.bids.map(b => b.total), 
    ...data.asks.map(a => a.total)
  );

  return (
    <div className="bg-institutional-800 h-full min-h-[128px] rounded border border-institutional-700 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-institutional-700 flex justify-between items-center bg-institutional-900/30">
        <span className="text-xs text-institutional-500 uppercase font-semibold">Order Book (L2)</span>
        <span className="text-[10px] text-institutional-600 font-mono">Spread: {data.spread.toFixed(2)}</span>
      </div>
      
      <div className="flex-1 flex flex-col text-[10px] font-mono relative overflow-hidden">
        
        {/* Asks (Sells) - Red - Render in reverse order for visual stack */}
        <div className="flex-1 flex flex-col justify-end pb-1">
            {[...data.asks].reverse().map((ask, i) => (
                <div key={i} className="flex justify-between items-center px-3 py-0.5 relative group hover:bg-institutional-700/50 cursor-crosshair">
                     {/* Depth Bar */}
                     <div className="absolute top-0 right-0 h-full bg-accent-down/10 transition-all duration-300" style={{ width: `${(ask.total / maxTotal) * 100}%` }}></div>
                     
                     <span className="text-accent-down relative z-10">{ask.price.toFixed(2)}</span>
                     <span className="text-institutional-400 relative z-10">{ask.size.toFixed(4)}</span>
                </div>
            ))}
        </div>

        {/* Current Price Indicator */}
        <div className="border-y border-institutional-700 bg-institutional-900/50 py-1 text-center">
            <span className="text-xs font-bold text-institutional-100">
                {((data.asks[data.asks.length-1].price + data.bids[0].price) / 2).toFixed(2)}
            </span>
        </div>

        {/* Bids (Buys) - Green */}
        <div className="flex-1 pt-1">
            {data.bids.map((bid, i) => (
                <div key={i} className="flex justify-between items-center px-3 py-0.5 relative group hover:bg-institutional-700/50 cursor-crosshair">
                     {/* Depth Bar */}
                     <div className="absolute top-0 right-0 h-full bg-accent-up/10 transition-all duration-300" style={{ width: `${(bid.total / maxTotal) * 100}%` }}></div>
                     
                     <span className="text-accent-up relative z-10">{bid.price.toFixed(2)}</span>
                     <span className="text-institutional-400 relative z-10">{bid.size.toFixed(4)}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;