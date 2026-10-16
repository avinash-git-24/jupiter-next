import { useState } from 'react';
import type { RouteSplit, Token } from '../types';
import { Zap, ChevronDown, ChevronUp, Layers, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#0b0f19] to-[#070a12] border border-white/10 p-4 transition-all space-y-3.5 shadow-lg">
      
      {/* Top Banner: Dynamic Savings Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] shadow-sm shadow-[#00f2fe]/20">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Kinetic Split-Hop Engine</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 font-mono">
                Multi-Hop
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Optimal liquidity graph routing</p>
          </div>
        </div>

        {/* Highlighted Value-Add Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 shadow-sm shadow-emerald-500/10">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold font-mono">+${savedUsd.toFixed(2)} saved</span>
        </div>
      </div>

      {/* Kinetic SVG Flow Architecture */}
      <div className="relative p-3.5 rounded-2xl bg-[#04060a]/90 border border-white/5 overflow-hidden">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-28 h-20 bg-[#00f2fe]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-28 h-20 bg-[#9945FF]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Visual Multi-Node Flow Layout */}
        <div className="flex items-center justify-between relative z-10 gap-3">
          
          {/* Node 1: Input Token */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#9945FF] to-[#14F195] shadow-lg shadow-[#14F195]/20">
              <img 
                src={inToken.icon} 
                alt={inToken.symbol} 
                className="w-10 h-10 rounded-xl bg-black object-cover" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#04060a] flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">✓</span>
              </div>
            </div>
            <span className="text-xs font-bold text-white font-mono">
              {inAmount || 0} {inToken.symbol}
            </span>
          </div>

          {/* Animated Connecting Splines & DEX Split Nodes */}
          <div className="flex-1 flex flex-col gap-2 relative">
            {splits.map((split, idx) => (
              <div 
                key={idx} 
                className="relative flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 hover:border-[#00f2fe]/50 transition-all group"
              >
                {/* Animated Flow Light Beam */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />

                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#00f2fe]' : 'bg-[#9945FF]'}`} />
                  <span className="text-xs font-semibold text-slate-200">
                    {split.dexName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    ({split.poolType})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    idx === 0 ? 'bg-[#00f2fe]/15 text-[#00f2fe]' : 'bg-purple-500/15 text-purple-300'
                  }`}>
                    {split.percentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {split.latencyMs}ms
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Node 2: Output Token */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-lg shadow-[#00f2fe]/25">
              <img 
                src={outToken.icon} 
                alt={outToken.symbol} 
                className="w-10 h-10 rounded-xl bg-black object-cover" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00f2fe] border-2 border-[#04060a] flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              ~{outAmount.toFixed(2)} {outToken.symbol}
            </span>
          </div>

        </div>

        {/* Bottom Details Toggle Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#00f2fe]">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Split Hop</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0% Slippage Loss</span>
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
          >
            <span>{isExpanded ? 'Hide Routing' : 'Inspect Routing'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Deep Telemetry */}
        {isExpanded && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-2 animate-fadeIn">
            <div className="flex justify-between text-slate-400">
              <span>Routing Algorithm:</span>
              <span className="font-mono text-slate-200">Jupiter Direct Graph Search (DGS v3)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Direct Pool Route Price:</span>
              <span className="font-mono text-slate-300">1 {inToken.symbol} = {(outAmount / (inAmount || 1) * 0.985).toFixed(4)} {outToken.symbol}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Multi-Hop Optimized Price:</span>
              <span className="font-mono text-emerald-400 font-bold">1 {inToken.symbol} = {(outAmount / (inAmount || 1)).toFixed(4)} {outToken.symbol}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Solana Network Gas:</span>
              <span className="font-mono text-slate-200">0.000005 SOL (~$0.0007)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
