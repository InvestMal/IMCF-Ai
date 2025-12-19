import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Candle } from '../types';

interface MarketChartProps {
  data: Candle[];
  sma50: number;
}

const MarketChart: React.FC<MarketChartProps> = ({ data, sma50 }) => {
  
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      timeStr: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, [data]);

  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const buffer = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-[350px] w-full bg-institutional-800 rounded p-4 relative">
       <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-info/50 rounded-full"></div>
            <span className="text-xs text-institutional-500">Price Action</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-[1px] bg-accent-warn"></div>
            <span className="text-xs text-institutional-500">SMA 50</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="timeStr" 
            stroke="#64748B" 
            tick={{fontSize: 10}}
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice - buffer, maxPrice + buffer]} 
            stroke="#64748B" 
            tick={{fontSize: 10}}
            orientation="right"
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', color: '#F1F5F9' }}
            itemStyle={{ color: '#F1F5F9' }}
          />
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClose)" 
            isAnimationActive={false}
          />
          <ReferenceLine y={sma50} stroke="#F59E0B" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
