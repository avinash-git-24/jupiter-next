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

  const formatPrice = (p: number) => {
    if (p < 0.0001) return `$${p.toFixed(7)}`;
    if (p < 0.01) return `$${p.toFixed(5)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    return `$${p.toFixed(2)}`;
  };

  const formatSize = (s: number) => {
    if (s >= 1000000) return `${(s / 1000000).toFixed(1)}M`;
    if (s >= 1000) return `${(s / 1000).toFixed(1)}k`;
    return s.toFixed(1);
  };

  const formatTotal = (t: number) => {
    if (t >= 1000000) return `$${(t / 1000000).toFixed(2)}M`;
    if (t >= 1000) return `$${(t / 1000).toFixed(1)}k`;
    return `$${t.toFixed(0)}`;
  };

  const isMeme = inToken.priceUsd < 0.01;
  const sizeMultiplier = isMeme ? 500000 : 1;
  const askOffsets = [0.0035, 0.0025, 0.0016, 0.0009, 0.0004];
  const bidOffsets = [-0.0004, -0.0011, -0.0019, -0.0028, -0.0039];

  const generateAsks = (bp: number) => askOffsets.map((offset, idx) => {
    const price = bp * (1 + offset);
    const size = [45.2, 28.6, 64.1, 19.5, 38.0][idx] * sizeMultiplier;
    return {
      price,
      size,
      total: price * size,
      depthPct: [92, 75, 58, 35, 18][idx]
    };
  });

  const generateBids = (bp: number) => bidOffsets.map((offset, idx) => {
    const price = bp * (1 + offset);
    const size = [52.4, 31.8, 85.0, 42.1, 76.5][idx] * sizeMultiplier;
    return {
      price,
      size,
      total: price * size,
      depthPct: [22, 41, 67, 84, 98][idx]
    };
  });

  // Recompute relative order book rows whenever token or price changes
  const [asks, setAsks] = useState<OrderBookRow[]>(() => generateAsks(basePrice));
  const [bids, setBids] = useState<OrderBookRow[]>(() => generateBids(basePrice));
  const [prevSymbol, setPrevSymbol] = useState(inToken.symbol);

  // Sync state from props during render (React recommended pattern, avoiding cascading effect renders)
  if (prevSymbol !== inToken.symbol) {
    setPrevSymbol(inToken.symbol);
    setAsks(generateAsks(basePrice));
    setBids(generateBids(basePrice));
  }

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

  const bestAsk = asks[asks.length - 1]?.price ?? (basePrice * 1.0004);
  const bestBid = bids[0]?.price ?? (basePrice * 0.9996);
  const spreadVal = Math.abs(bestAsk - bestBid);
  const spreadPct = ((spreadVal / (basePrice || 1)) * 100).toFixed(3);

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
                  {formatPrice(row.price)}
                </span>
                <span className="text-slate-300 text-center z-10">
                  {formatSize(row.size)}
                </span>
                <span className="text-slate-400 text-right z-10">
                  {formatTotal(row.total)}
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
                {formatPrice(basePrice)}
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400 inline" />
              </span>
              <span className="text-[10px] text-slate-500">Live Index</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Spread:</span>
              <span className="text-[#00f2fe] font-bold">
                {formatPrice(spreadVal)} ({spreadPct}%)
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
                  {formatPrice(row.price)}
                </span>
                <span className="text-slate-300 text-center z-10">
                  {formatSize(row.size)}
                </span>
                <span className="text-slate-400 text-right z-10">
                  {formatTotal(row.total)}
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
