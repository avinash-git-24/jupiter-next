import { useState } from 'react';
import type { RouteSplit, Token } from '../types';
import { Zap, ChevronDown, ChevronUp, Layers, ShieldCheck, Sparkles, Activity, Info } from 'lucide-react';

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
  const [hoveredDex, setHoveredDex] = useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl threeui-specular-card p-4 transition-all space-y-3.5 shadow-2xl relative overflow-hidden">
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#9945FF]/20 border border-[#00f2fe]/40 flex items-center justify-center text-[#00f2fe] shadow-lg shadow-[#00f2fe]/20">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Kinetic Split-Hop Routing</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-[#00f2fe] border border-cyan-500/30 font-mono">
                Graph v3
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Continuous liquidity graph aggregation</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-400 shadow-sm shadow-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-bold">+${savedUsd.toFixed(2)} saved</span>
        </div>
      </div>

      <div className="relative p-4 rounded-2xl bg-[#04060a]/95 border border-white/10 overflow-hidden min-h-[170px] flex flex-col justify-between">
        
        <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-24 bg-[#9945FF]/10 rounded-full blur-3xl pointer-events-none" />

        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none block" 
          viewBox="0 0 500 170" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cableGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4facfe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="cableGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#9945FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path 
            d="M 80 80 C 125 80, 145 42, 185 42" 
            stroke="#00f2fe" 
            strokeWidth="5" 
            opacity="0.12" 
            filter="url(#glowBlur)"
          />
          <path 
            d="M 315 42 C 355 42, 380 80, 420 80" 
            stroke="#14F195" 
            strokeWidth="5" 
            opacity="0.12" 
            filter="url(#glowBlur)"
          />

          <path 
            d="M 80 80 C 125 80, 145 42, 185 42" 
            stroke="url(#cableGrad1)" 
            strokeWidth="2.5" 
            className="animate-route-flow"
          />
          <path 
            d="M 315 42 C 355 42, 380 80, 420 80" 
            stroke="url(#cableGrad1)" 
            strokeWidth="2.5" 
            className="animate-route-flow"
          />

          <path 
            d="M 80 80 C 125 80, 145 118, 185 118" 
            stroke="#9945FF" 
            strokeWidth="5" 
            opacity="0.12" 
            filter="url(#glowBlur)"
          />
          <path 
            d="M 315 118 C 355 118, 380 80, 420 80" 
            stroke="#14F195" 
            strokeWidth="5" 
            opacity="0.12" 
            filter="url(#glowBlur)"
          />

          <path 
            d="M 80 80 C 125 80, 145 118, 185 118" 
            stroke="url(#cableGrad2)" 
            strokeWidth="2.5" 
            className="animate-route-flow"
          />
          <path 
            d="M 315 118 C 355 118, 380 80, 420 80" 
            stroke="url(#cableGrad2)" 
            strokeWidth="2.5" 
            className="animate-route-flow"
          />

          <circle r="3.5" fill="#00f2fe" filter="url(#glowBlur)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 80 80 C 125 80, 145 42, 185 42" />
          </circle>
          <circle r="3.5" fill="#14F195" filter="url(#glowBlur)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 315 42 C 355 42, 380 80, 420 80" />
          </circle>
          <circle r="3.5" fill="#9945FF" filter="url(#glowBlur)">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M 80 80 C 125 80, 145 118, 185 118" />
          </circle>
          <circle r="3.5" fill="#14F195" filter="url(#glowBlur)">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M 315 118 C 355 118, 380 80, 420 80" />
          </circle>
        </svg>

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-3 my-auto">
          
          <div className="flex flex-col items-center gap-1.5 shrink-0 group z-20">
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#9945FF] to-[#14F195] shadow-lg shadow-[#14F195]/20 group-hover:scale-105 transition-transform">
              <img 
                src={inToken.icon} 
                alt={inToken.symbol} 
                className="w-10 h-10 rounded-xl bg-black object-cover" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#04060a] flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">✓</span>
              </div>
            </div>
            
            <div className="px-2 py-0.5 rounded-lg bg-slate-950/90 border border-white/10 shadow-sm text-center">
              <span className="text-[11px] font-bold text-white font-mono block">
                {inAmount || 0} {inToken.symbol}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xs md:max-w-none flex flex-col gap-2 relative z-20">
            {splits.map((split, idx) => (
              <div 
                key={idx} 
                onMouseEnter={() => setHoveredDex(split.dexName)}
                onMouseLeave={() => setHoveredDex(null)}
                className={`relative flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  hoveredDex === split.dexName
                    ? 'bg-slate-800/95 border-[#00f2fe]/60 shadow-lg shadow-[#00f2fe]/20 scale-[1.02]'
                    : 'bg-slate-900/90 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#00f2fe]' : 'bg-[#9945FF]'} shadow-sm`} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      {split.dexName}
                      <Info className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {split.poolType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    idx === 0 ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
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

          <div className="flex flex-col items-center gap-1.5 shrink-0 group z-20">
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-lg shadow-[#00f2fe]/25 group-hover:scale-105 transition-transform">
              <img 
                src={outToken.icon} 
                alt={outToken.symbol} 
                className="w-10 h-10 rounded-xl bg-black object-cover" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00f2fe] border-2 border-[#04060a] flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            
            <div className="px-2 py-0.5 rounded-lg bg-slate-950/90 border border-white/10 shadow-sm text-center">
              <span className="text-[11px] font-bold text-emerald-400 font-mono block whitespace-nowrap">
                ~{outAmount.toFixed(2)} {outToken.symbol}
              </span>
            </div>
          </div>

        </div>

        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#00f2fe] text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Split Hop</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0% Slippage Loss</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400 hidden sm:flex text-[11px]">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Jito Bundle Protected</span>
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

        {isExpanded && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-white/10 text-xs space-y-2 animate-fadeIn z-20">
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
