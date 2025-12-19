import React from 'react';
import { NewsItem } from '../types';

interface NewsWireProps {
  news: NewsItem[];
}

const NewsWire: React.FC<NewsWireProps> = ({ news }) => {
  return (
    <div className="bg-institutional-800 rounded border border-institutional-700 h-full flex flex-col">
      <div className="p-3 border-b border-institutional-700 flex items-center gap-2 bg-institutional-900/50">
        <div className="w-2 h-2 rounded-full bg-accent-warn animate-pulse"></div>
        <h3 className="text-xs font-semibold text-institutional-300 uppercase tracking-wider">InvestMal Wire</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
        {news.length === 0 ? (
          <div className="p-4 text-center text-[10px] text-institutional-600">Waiting for wire updates...</div>
        ) : (
          <div className="divide-y divide-institutional-700/50">
            {news.map((item) => (
              <div key={item.id} className="p-3 hover:bg-institutional-700/30 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] text-institutional-500 font-mono uppercase">{new Date(item.time).toLocaleTimeString()} • {item.source}</span>
                  {item.impact === 'High' && (
                    <span className="px-1 py-0.5 rounded bg-accent-down/10 border border-accent-down/20 text-[8px] text-accent-down font-bold uppercase">High Impact</span>
                  )}
                </div>
                <p className="text-xs text-institutional-100 group-hover:text-purple-300 transition-colors leading-snug">
                  {item.headline}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsWire;