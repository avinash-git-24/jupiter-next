import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  TrendingUp, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Repeat,
  CheckCircle2
} from 'lucide-react';
import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTokenToSwap: (token: Token) => void;
  walletAddress: string;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onSelectTokenToSwap,
  walletAddress
}) => {
  const [tab, setTab] = useState<'holdings' | 'orders' | 'history'>('holdings');

  if (!isOpen) return null;

  const holdings = [
    { token: POPULAR_TOKENS[0], balance: 24.85, valueUsd: 4002.50, pnl: '+12.4%' },
    { token: POPULAR_TOKENS[1], balance: 1840.50, valueUsd: 1840.50, pnl: '0.0%' },
    { token: POPULAR_TOKENS[2], balance: 8450.00, valueUsd: 9126.00, pnl: '+18.2%' },
    { token: POPULAR_TOKENS[3], balance: 250.00, valueUsd: 440.00, pnl: '+4.5%' },
    { token: POPULAR_TOKENS[4], balance: 350000000, valueUsd: 580.00, pnl: '-2.1%' }
  ];

  const totalValue = holdings.reduce((acc, h) => acc + h.valueUsd, 0);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer select-none">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c7f284]/15 border border-[#c7f284]/30 flex items-center justify-center text-[#c7f284]">
              <Wallet className="w-4 h-4 text-[#c7f284]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Solana Portfolio</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#c7f284]/15 text-[#c7f284] border border-[#c7f284]/30 text-[10px] font-mono font-bold">
                  Mainnet
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{walletAddress}</span>
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

        <div className="p-4 bg-[#131924] border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-mono">Total Estimated Balance</span>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+$1,248.50 (24h)</span>
          </div>
        </div>

        <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-[#0d111c] text-xs font-mono">
          <button
            onClick={() => setTab('holdings')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              tab === 'holdings' ? 'bg-[#c7f284] text-[#080b11]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Holdings (5)
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              tab === 'orders' ? 'bg-[#c7f284] text-[#080b11]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Open Orders (2)
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
              tab === 'history' ? 'bg-[#c7f284] text-[#080b11]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent Activity
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[45vh]">
          {tab === 'holdings' && (
            <div className="space-y-1.5">
              {holdings.map((item) => (
                <div
                  key={item.token.symbol}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#131924] border border-white/5 hover:border-[#c7f284]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.token.icon} alt={item.token.symbol} className="w-8 h-8 rounded-full bg-black object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{item.token.symbol}</span>
                        <span className="text-xs text-slate-400">{item.token.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        ${item.token.priceUsd < 0.01 ? item.token.priceUsd.toFixed(6) : item.token.priceUsd.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">
                        {item.balance > 1000 ? item.balance.toLocaleString() : item.balance.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ${item.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTokenToSwap(item.token);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#c7f284]/15 hover:bg-[#c7f284] text-[#c7f284] hover:text-[#080b11] border border-[#c7f284]/30 text-xs font-bold transition-all cursor-pointer font-mono"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#131924] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c7f284]" />
                    <span className="text-xs font-bold text-white">Limit Order: Sell 5.0 SOL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                    Pending Trigger
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Trigger Price: $168.00</span>
                  <span>Est. Return: $840.00 USDC</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#131924] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-[#14F195]" />
                    <span className="text-xs font-bold text-white">DCA Order: Accumulate SOL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    Active (3/10 Executed)
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Allocation: $50.00 USDC / day</span>
                  <span>Total Bought: 0.94 SOL</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#131924] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white">Swapped 1.5 SOL to 231.30 USDC</div>
                    <div className="text-[10px] text-slate-400">Jito MEV Protected • 280ms</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Just now</div>
                  <span className="text-[#c7f284] font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#131924] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white">Swapped 250 USDC to 1.62 SOL</div>
                    <div className="text-[10px] text-slate-400">Orca Whirlpool • 320ms</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>2h ago</div>
                  <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/5 bg-[#0d111c] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Solana RPC Synced</span>
          </div>
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#c7f284] hover:underline"
          >
            <span>View on Solscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
