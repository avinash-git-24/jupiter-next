import { useState } from 'react';
import type { RouteSplit, Token } from '../types';
import { Zap, ChevronDown, ChevronUp, Layers, ShieldCheck } from 'lucide-react';

interface RouteVisualizerProps {
  inToken: Token;
  outToken: Token;
  inAmount: number;
  outAmount: number;
  savedUsd: number;
  splits: RouteSplit[];
}

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({
  inToken,
  outToken,
  inAmount,
  outAmount,
  savedUsd,
  splits
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0b0f19]/90 border border-white/10 p-4 transition-all">
      {/* Top Value Banner: Savings & Optimization Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe]">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Kinetic Split-Hop Router
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-400">
          <span>⚡ Saved</span>
          <span className="font-mono font-bold">+${savedUsd.toFixed(2)}</span>
          <span className="text-slate-400 text-[10px]">vs direct pool</span>
        </div>
      </div>

      {/* SVG Kinetic Flow Diagram */}
      <div className="relative py-2 px-2 overflow-hidden rounded-xl bg-slate-950/60 border border-white/5">
        
        {/* Node & Flow Grid */}
        <div className="flex items-center justify-between relative z-10">
          
          {/* Source Token Node */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] shadow-lg shadow-[#14F195]/20">
              <img 
                src={inToken.icon} 
                alt={inToken.symbol} 
                className="w-8 h-8 rounded-full bg-black object-cover" 
              />
            </div>
            <span className="text-[11px] font-bold text-white font-mono">
              {inAmount || 0} {inToken.symbol}
            </span>
          </div>

          {/* Center Multi-Hop Route Splits */}
          <div className="flex-1 px-4 flex flex-col gap-2">
            {splits.map((split, idx) => (
              <div 
                key={idx} 
                className="relative flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-[#00f2fe]/40 transition-colors group cursor-default"
              >
                {/* Flow line animation */}
                <div 
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-[#00f2fe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
                />

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                  <span className="text-[11px] font-medium text-slate-200">
                    {split.dexName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({split.poolType})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00f2fe]/15 text-[#00f2fe] font-bold">
                    {split.percentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ~{split.latencyMs}ms
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Destination Token Node */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-lg shadow-[#00f2fe]/20">
              <img 
                src={outToken.icon} 
                alt={outToken.symbol} 
                className="w-8 h-8 rounded-full bg-black object-cover" 
              />
            </div>
            <span className="text-[11px] font-bold text-white font-mono">
              ~{outAmount.toFixed(2)} {outToken.symbol}
            </span>
          </div>

        </div>

        {/* Dynamic Route Insights Footer Accordion */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#00f2fe]" />
              2 Hops Split
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              0% Slippage Loss
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Details' : 'Inspect Routing'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded Deep Inspection Details */}
        {isExpanded && (
          <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-white/10 text-xs space-y-2 animate-fadeIn">
            <div className="flex justify-between text-slate-400">
              <span>Smart Router Execution:</span>
              <span className="font-mono text-slate-200">Jupiter v3 Graph Engine</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Direct Pool Price:</span>
              <span className="font-mono text-slate-200">1 {inToken.symbol} = {(outAmount / (inAmount || 1) * 0.985).toFixed(4)} {outToken.symbol}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Optimized Split Price:</span>
              <span className="font-mono text-emerald-400 font-semibold">1 {inToken.symbol} = {(outAmount / (inAmount || 1)).toFixed(4)} {outToken.symbol}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Gas Efficiency:</span>
              <span className="font-mono text-slate-200">0.000005 SOL ($0.0007)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
