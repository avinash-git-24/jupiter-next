import { useState } from 'react';
import type { Token } from '../types';
import { Target, Clock } from 'lucide-react';

interface LimitWidgetProps {
  inToken: Token;
  outToken: Token;
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
}

export const LimitWidget: React.FC<LimitWidgetProps> = ({
  inToken,
  outToken,
  onOpenInTokenModal,
  onOpenOutTokenModal,
}) => {
  const [inAmount, setInAmount] = useState('10');
  const [expiry, setExpiry] = useState<'1d' | '7d' | '30d' | 'never'>('7d');
  const [rateOffset, setRateOffset] = useState<-1 | -5 | -10 | 5 | 10>(-5);

  const amountNumber = parseFloat(inAmount) || 0;
  const currentRate = inToken.priceUsd / outToken.priceUsd;
  const targetRate = currentRate * (1 + rateOffset / 100);
  const estimatedOut = amountNumber * targetRate;

  return (
    <div className="space-y-4">
      {/* Allocation Amount */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>You Pay:</span>
          <span className="font-mono">Balance: {inToken.balance} {inToken.symbol}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={inAmount}
            onChange={(e) => setInAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none placeholder:text-slate-600"
            placeholder="0.0"
          />

          <button
            onClick={onOpenInTokenModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 hover:border-[#00f2fe]/40 transition-colors cursor-pointer"
          >
            <img src={inToken.icon} alt={inToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-sm text-white">{inToken.symbol}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          ≈ ${(amountNumber * inToken.priceUsd).toFixed(2)} USD
        </div>
      </div>

      {/* Target Trigger Rate Controller */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Target className="w-3.5 h-3.5 text-[#00f2fe]" /> Target Trigger Rate:
          </span>
          <span className="font-mono text-xs text-slate-400">
            Market: 1 {inToken.symbol} = {currentRate.toFixed(4)} {outToken.symbol}
          </span>
        </div>

        {/* Quick Rate Offsets */}
        <div className="flex items-center gap-1.5">
          {([-10, -5, -1, 5, 10] as const).map((pct) => (
            <button
              key={pct}
              onClick={() => setRateOffset(pct)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                rateOffset === pct
                  ? pct < 0 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {pct > 0 ? `+${pct}%` : `${pct}%`}
            </button>
          ))}
        </div>

        {/* Target Rate Visual Display */}
        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400">Execute Order When:</span>
            <div className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
              <span>1 {inToken.symbol} = {targetRate.toFixed(4)} {outToken.symbol}</span>
              <span className={`text-xs px-1.5 py-0.2 rounded font-medium ${
                rateOffset < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                ({rateOffset > 0 ? `+${rateOffset}% higher` : `${rateOffset}% dip`})
              </span>
            </div>
          </div>

          <button
            onClick={onOpenOutTokenModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs text-white"
          >
            <img src={outToken.icon} alt={outToken.symbol} className="w-4 h-4 rounded-full" />
            <span>{outToken.symbol}</span>
          </button>
        </div>
      </div>

      {/* Expiry Selector */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> Auto-Cancel Expiry:
        </span>

        <div className="flex gap-1">
          {(['1d', '7d', '30d', 'never'] as const).map((exp) => (
            <button
              key={exp}
              onClick={() => setExpiry(exp)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase font-mono transition-all cursor-pointer ${
                expiry === exp
                  ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated Output */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex justify-between items-center text-xs">
        <span className="text-slate-400">Total Output at Trigger:</span>
        <span className="font-mono text-sm font-bold text-emerald-400">
          ~{estimatedOut.toFixed(2)} {outToken.symbol}
        </span>
      </div>
    </div>
  );
};
