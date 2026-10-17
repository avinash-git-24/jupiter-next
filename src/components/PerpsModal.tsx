import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PerpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indexPrice: number;
}

export const PerpsModal: React.FC<PerpsModalProps> = ({
  isOpen,
  onClose,
  indexPrice
}) => {
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState<number>(20);
  const [collateral, setCollateral] = useState<string>('250');
  const [isExecuting, setIsExecuting] = useState(false);
  const [positionOpened, setPositionOpened] = useState(false);

  if (!isOpen) return null;

  const colNum = parseFloat(collateral) || 0;
  const positionSize = colNum * leverage;
  const liquidationOffset = (indexPrice / leverage) * 0.9;
  const liqPrice = side === 'long' 
    ? Math.max(0, indexPrice - liquidationOffset)
    : indexPrice + liquidationOffset;

  const handleOpenPosition = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setPositionOpened(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c7f284', '#14F195', '#ffffff']
      });
      setTimeout(() => {
        setPositionOpened(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer select-none">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Jupiter Perps</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                  100x Beta
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                SOL-PERP • Pyth Oracle: ${indexPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center p-1 rounded-xl bg-[#131924] border border-white/5 text-xs font-bold">
            <button
              onClick={() => setSide('long')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                side === 'long'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Long SOL</span>
            </button>
            <button
              onClick={() => setSide('short')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                side === 'short'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Short SOL</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#131924] border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Pay Collateral</span>
              <span>Bal: 1,840.50 USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className="w-full bg-transparent text-2xl font-black font-mono text-white focus:outline-none"
              />
              <span className="px-2.5 py-1 rounded-lg bg-[#1a2233] text-xs font-bold text-white font-mono">
                USDC
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Leverage Multiplier:
              </span>
              <span className="text-[#c7f284] font-black text-sm">{leverage}x</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
              {[5, 10, 20, 50, 100].map((lev) => (
                <button
                  key={lev}
                  onClick={() => setLeverage(lev)}
                  className={`py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                    leverage === lev
                      ? 'bg-[#c7f284] text-[#080b11] border-[#c7f284] shadow-md shadow-[#c7f284]/20'
                      : 'bg-[#131924] text-slate-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080b11] border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Position Size:</span>
              <span className="text-white font-bold">${positionSize.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Entry Price:</span>
              <span className="text-slate-200">${indexPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Est. Liquidation Price:</span>
              <span className="text-rose-400 font-bold">${liqPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Borrow Rate:</span>
              <span className="text-slate-200">0.008% / hr</span>
            </div>
          </div>

          {leverage >= 50 && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>High leverage warning: Liquidation distance is ~{((1 / leverage) * 100).toFixed(1)}%</span>
            </div>
          )}

          <button
            onClick={handleOpenPosition}
            disabled={isExecuting || colNum <= 0}
            className={`w-full py-3.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
              side === 'long'
                ? 'bg-emerald-400 hover:bg-emerald-300 text-[#080b11] shadow-emerald-400/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            }`}
          >
            {isExecuting ? (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-spin" />
                Routing via Jito MEV Bundle...
              </span>
            ) : positionOpened ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Position Confirmed on Solana!
              </span>
            ) : (
              <span>
                {side === 'long' ? 'Open Long' : 'Open Short'} ${positionSize.toLocaleString()} ({leverage}x)
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c7f284]" />
            <span>Zero Price Impact • Jito Frontrun Protected</span>
          </div>
        </div>

      </div>
    </div>
  );
};
