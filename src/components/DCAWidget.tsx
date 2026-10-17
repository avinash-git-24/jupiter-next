import { useState } from 'react';
import type { Token } from '../types';
import { Clock, ChevronDown, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

interface DCAWidgetProps {
  inToken: Token;
  outToken: Token;
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
  totalAmount?: string;
  onTotalAmountChange?: (val: string) => void;
  orders?: number;
  onOrdersChange?: (val: number) => void;
  frequency?: 'hour' | 'day' | 'week';
  onFrequencyChange?: (val: 'hour' | 'day' | 'week') => void;
}

export const DCAWidget: React.FC<DCAWidgetProps> = ({
  inToken,
  outToken,
  onOpenInTokenModal,
  onOpenOutTokenModal,
  totalAmount: totalAmountProp,
  onTotalAmountChange,
  orders: ordersProp,
  onOrdersChange,
  frequency: frequencyProp,
  onFrequencyChange
}) => {
  const [internalAmount, setInternalAmount] = useState('500');
  const [internalFrequency, setInternalFrequency] = useState<'hour' | 'day' | 'week'>('day');
  const [internalOrders, setInternalOrders] = useState(10);

  const totalAmount = totalAmountProp !== undefined ? totalAmountProp : internalAmount;
  const setTotalAmount = onTotalAmountChange || setInternalAmount;
  const frequency = frequencyProp !== undefined ? frequencyProp : internalFrequency;
  const setFrequency = onFrequencyChange || setInternalFrequency;
  const totalOrders = ordersProp !== undefined ? ordersProp : internalOrders;
  const setTotalOrders = onOrdersChange || setInternalOrders;

  const amountNumber = parseFloat(totalAmount) || 0;
  const orderAmount = totalOrders > 0 ? amountNumber / totalOrders : 0;
  const estimatedReceiveTotal = (amountNumber * inToken.priceUsd) / outToken.priceUsd;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#131924] border border-white/5 space-y-2 focus-within:border-[#c7f284]/50 focus-within:ring-1 focus-within:ring-[#c7f284]/20 transition-all">
        <div className="flex justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">Total Allocation Budget:</span>
          <span className="font-mono text-slate-400">Balance: {inToken.balance} {inToken.symbol}</span>
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

      <div className="p-4 rounded-2xl bg-[#131924] border border-white/5 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-purple-400" /> Recurring Acquisition:
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Target Asset</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-mono font-bold text-[#c7f284]">
            ~{estimatedReceiveTotal.toFixed(2)}
          </div>

          <button
            onClick={onOpenOutTokenModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a2233] border border-white/10 hover:border-[#c7f284]/40 transition-colors cursor-pointer group"
          >
            <img src={outToken.icon} alt={outToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-sm text-white">{outToken.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Projected average benchmark: ${outToken.priceUsd.toFixed(2)}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#131924] border border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#c7f284]" /> Execution Interval:
          </span>

          <div className="relative flex items-center p-0.5 rounded-lg bg-[#0a0e17] border border-white/10">
            {(['hour', 'day', 'week'] as const).map((f) => {
              const isActive = frequency === f;
              return (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`relative z-10 px-2.5 py-1 rounded text-[11px] capitalize font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-[#c7f284] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dcaFrequencyPill"
                      className="absolute inset-0 rounded bg-[#c7f284]/15 border border-[#c7f284]/30 -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  Every {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Total Orders:</span>
            <span className="font-mono text-[#c7f284] font-bold">{totalOrders} orders</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            value={totalOrders}
            onChange={(e) => setTotalOrders(parseInt(e.target.value))}
            className="w-full accent-[#c7f284] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2 orders</span>
            <span>30 orders</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0a0e17] border border-white/5 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Per Order Size:</span>
            <span className="font-mono text-[#c7f284] font-semibold">
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
    </div>
  );
};
