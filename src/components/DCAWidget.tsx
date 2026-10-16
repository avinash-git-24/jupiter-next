import { useState } from 'react';
import type { Token } from '../types';
import { TrendingUp, Clock } from 'lucide-react';

interface DCAWidgetProps {
  inToken: Token;
  outToken: Token;
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
}

export const DCAWidget: React.FC<DCAWidgetProps> = ({
  inToken,
  outToken,
  onOpenInTokenModal,
  onOpenOutTokenModal,
}) => {
  const [totalAmount, setTotalAmount] = useState('500');
  const [frequency, setFrequency] = useState<'hour' | 'day' | 'week'>('day');
  const [totalOrders, setTotalOrders] = useState(10);

  const amountNumber = parseFloat(totalAmount) || 0;
  const orderAmount = totalOrders > 0 ? amountNumber / totalOrders : 0;
  const estimatedReceiveTotal = (amountNumber * inToken.priceUsd) / outToken.priceUsd;

  return (
    <div className="space-y-4">
      {/* Total Budget Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>I want to allocate total:</span>
          <span className="font-mono">Balance: {inToken.balance} {inToken.symbol}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
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

      {/* Target Token Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>To buy recurringly:</span>
          <span>Target Asset</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-mono font-bold text-slate-200">
            ~{estimatedReceiveTotal.toFixed(2)}
          </div>

          <button
            onClick={onOpenOutTokenModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 hover:border-[#00f2fe]/40 transition-colors cursor-pointer"
          >
            <img src={outToken.icon} alt={outToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-sm text-white">{outToken.symbol}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Projected average execution price: ${outToken.priceUsd.toFixed(2)}
        </div>
      </div>

      {/* Frequency & Order Matrix Slider */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#00f2fe]" /> Execution Interval:
          </span>
          <div className="flex gap-1 p-0.5 rounded-lg bg-slate-900 border border-white/5">
            {(['hour', 'day', 'week'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`px-2.5 py-0.5 rounded text-[11px] capitalize font-medium transition-all cursor-pointer ${
                  frequency === f
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Every {f}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Orders Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Total Split Orders:</span>
            <span className="font-mono text-white font-bold">{totalOrders} orders</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            value={totalOrders}
            onChange={(e) => setTotalOrders(parseInt(e.target.value))}
            className="w-full accent-[#00f2fe] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2 orders</span>
            <span>30 orders</span>
          </div>
        </div>

        {/* Breakdown Summary */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Per Order Size:</span>
            <span className="font-mono text-[#00f2fe] font-semibold">
              {orderAmount.toFixed(4)} {inToken.symbol} (~${(orderAmount * inToken.priceUsd).toFixed(2)})
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Total Time Span:</span>
            <span className="font-mono text-slate-200">
              {totalOrders} {frequency}s ({frequency === 'hour' ? `${(totalOrders / 24).toFixed(1)} days` : `${totalOrders} days`})
            </span>
          </div>
        </div>
      </div>

      {/* Visual Accumulation Curve Simulation */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-[#00f2fe]/10 to-emerald-500/10 border border-[#00f2fe]/20 text-xs flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="text-[11px] text-slate-300">
          <span className="font-bold text-white">DCA Volatility Protection:</span> By spreading into {totalOrders} orders, you eliminate local peak slippage and average out Solana market variance.
        </div>
      </div>
    </div>
  );
};
