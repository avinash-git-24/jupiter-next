import { useState, useEffect } from 'react';
import type { Token } from '../types';
import { Activity, ExternalLink, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwapItem {
  id: string;
  time: string;
  type: 'buy' | 'sell';
  inAmount: string;
  inSymbol: string;
  outAmount: string;
  outSymbol: string;
  valueUsd: number;
  dex: string;
  wallet: string;
  txHash: string;
  isWhale: boolean;
}

const INITIAL_SWAPS: SwapItem[] = [
  {
    id: 'tx-1',
    time: '2s ago',
    type: 'buy',
    inAmount: '25.0',
    inSymbol: 'SOL',
    outAmount: '3,855.00',
    outSymbol: 'USDC',
    valueUsd: 3855,
    dex: 'Orca Whirlpool',
    wallet: '8Fk2...9vLt',
    txHash: '4ZkF9x8Nm2Pq',
    isWhale: false
  },
  {
    id: 'tx-2',
    time: '5s ago',
    type: 'buy',
    inAmount: '68.5',
    inSymbol: 'SOL',
    outAmount: '10,562.70',
    outSymbol: 'USDC',
    valueUsd: 10562,
    dex: 'Jupiter Direct',
    wallet: '3Mn8...2xKa',
    txHash: '9Lp0vKw3mRt8',
    isWhale: true
  },
  {
    id: 'tx-3',
    time: '9s ago',
    type: 'sell',
    inAmount: '1,850',
    inSymbol: 'JUP',
    outAmount: '10.5',
    outSymbol: 'SOL',
    valueUsd: 1619,
    dex: 'Raydium CPMM',
    wallet: '7Xq1...4mZb',
    txHash: '1a9cQm2bZ1xQ',
    isWhale: false
  },
  {
    id: 'tx-4',
    time: '14s ago',
    type: 'buy',
    inAmount: '350M',
    inSymbol: 'BONK',
    outAmount: '45.2',
    outSymbol: 'SOL',
    valueUsd: 6970,
    dex: 'Orca Whirlpool',
    wallet: '9Yt5...7rPw',
    txHash: '8pLa9cQm2bZ1',
    isWhale: true
  },
  {
    id: 'tx-5',
    time: '19s ago',
    type: 'buy',
    inAmount: '12.0',
    inSymbol: 'SOL',
    outAmount: '1,850.40',
    outSymbol: 'USDC',
    valueUsd: 1850,
    dex: 'Meteora DLMM',
    wallet: '2Bc4...6kLm',
    txHash: '3mRt8pLa9cQm',
    isWhale: false
  }
];

interface RecentSwapsFeedProps {
  onSelectPair?: (inSymbol: string, outSymbol: string) => void;
  activeToken: Token;
}

export const RecentSwapsFeed: React.FC<RecentSwapsFeedProps> = ({
  onSelectPair,
  activeToken
}) => {
  const [filter, setFilter] = useState<'all' | 'whale' | 'active'>('all');
  const [swaps, setSwaps] = useState<SwapItem[]>(INITIAL_SWAPS);

  // Simulate occasional live transactions streaming in
  useEffect(() => {
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.4;
      const isWhale = Math.random() > 0.7;
      const solVal = isWhale ? (40 + Math.random() * 50) : (1 + Math.random() * 15);
      const usdVal = solVal * activeToken.priceUsd;

      const newTx: SwapItem = {
        id: `tx-${Date.now()}`,
        time: 'Just now',
        type: isBuy ? 'buy' : 'sell',
        inAmount: solVal.toFixed(2),
        inSymbol: activeToken.symbol,
        outAmount: usdVal.toFixed(2),
        outSymbol: 'USDC',
        valueUsd: Math.round(usdVal),
        dex: Math.random() > 0.5 ? 'Orca Whirlpool' : 'Raydium CPMM',
        wallet: `${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        txHash: Math.random().toString(36).substring(2, 14),
        isWhale
      };

      setSwaps((prev) => [newTx, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeToken]);

  const displayedSwaps = swaps.filter((s) => {
    if (filter === 'whale') return s.isWhale || s.valueUsd > 5000;
    if (filter === 'active') return s.inSymbol === activeToken.symbol || s.outSymbol === activeToken.symbol;
    return true;
  });

  return (
    <div className="w-full rounded-3xl threeui-specular-card p-5 space-y-4 shadow-2xl relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe]">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Live Solana Aggregator Feed
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sub-second
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Streaming transactions directly via Jupiter Routing V3
            </p>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="relative flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
          {(['all', 'whale', 'active'] as const).map((tab) => {
            const isActive = filter === tab;
            const label = tab === 'all' ? 'All Swaps' : tab === 'whale' ? 'Whale (> $5K)' : `${activeToken.symbol} Only`;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`relative z-10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                  isActive ? 'text-[#00f2fe] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="recentSwapsTab"
                    className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {displayedSwaps.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={() => onSelectPair && onSelectPair(item.inSymbol, item.outSymbol)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-[#00f2fe]/40 hover:bg-slate-900/80 transition-all cursor-pointer group"
            >
              {/* Left Column: Action & Pair */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'buy'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.type === 'buy' ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">
                      {item.inAmount} {item.inSymbol} → {item.outAmount} {item.outSymbol}
                    </span>
                    {item.isWhale && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                        Whale
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Layers className="w-2.5 h-2.5 text-slate-400" />
                      {item.dex}
                    </span>
                    <span>•</span>
                    <span>Wallet: {item.wallet}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: USD Value & Time */}
              <div className="text-right">
                <div className="font-mono text-xs font-bold text-white group-hover:text-[#00f2fe] transition-colors">
                  ${item.valueUsd.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                  <span>{item.time}</span>
                  <a
                    href={`https://solscan.io/tx/${item.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-[#00f2fe] transition-colors"
                    title="View Transaction on Solscan"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Real-time Solana RPC WebSocket</span>
        </span>
        <span className="text-slate-400">
          Showing latest 6 confirmed blocks
        </span>
      </div>

    </div>
  );
};
