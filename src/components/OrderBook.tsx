import { useState, useEffect } from 'react';
import type { Token } from '../types';
import { Layers, ArrowUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderBookRow {
  price: number;
  size: number;
  total: number;
  depthPct: number;
}

interface OrderBookProps {
  inToken: Token;
  outToken: Token;
  onSelectPrice?: (price: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  inToken,
  outToken,
  onSelectPrice
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both');
  const basePrice = inToken.priceUsd;

  // Initial Asks (Sell orders above market price)
  const initialAsks: OrderBookRow[] = [
    { price: basePrice + 0.45, size: 45.2, total: (basePrice + 0.45) * 45.2, depthPct: 92 },
    { price: basePrice + 0.32, size: 28.6, total: (basePrice + 0.32) * 28.6, depthPct: 75 },
    { price: basePrice + 0.20, size: 64.1, total: (basePrice + 0.20) * 64.1, depthPct: 58 },
    { price: basePrice + 0.12, size: 19.5, total: (basePrice + 0.12) * 19.5, depthPct: 35 },
    { price: basePrice + 0.05, size: 38.0, total: (basePrice + 0.05) * 38.0, depthPct: 18 },
  ];

  // Initial Bids (Buy orders below market price)
  const initialBids: OrderBookRow[] = [
    { price: basePrice - 0.05, size: 52.4, total: (basePrice - 0.05) * 52.4, depthPct: 22 },
    { price: basePrice - 0.14, size: 31.8, total: (basePrice - 0.14) * 31.8, depthPct: 41 },
    { price: basePrice - 0.25, size: 85.0, total: (basePrice - 0.25) * 85.0, depthPct: 67 },
    { price: basePrice - 0.38, size: 42.1, total: (basePrice - 0.38) * 42.1, depthPct: 84 },
    { price: basePrice - 0.50, size: 76.5, total: (basePrice - 0.50) * 76.5, depthPct: 98 },
  ];

  const [asks, setAsks] = useState<OrderBookRow[]>(initialAsks);
  const [bids, setBids] = useState<OrderBookRow[]>(initialBids);

  // Micro-fluctuations to simulate live Solana order book matching
  useEffect(() => {
    const timer = setInterval(() => {
      setAsks((prev) =>
        prev.map((item) => ({
          ...item,
          size: +(item.size + (Math.random() * 2 - 1)).toFixed(1),
          depthPct: Math.min(100, Math.max(10, Math.round(item.depthPct + (Math.random() * 4 - 2))))
        }))
      );
      setBids((prev) =>
        prev.map((item) => ({
          ...item,
          size: +(item.size + (Math.random() * 2 - 1)).toFixed(1),
          depthPct: Math.min(100, Math.max(10, Math.round(item.depthPct + (Math.random() * 4 - 2))))
        }))
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const spread = (asks[asks.length - 1].price - bids[0].price).toFixed(2);
  const spreadPct = ((+spread / basePrice) * 100).toFixed(3);

  return (
    <div className="w-full rounded-3xl threeui-specular-card p-5 space-y-4 shadow-2xl relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Solana CLMM Order Book
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-[#00f2fe] font-mono">
                Aggregated
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Orca Whirlpools + Raydium Concentrated Depth
            </p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="relative flex items-center p-0.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
          {(['both', 'bids', 'asks'] as const).map((mode) => {
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`relative z-10 px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer text-[10px] ${
                  isActive ? 'text-[#00f2fe] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="orderBookViewPill"
                    className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {mode === 'both' ? 'Spread' : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="grid grid-cols-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
        <span>Price ({outToken.symbol})</span>
        <span className="text-center">Size ({inToken.symbol})</span>
        <span className="text-right">Total ({outToken.symbol})</span>
      </div>

      {/* Orders List Container */}
      <div className="space-y-1 font-mono text-xs">
        
        {/* Asks (Sells in Red) */}
        {(viewMode === 'both' || viewMode === 'asks') && (
          <div className="space-y-0.5">
            {asks.slice(viewMode === 'both' ? 2 : 0).map((row, i) => (
              <div
                key={i}
                onClick={() => onSelectPrice && onSelectPrice(row.price)}
                className="relative grid grid-cols-3 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                {/* Horizontal Depth Fill Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-rose-500/10 rounded-lg transition-all duration-500 pointer-events-none"
                  style={{ width: `${row.depthPct}%` }}
                />

                <span className="text-rose-400 font-semibold z-10">
                  ${row.price.toFixed(2)}
                </span>
                <span className="text-slate-300 text-center z-10">
                  {row.size.toFixed(1)}
                </span>
                <span className="text-slate-400 text-right z-10">
                  ${row.total.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Live Spread Indicator Bar */}
        {viewMode === 'both' && (
          <div className="my-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white flex items-center gap-1">
                ${basePrice.toFixed(2)}
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400 inline" />
              </span>
              <span className="text-[10px] text-slate-500">Live Index</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Spread:</span>
              <span className="text-[#00f2fe] font-bold">
                ${spread} ({spreadPct}%)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        )}

        {/* Bids (Buys in Green) */}
        {(viewMode === 'both' || viewMode === 'bids') && (
          <div className="space-y-0.5">
            {bids.slice(0, viewMode === 'both' ? 3 : 5).map((row, i) => (
              <div
                key={i}
                onClick={() => onSelectPrice && onSelectPrice(row.price)}
                className="relative grid grid-cols-3 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                {/* Horizontal Depth Fill Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-emerald-500/10 rounded-lg transition-all duration-500 pointer-events-none"
                  style={{ width: `${row.depthPct}%` }}
                />

                <span className="text-emerald-400 font-semibold z-10">
                  ${row.price.toFixed(2)}
                </span>
                <span className="text-slate-300 text-center z-10">
                  {row.size.toFixed(1)}
                </span>
                <span className="text-slate-400 text-right z-10">
                  ${row.total.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer Status Bar */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Real-time Solana CLMM Tick Feeds</span>
        </span>
        <span>Click any row to match order</span>
      </div>

    </div>
  );
};
