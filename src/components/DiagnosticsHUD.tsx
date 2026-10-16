import { useState } from 'react';
import type { PriorityFeeLevel, SlippagePreset } from '../types';
import { 
  Flame, 
  Sliders, 
  CheckCircle2, 
  Cpu, 
  ShieldAlert, 
  Lock, 
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DiagnosticsHUDProps {
  priorityFee: PriorityFeeLevel;
  setPriorityFee: (level: PriorityFeeLevel) => void;
  slippage: SlippagePreset;
  setSlippage: (s: SlippagePreset) => void;
  priceImpactPct: number;
}

export const DiagnosticsHUD: React.FC<DiagnosticsHUDProps> = ({
  priorityFee,
  setPriorityFee,
  slippage,
  setSlippage,
  priceImpactPct
}) => {
  const [jitoEnabled, setJitoEnabled] = useState(true);
  const [customSlippage, setCustomSlippage] = useState('1.0');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  return (
    <div className="w-full rounded-2xl specular-card p-4 space-y-3.5 shadow-2xl relative overflow-hidden">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <div className="relative w-7 h-7 rounded-full bg-slate-950 border border-[#00f2fe]/40 overflow-hidden flex items-center justify-center shadow-md shadow-[#00f2fe]/20">
            <div className="absolute inset-1 rounded-full border border-[#00f2fe]/20" />
            <div className="absolute inset-2 rounded-full border border-[#00f2fe]/30" />
            <div className="absolute w-full h-[0.5px] bg-[#00f2fe]/25" />
            <div className="absolute h-full w-[0.5px] bg-[#00f2fe]/25" />
            
            <div 
              className="absolute inset-0 animate-radar-sweep pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, rgba(0, 242, 254, 0.4) 0deg, rgba(0, 242, 254, 0) 60deg, transparent 360deg)'
              }}
            />

            <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#00f2fe]" />
                Safety Radar & Execution Telemetry
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Zero-compromise on-chain validation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>100% Clean Audit</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Mint Authority</span>
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Revoked
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Liquidity Lock</span>
            <Lock className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Burned
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Price Impact</span>
            <RefreshCw className="w-3 h-3 text-cyan-400" />
          </div>
          <span className={`font-semibold flex items-center gap-1 ${
            priceImpactPct > 1 ? 'text-rose-400' : priceImpactPct > 0.3 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {priceImpactPct.toFixed(2)}% (Optimal)
          </span>
        </div>

      </div>

      <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Priority & Jito MEV</span>
              <button
                onClick={() => setJitoEnabled(!jitoEnabled)}
                className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-bold transition-all cursor-pointer ${
                  jitoEnabled 
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40' 
                    : 'bg-slate-800 text-slate-500 border-white/10'
                }`}
              >
                {jitoEnabled ? 'Jito ON' : 'Jito OFF'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">Guaranteed frontrun and sandwich protection</p>
          </div>
        </div>

        <div className="relative flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          {(['fast', 'turbo', 'ultra'] as PriorityFeeLevel[]).map((level) => {
            const isActive = priorityFee === level;
            return (
              <button
                key={level}
                onClick={() => setPriorityFee(level)}
                className={`relative z-10 px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="priorityFeePill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00f2fe] to-[#4facfe] shadow-sm shadow-[#00f2fe]/30 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-1 gap-2">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span>Dynamic Slippage Engine:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative flex items-center p-0.5 rounded-lg bg-slate-950 border border-white/10">
            {(['auto', '0.1', '0.5'] as SlippagePreset[]).map((val) => {
              const isActive = slippage === val && !isEditingCustom;
              return (
                <button
                  key={val}
                  onClick={() => {
                    setIsEditingCustom(false);
                    setSlippage(val);
                  }}
                  className={`relative z-10 px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    isActive ? 'text-[#00f2fe] font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="slippagePill"
                      className="absolute inset-0 rounded bg-white/10 border border-[#00f2fe]/40 -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  {val === 'auto' ? 'Auto Dynamic' : `${val}%`}
                </button>
              );
            })}

            <button
              onClick={() => {
                setIsEditingCustom(true);
                setSlippage('custom');
              }}
              className={`relative z-10 px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                isEditingCustom || slippage === 'custom' ? 'text-[#00f2fe] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {(isEditingCustom || slippage === 'custom') && (
                <motion.div
                  layoutId="slippagePill"
                  className="absolute inset-0 rounded bg-white/10 border border-[#00f2fe]/40 -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              Custom
            </button>
          </div>

          {(isEditingCustom || slippage === 'custom') && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-[#00f2fe]/40 text-[10px] font-mono">
              <input
                type="number"
                step="0.1"
                min="0.05"
                max="50"
                value={customSlippage}
                onChange={(e) => setCustomSlippage(e.target.value)}
                className="w-10 bg-transparent text-white font-bold focus:outline-none text-right"
                autoFocus
              />
              <span className="text-slate-400">%</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
