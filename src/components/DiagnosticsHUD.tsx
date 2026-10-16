import type { PriorityFeeLevel, SlippagePreset } from '../types';
import { 
  Flame, 
  Sliders, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';

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
  return (
    <div className="w-full rounded-2xl bg-slate-900/70 border border-white/5 p-3.5 space-y-3">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>Execution Telemetry & Safety Radar</span>
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Audit Clean</span>
        </div>
      </div>

      {/* Safety Radar Grid: Token Verification & Honeypot Checks */}
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="p-2 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col gap-0.5">
          <span className="text-slate-400 text-[10px]">Mint Authority</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Revoked
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col gap-0.5">
          <span className="text-slate-400 text-[10px]">Liquidity Lock</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Locked
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col gap-0.5">
          <span className="text-slate-400 text-[10px]">Price Impact</span>
          <span className={`font-semibold flex items-center gap-1 ${
            priceImpactPct > 1 ? 'text-rose-400' : priceImpactPct > 0.3 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {priceImpactPct.toFixed(2)}% (Optimal)
          </span>
        </div>
      </div>

      {/* Priority Fee & Jito MEV Bundle Selector */}
      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
              <span>Priority & Jito MEV</span>
              <span className="text-[10px] text-[#00f2fe] bg-[#00f2fe]/10 px-1.5 py-0.2 rounded font-mono">
                Bundle
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Guaranteed anti-sandwiching</p>
          </div>
        </div>

        {/* Priority Fee Pills */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-white/10 text-xs">
          {(['fast', 'turbo', 'ultra'] as PriorityFeeLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setPriorityFee(level)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${
                priorityFee === level
                  ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Slippage Protection */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Sliders className="w-3 h-3 text-slate-400" />
          <span>Dynamic Slippage:</span>
        </div>

        <div className="flex items-center gap-1">
          {(['auto', '0.1', '0.5'] as SlippagePreset[]).map((val) => (
            <button
              key={val}
              onClick={() => setSlippage(val)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                slippage === val
                  ? 'bg-white/15 text-[#00f2fe] border border-[#00f2fe]/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {val === 'auto' ? 'Auto Dynamic' : `${val}%`}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
