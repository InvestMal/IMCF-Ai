import React from 'react';
import { Asset } from '../types';
import { SUPPORTED_ASSETS } from '../constants';

interface HeaderProps {
  currentAsset: Asset;
  onAssetChange: (asset: Asset) => void;
  latency: number;
}

const Header: React.FC<HeaderProps> = ({ currentAsset, onAssetChange, latency }) => {
  return (
    <header className="bg-institutional-900 border-b border-institutional-700 h-16 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">InvestMal<span className="text-purple-500">AI</span></h1>
            <span className="text-[9px] text-institutional-500 tracking-[0.2em] uppercase">Enterprise Edition</span>
        </div>
        
        <div className="h-8 w-[1px] bg-institutional-700"></div>

        <div className="relative group">
          <button className="flex items-center gap-2 text-sm font-medium text-institutional-100 hover:text-white transition-colors">
            {currentAsset.symbol} 
            <span className="text-institutional-500">({currentAsset.category})</span>
            <svg className="w-4 h-4 text-institutional-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          <div className="absolute top-full left-0 mt-2 w-56 bg-institutional-800 border border-institutional-700 rounded shadow-xl hidden group-hover:block">
            {SUPPORTED_ASSETS.map(asset => (
              <button
                key={asset.symbol}
                onClick={() => onAssetChange(asset)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-institutional-700 transition-colors ${currentAsset.symbol === asset.symbol ? 'text-purple-400 bg-institutional-700/50' : 'text-institutional-300'}`}
              >
                <div className="font-semibold">{asset.symbol}</div>
                <div className="text-xs text-institutional-500">{asset.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-mono text-institutional-500">
            <span className={`w-2 h-2 rounded-full ${latency < 100 ? 'bg-accent-up' : 'bg-accent-warn'} animate-pulse`}></span>
            SYSTEM ONLINE {latency}ms
        </div>
        <div className="w-8 h-8 rounded bg-institutional-700 flex items-center justify-center text-xs font-bold text-institutional-300 border border-institutional-600">
            QD
        </div>
      </div>
    </header>
  );
};

export default Header;
