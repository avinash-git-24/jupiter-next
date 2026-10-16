import type { TransactionReceipt } from '../types';
import { Check, ExternalLink, ShieldCheck, X, Layers, Target, Repeat, Clock } from 'lucide-react';

interface ReceiptModalProps {
  receipt: TransactionReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const mode = receipt.mode || 'swap';

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer">
      <div 
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0f1422] to-[#080b12] border border-white/10 shadow-2xl p-6 relative overflow-hidden specular-card cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#00f2fe]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#00f2fe] p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0a0e17] rounded-[14px] flex items-center justify-center">
              {mode === 'limit' ? (
                <Target className="w-7 h-7 text-[#00f2fe]" />
              ) : mode === 'dca' ? (
                <Repeat className="w-7 h-7 text-purple-400" />
              ) : (
                <Check className="w-7 h-7 text-emerald-400 stroke-[3]" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'limit'
              ? 'Limit Order Placed!'
              : mode === 'dca'
              ? 'DCA Strategy Initiated!'
              : 'Transaction Confirmed!'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'limit' ? (
              <span>Order registered on Solana CLMM order book</span>
            ) : mode === 'dca' ? (
              <span>Automated DCA program deployed on Solana</span>
            ) : (
              <span>
                Executed seamlessly on Solana in <span className="text-[#00f2fe] font-mono font-medium">{receipt.executionMs}ms</span>
              </span>
            )}
          </p>
        </div>

        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={receipt.inToken.icon} alt={receipt.inToken.symbol} className="w-7 h-7 rounded-full" />
              <span className="font-mono font-bold text-white text-base">
                {receipt.inAmount} {receipt.inToken.symbol}
              </span>
            </div>

            <span className="text-slate-500 text-sm font-bold">→</span>

            <div className="flex items-center gap-2">
              <img src={receipt.outToken.icon} alt={receipt.outToken.symbol} className="w-7 h-7 rounded-full" />
              <span className="font-mono font-bold text-emerald-400 text-base">
                ~{receipt.outAmount.toFixed(2)} {receipt.outToken.symbol}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {mode === 'limit' ? 'Trigger Rate Set:' : mode === 'dca' ? 'Recurring Interval:' : 'Route Advantage:'}
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              {mode === 'limit'
                ? `1 ${receipt.inToken.symbol} = $${(receipt.limitTriggerRate || (receipt.outAmount / receipt.inAmount)).toFixed(2)}`
                : mode === 'dca'
                ? `${receipt.dcaOrders || 10} orders every ${receipt.dcaFrequency || 'day'}`
                : `+$${receipt.savedUsd.toFixed(2)} saved`}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-300 mb-6">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00f2fe]" /> Security Engine:
            </span>
            <span className="font-medium text-slate-200">Jito MEV Protected</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1">
              {mode === 'dca' ? <Clock className="w-3.5 h-3.5 text-purple-400" /> : <Layers className="w-3.5 h-3.5 text-slate-400" />}
              {mode === 'dca' ? 'Schedule Status:' : 'Route Execution:'}
            </span>
            <span className="font-mono text-slate-200">
              {mode === 'dca' ? 'Active (Next in ~24h)' : '65% Orca + 35% Raydium'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Network Fee:</span>
            <span className="font-mono text-slate-200">0.000005 SOL (~$0.0007)</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Transaction Signature:</span>
            <a
              href={`https://solscan.io/tx/${receipt.txSignature}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[#00f2fe] flex items-center gap-1 hover:underline"
            >
              <span>{receipt.txSignature.slice(0, 8)}...{receipt.txSignature.slice(-6)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://solscan.io/tx/${receipt.txSignature}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View on Solscan</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00f2fe]/20"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
