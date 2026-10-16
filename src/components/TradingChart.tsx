import { useState } from 'react';
import type { Token } from '../types';
import { 
  TrendingUp, 
  Layers
} from 'lucide-react';

interface TradingChartProps {
  inToken: Token;
  outToken: Token;
}

export const TradingChart: React.FC<TradingChartProps> = ({ inToken, outToken }) => {
  const [timeframe, setTimeframe] = useState<'15M' | '1H' | '4H' | '1D' | '1W'>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number } | null>(null);

  // Generate realistic chart curve data based on inToken price
  const basePrice = inToken.priceUsd;

  // 12 points for SVG Bezier path
  const points = [
    { x: 0, y: 70, price: basePrice * 0.96 },
    { x: 50, y: 65, price: basePrice * 0.968 },
    { x: 100, y: 75, price: basePrice * 0.955 },
    { x: 150, y: 55, price: basePrice * 0.978 },
    { x: 200, y: 60, price: basePrice * 0.972 },
    { x: 250, y: 45, price: basePrice * 0.99 },
    { x: 300, y: 50, price: basePrice * 0.985 },
    { x: 350, y: 35, price: basePrice * 1.01 },
    { x: 400, y: 40, price: basePrice * 1.005 },
    { x: 450, y: 25, price: basePrice * 1.025 },
    { x: 500, y: 30, price: basePrice * 1.018 },
    { x: 550, y: 15, price: basePrice * (1 + inToken.change24h / 100) },
  ];

  // Build SVG smooth path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L 550 120 L 0 120 Z`;

  return (
    <div className="w-full rounded-3xl glass-panel-elevated p-5 space-y-5 transition-all">
      
      {/* Top Bar: Pair & Market Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        
        {/* Pair Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <img src={inToken.icon} alt={inToken.symbol} className="w-8 h-8 rounded-full border-2 border-[#090d16] bg-black z-10" />
            <img src={outToken.icon} alt={outToken.symbol} className="w-7 h-7 rounded-full border-2 border-[#090d16] bg-black" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {inToken.symbol} / {outToken.symbol}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] font-bold font-mono">
                Solana DEX Aggregate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Pyth & Jupiter On-Chain Feed
            </p>
          </div>
        </div>

        {/* Timeframe Selector Pills (Irfan Trading Chart Inspiration) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/5 text-xs font-mono">
          {(['15M', '1H', '4H', '1D', '1W'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

      </div>

      {/* Main Metric Cards: Price & 24H Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Index Price</span>
          <div className="text-xl font-bold font-mono text-white">
            ${inToken.priceUsd < 0.01 ? inToken.priceUsd.toFixed(6) : inToken.priceUsd.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{inToken.change24h}% (24h)</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">24h Volume</span>
          <div className="text-xl font-bold font-mono text-white">
            $1.42B
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Across 14 DEX pools
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">24h High / Low</span>
          <div className="text-sm font-bold font-mono text-slate-200">
            ${(basePrice * 1.04).toFixed(2)} / ${(basePrice * 0.96).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Variance: ~3.8%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Aggregate Liquidity</span>
          <div className="text-xl font-bold font-mono text-[#00f2fe]">
            $384.5M
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Deep pool depth
          </span>
        </div>
      </div>

      {/* Interactive SVG Chart Area with Gradient Fill */}
      <div className="relative h-64 w-full rounded-2xl bg-slate-950/80 border border-white/5 p-4 overflow-hidden flex flex-col justify-between">
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Dynamic Hover Banner */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs text-slate-300">
              {hoveredPoint ? `Tracked: $${hoveredPoint.price.toFixed(2)}` : `Current: $${basePrice.toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <span>Aggregated Routing</span>
            <span>•</span>
            <span className="text-emerald-400">Jito Verified</span>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="relative flex-1 w-full flex items-center">
          <svg
            viewBox="0 0 550 120"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#9945FF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="50%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Glowing Main Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#strokeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Point Anchors */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3"
                className="fill-[#00f2fe] stroke-[#05070b] stroke-2 hover:r-5 transition-all cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* Chart Bottom Axis */}
        <div className="relative z-10 flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>Live Now</span>
        </div>

      </div>

      {/* Liquidity Depth Distribution Bar (Irfan Decluttering UX) */}
      <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#00f2fe]" /> Live Liquidity Depth Split
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            Zero Local Slippage
          </span>
        </div>

        {/* Stacked Pool Share Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] transition-all" style={{ width: '65%' }} title="Orca Whirlpool (65%)" />
          <div className="h-full bg-gradient-to-r from-[#9945FF] to-[#c084fc] transition-all" style={{ width: '35%' }} title="Raydium CPMM (35%)" />
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe]" /> Orca Whirlpool: 65% ($249.9M)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#9945FF]" /> Raydium CPMM: 35% ($134.6M)
          </span>
        </div>
      </div>

    </div>
  );
};
