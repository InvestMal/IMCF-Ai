import React from 'react';

interface SystemMonitorProps {
  feedActive: boolean;
  aiStatus: 'idle' | 'processing' | 'success' | 'error';
  latency: number;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ feedActive, aiStatus, latency }) => {
  return (
    <div className="bg-institutional-800 h-32 rounded border border-institutional-700 p-4 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10">
        <span className="text-xs text-institutional-500 uppercase tracking-wider font-semibold">Pipeline Architecture</span>
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${feedActive ? 'bg-accent-up shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-institutional-600'} transition-all duration-100`}></div>
            <span className="text-[10px] text-institutional-500 font-mono">LIVE FEED {latency}ms</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-2 relative z-10">
        {/* Node 1: Feed */}
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors duration-300 ${feedActive ? 'border-accent-up bg-accent-up/10 text-accent-up' : 'border-institutional-600 text-institutional-600 bg-institutional-900'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[9px] text-institutional-500 font-mono uppercase">Ingest</span>
        </div>

        {/* Connector 1 */}
        <div className="flex-1 h-[1px] bg-institutional-700 mx-2 relative">
            <div className={`absolute top-0 left-0 h-full bg-accent-up transition-all duration-500 ${feedActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
        </div>

        {/* Node 2: Processing */}
        <div className="flex flex-col items-center gap-2">
             <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors duration-300 ${feedActive ? 'border-accent-info bg-accent-info/10 text-accent-info' : 'border-institutional-600 text-institutional-600 bg-institutional-900'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[9px] text-institutional-500 font-mono uppercase">Calc</span>
        </div>

        {/* Connector 2 */}
        <div className="flex-1 h-[1px] bg-institutional-700 mx-2 relative">
             <div className={`absolute top-0 left-0 h-full bg-purple-500 transition-all duration-1000 ${aiStatus === 'processing' ? 'w-full opacity-100 animate-pulse' : aiStatus === 'success' ? 'w-full opacity-0' : 'w-0'}`}></div>
        </div>

        {/* Node 3: AI Model */}
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors duration-300 ${aiStatus === 'processing' ? 'border-purple-500 bg-purple-500/10 text-purple-500 animate-pulse' : aiStatus === 'success' ? 'border-purple-500 text-purple-500' : 'border-institutional-600 text-institutional-600 bg-institutional-900'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="text-[9px] text-institutional-500 font-mono uppercase">Gemini</span>
        </div>

        {/* Connector 3 */}
        <div className="flex-1 h-[1px] bg-institutional-700 mx-2 relative">
            <div className={`absolute top-0 left-0 h-full bg-accent-up transition-all duration-500 ${aiStatus === 'success' ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
        </div>

         {/* Node 4: Dashboard */}
         <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors duration-300 ${aiStatus === 'success' ? 'border-accent-up bg-accent-up/10 text-accent-up' : 'border-institutional-600 text-institutional-600 bg-institutional-900'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[9px] text-institutional-500 font-mono uppercase">Client</span>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-0"></div>
    </div>
  );
};

export default SystemMonitor;
