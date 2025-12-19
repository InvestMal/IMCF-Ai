import React from 'react';
import { AIAnalysisResult } from '../types';

interface AIInsightPanelProps {
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ analysis, isLoading }) => {
  if (isLoading && !analysis) {
    return (
      <div className="bg-institutional-800 rounded p-6 h-full flex flex-col justify-center items-center animate-pulse border border-institutional-700">
        <div className="w-12 h-12 rounded-full bg-institutional-700 mb-4"></div>
        <div className="h-4 w-3/4 bg-institutional-700 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-institutional-700 rounded"></div>
        <span className="text-xs text-institutional-500 mt-4 font-mono">PROCESSING INSTITUTIONAL FEED...</span>
      </div>
    );
  }

  if (!analysis) return null;

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Trending': return 'text-accent-up border-accent-up bg-accent-up/10';
      case 'Ranging': return 'text-accent-info border-accent-info bg-accent-info/10';
      case 'Volatile': return 'text-accent-warn border-accent-warn bg-accent-warn/10';
      default: return 'text-institutional-500 border-institutional-500 bg-institutional-500/10';
    }
  };

  const getRiskColor = (level: string) => {
      switch(level) {
          case 'Low': return 'text-accent-up';
          case 'Medium': return 'text-accent-warn';
          case 'High': return 'text-accent-down';
          case 'Critical': return 'text-red-600 font-bold';
          default: return 'text-institutional-400';
      }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
        case 'High': return 'bg-accent-down/20 text-accent-down border-accent-down/30';
        case 'Medium': return 'bg-accent-warn/20 text-accent-warn border-accent-warn/30';
        default: return 'bg-institutional-700 text-institutional-400 border-institutional-600';
    }
  };

  return (
    <div className="bg-institutional-800 rounded border border-institutional-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-institutional-700 flex justify-between items-center bg-institutional-900/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="font-semibold text-institutional-100">Deep Reasoning</h3>
        </div>
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-institutional-500 uppercase">Model Conf.</span>
                <span className="text-xs font-mono text-purple-400">{analysis.mainConfidenceScore}%</span>
            </div>
             <div className="w-16 h-1 bg-institutional-700 rounded-full overflow-hidden mt-1">
                <div 
                    className="h-full bg-purple-500 transition-all duration-500" 
                    style={{ width: `${analysis.mainConfidenceScore}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Market State Badge */}
        <div className="flex items-center justify-between">
            <div className={`px-3 py-1 border rounded text-sm font-mono font-bold ${getStateColor(analysis.marketState)}`}>
                {analysis.marketState.toUpperCase()}
            </div>
            <div className="text-xs text-institutional-500 font-mono">
                RISK: <span className={getRiskColor(analysis.riskAnalysis.overallRisk)}>{analysis.riskAnalysis.overallRisk.toUpperCase()}</span>
            </div>
        </div>

        {/* Narrative Points */}
        <div className="space-y-4">
          <span className="text-xs text-institutional-500 uppercase tracking-wider block border-b border-institutional-700 pb-1">Thesis & Attribution</span>
          
          {analysis.narrativePoints.map((point, idx) => (
             <div key={idx} className="group">
                 <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-institutional-100 group-hover:text-purple-400 transition-colors">{point.headline}</h4>
                    <span className="text-[10px] text-institutional-600 font-mono" title="Point Confidence">C:{point.confidence}</span>
                 </div>
                 <p className="text-xs text-institutional-400 leading-relaxed pl-2 border-l border-institutional-700 group-hover:border-purple-500/50 transition-colors">
                     {point.explanation}
                 </p>
             </div>
          ))}
        </div>

        {/* Risk Analysis Detail */}
        <div className="mt-auto bg-institutional-900/30 rounded border border-institutional-700 p-3">
          <div className="flex items-center gap-2 mb-3">
             <svg className="w-4 h-4 text-accent-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
             <span className="text-xs text-accent-warn font-bold uppercase">Risk Factors</span>
          </div>
          <div className="space-y-2">
            {analysis.riskAnalysis.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                    <span className="text-institutional-300">{factor.factor}</span>
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono uppercase ${getSeverityBadge(factor.severity)}`}>
                        {factor.severity}
                    </span>
                </div>
            ))}
          </div>
        </div>
        
        <div className="text-[10px] text-institutional-600 font-mono text-right border-t border-institutional-800 pt-2">
            Analysis Timestamp: {new Date(analysis.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default AIInsightPanel;
