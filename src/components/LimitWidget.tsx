import { useState } from 'react';
import type { Token } from '../types';
import { Target, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface LimitWidgetProps {
  inToken: Token;
  outToken: Token;
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
  targetPrice?: number | null;
  amount?: string;
  onAmountChange?: (val: string) => void;
  rateOffset?: -1 | -5 | -10 | 5 | 10;
  onRateOffsetChange?: (val: -1 | -5 | -10 | 5 | 10) => void;
}

export const LimitWidget: React.FC<LimitWidgetProps> = ({
  inToken,
  outToken,
  onOpenInTokenModal,
  onOpenOutTokenModal,
  targetPrice,
  amount: amountProp,
  onAmountChange,
  rateOffset: rateOffsetProp,
  onRateOffsetChange
}) => {
  const [internalAmount, setInternalAmount] = useState('10');
  const [expiry, setExpiry] = useState<'1d' | '7d' | '30d' | 'never'>('7d');
  const [internalOffset, setInternalOffset] = useState<-1 | -5 | -10 | 5 | 10>(-5);
  const [activeSource, setActiveSource] = useState<'matched' | 'offset'>('offset');
  const [lastTargetPrice, setLastTargetPrice] = useState(targetPrice);

  if (targetPrice !== lastTargetPrice && targetPrice) {
    setLastTargetPrice(targetPrice);
    setActiveSource('matched');
  }

  const inAmount = amountProp !== undefined ? amountProp : internalAmount;
  const setInAmount = onAmountChange || setInternalAmount;
  const rateOffset = rateOffsetProp !== undefined ? rateOffsetProp : internalOffset;
  const setRateOffset = onRateOffsetChange || setInternalOffset;

  const handleOffsetClick = (pct: -1 | -5 | -10 | 5 | 10) => {
    setActiveSource('offset');
    setRateOffset(pct);
  };

  const amountNumber = parseFloat(inAmount) || 0;
  const currentRate = inToken.priceUsd / outToken.priceUsd;
  const targetRate = (activeSource === 'matched' && targetPrice)
    ? targetPrice
    : currentRate * (1 + rateOffset / 100);
  const estimatedOut = amountNumber * targetRate;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#131924] border border-white/5 space-y-2 focus-within:border-[#c7f284]/50 focus-within:ring-1 focus-within:ring-[#c7f284]/20 transition-all">
        <div className="flex justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">You Allocate:</span>
          <span className="font-mono text-slate-400">Balance: {inToken.balance} {inToken.symbol}</span>
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a2233] border border-white/10 hover:border-[#c7f284]/40 transition-colors cursor-pointer group"
          >
            <img src={inToken.icon} alt={inToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-sm text-white">{inToken.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          ≈ ${(amountNumber * inToken.priceUsd).toFixed(2)} USD
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#131924] border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Target className="w-3.5 h-3.5 text-[#c7f284]" /> Target Trigger Rate:
          </span>
          <span className="font-mono text-xs text-slate-400">
            Market: 1 {inToken.symbol} = {currentRate.toFixed(4)} {outToken.symbol}
          </span>
        </div>

        <div className="relative flex items-center p-1 rounded-xl bg-[#0a0e17] border border-white/10 gap-1">
          {([-10, -5, -1, 5, 10] as const).map((pct) => {
            const isActive = rateOffset === pct;
            return (
              <button
                key={pct}
                onClick={() => handleOffsetClick(pct)}
                className={`relative z-10 flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer text-center ${
                  isActive
                    ? pct < 0
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="limitRateOffsetPill"
                    className={`absolute inset-0 rounded-lg border -z-10 shadow-sm ${
                      pct < 0
                        ? 'bg-rose-500/20 border-rose-500/40'
                        : 'bg-emerald-500/20 border-emerald-500/40'
                    }`}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-[#0a0e17] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400">Execute Order When:</span>
            <div className="font-mono text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
              <span>1 {inToken.symbol} = {targetRate.toFixed(4)} {outToken.symbol}</span>
              {activeSource === 'matched' && targetPrice ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-[#c7f284]/15 text-[#c7f284] border border-[#c7f284]/30">
                  CLMM Matched Price
                </span>
              ) : (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  rateOffset < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-[#c7f284]/20 text-[#c7f284]'
                }`}>
                  ({rateOffset > 0 ? `+${rateOffset}% higher` : `${rateOffset}% dip`})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onOpenOutTokenModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a2233] border border-white/10 hover:border-[#c7f284]/40 text-xs text-white transition-colors cursor-pointer"
          >
            <img src={outToken.icon} alt={outToken.symbol} className="w-4 h-4 rounded-full" />
            <span>{outToken.symbol}</span>
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[#131924] border border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> Auto-Cancel Expiry:
        </span>

        <div className="relative flex items-center p-0.5 rounded-lg bg-[#0a0e17] border border-white/10">
          {(['1d', '7d', '30d', 'never'] as const).map((exp) => {
            const isActive = expiry === exp;
            return (
              <button
                key={exp}
                onClick={() => setExpiry(exp)}
                className={`relative z-10 px-2.5 py-1 rounded text-[11px] uppercase font-mono transition-colors cursor-pointer ${
                  isActive ? 'text-[#c7f284] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="limitExpiryPill"
                    className="absolute inset-0 rounded bg-[#c7f284]/15 border border-[#c7f284]/30 -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {exp}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#131924] border border-white/5 flex justify-between items-center text-xs">
        <span className="text-slate-400">Total Output at Trigger:</span>
        <span className="font-mono text-sm font-bold text-[#c7f284]">
          ~{estimatedOut.toFixed(2)} {outToken.symbol}
        </span>
      </div>
    </div>
  );
};
