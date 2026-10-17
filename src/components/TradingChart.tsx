import { useState, useEffect } from 'react';
import type { Token } from '../types';
import { 
  TrendingUp, 
  BarChart2, 
  LineChart, 
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  inToken: Token;
  outToken: Token;
}

const formatPrice = (val: number) => {
  if (val < 0.0001) return val.toFixed(7);
  if (val < 1) return val.toFixed(4);
  return val.toFixed(2);
};

const TIMEFRAME_CONFIGS = {
  '15M': {
    times: ['14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15'],
    multipliers: [0.992, 0.994, 0.991, 0.995, 0.997, 0.996, 0.998, 1.001, 0.999, 1.003, 1.002, 1.005, 1.004, 1.007, 1.006, 1.008, 1.007, 1.009],
    axis: ['14:00', '14:45', '15:30', '16:15', '17:00', '17:45', 'Live (15M Slot)'],
    volBase: 19000
  },
  '1H': {
    times: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    multipliers: [0.985, 0.982, 0.987, 0.984, 0.989, 0.992, 0.990, 0.994, 0.998, 0.995, 1.002, 1.006, 1.001, 1.008, 1.012, 1.009, 1.015, 1.018],
    axis: ['02:00', '05:00', '08:00', '11:00', '14:00', '17:00', 'Live (1H Slot)'],
    volBase: 36000
  },
  '4H': {
    times: ['D1 00:00', 'D1 04:00', 'D1 08:00', 'D1 12:00', 'D1 16:00', 'D1 20:00', 'D2 00:00', 'D2 04:00', 'D2 08:00', 'D2 12:00', 'D2 16:00', 'D2 20:00', 'D3 00:00', 'D3 04:00', 'D3 08:00', 'D3 12:00', 'D3 16:00', 'D3 20:00'],
    multipliers: [0.975, 0.970, 0.980, 0.974, 0.982, 0.988, 0.985, 0.992, 0.996, 0.993, 1.004, 1.008, 1.003, 1.012, 1.018, 1.014, 1.022, 1.025],
    axis: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Live (4H Slot)'],
    volBase: 58000
  },
  '1D': {
    times: ['00:00', '01:20', '02:40', '04:00', '05:20', '06:40', '08:00', '09:20', '10:40', '12:00', '13:20', '14:40', '16:00', '17:20', '18:40', '20:00', '21:20', '22:40'],
    multipliers: [0.965, 0.968, 0.974, 0.971, 0.982, 0.986, 0.984, 0.978, 0.981, 0.994, 1.004, 1.002, 1.011, 1.020, 1.018, 1.029, 1.035, 1.038],
    axis: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Live Now (Solana Slot)'],
    volBase: 72000
  },
  '1W': {
    times: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13', 'W14', 'W15', 'W16', 'W17', 'W18'],
    multipliers: [0.920, 0.915, 0.930, 0.945, 0.938, 0.955, 0.968, 0.960, 0.975, 0.990, 0.985, 1.010, 1.025, 1.018, 1.035, 1.050, 1.042, 1.055],
    axis: ['Week 1', 'Week 4', 'Week 8', 'Week 12', 'Week 15', 'Week 18', 'Live (1W Slot)'],
    volBase: 125000
  }
};

export const TradingChart: React.FC<TradingChartProps> = ({ inToken, outToken }) => {
  const [timeframe, setTimeframe] = useState<'15M' | '1H' | '4H' | '1D' | '1W'>('1D');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showEma, setShowEma] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [liveDelta, setLiveDelta] = useState(0);
  const [isLivePulsing, setIsLivePulsing] = useState(false);

  const base = inToken.priceUsd;

  useEffect(() => {
    const timer = setInterval(() => {
      const shift = (Math.random() * 0.002 - 0.001);
      setLiveDelta((prev) => +(prev + shift).toFixed(5));
      setIsLivePulsing(true);
      setTimeout(() => setIsLivePulsing(false), 900);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const cfg = TIMEFRAME_CONFIGS[timeframe];
  const candles: CandleData[] = cfg.times.map((t, i) => {
    let mult = cfg.multipliers[i];
    if (i === cfg.times.length - 1) {
      mult += liveDelta;
    }
    const open = base * (mult - 0.0035 * (i % 2 === 0 ? 1 : -1));
    const close = base * mult;
    const high = Math.max(open, close) * 1.004;
    const low = Math.min(open, close) * 0.996;
    const volume = Math.round(cfg.volBase * (0.8 + ((i * 7) % 9) * 0.09));
    return { time: t, open, high, low, close, volume };
  });

  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.998;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 160;
  const volumeHeight = 45;
  const svgWidth = 600;
  const candleSpacing = svgWidth / candles.length;
  const candleWidth = 18;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 20) - 10;
  };

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  const emaPoints = candles.map((c, i) => {
    const x = i * candleSpacing + candleSpacing / 2;
    const y = getY((c.high + c.low + c.close * 2) / 4);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const linePoints = candles.map((c, i) => {
    const x = i * candleSpacing + candleSpacing / 2;
    const y = getY(c.close);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaD = `${linePoints} L ${svgWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="w-full rounded-3xl specular-card p-5 space-y-4 transition-all shadow-2xl relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        
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
              <span className="px-2 py-0.5 rounded-md bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 text-[10px] font-bold font-mono">
                Solana DEX Aggregate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Pyth and Jupiter On-Chain Feed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center p-0.5 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setChartType('candles')}
              className={`relative z-10 p-1.5 rounded-lg transition-colors cursor-pointer ${
                chartType === 'candles' ? 'text-[#00f2fe]' : 'text-slate-400 hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              {chartType === 'candles' && (
                <motion.div
                  layoutId="chartTypePill"
                  className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`relative z-10 p-1.5 rounded-lg transition-colors cursor-pointer ${
                chartType === 'line' ? 'text-[#00f2fe]' : 'text-slate-400 hover:text-white'
              }`}
              title="Line Area Chart"
            >
              {chartType === 'line' && (
                <motion.div
                  layoutId="chartTypePill"
                  className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center p-0.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
            {(['15M', '1H', '4H', '1D', '1W'] as const).map((tf) => {
              const isActive = timeframe === tf;
              return (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`relative z-10 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'text-[#00f2fe] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="chartTimeframePill"
                      className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Index Price</span>
          <div className="text-xl font-bold font-mono text-white">
            ${inToken.priceUsd < 0.01 ? inToken.priceUsd.toFixed(6) : inToken.priceUsd.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{inToken.change24h}% (24h)</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">24h Volume</span>
          <div className="text-xl font-bold font-mono text-white">
            $1.42B
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Across 14 DEX pools
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">24h High / Low</span>
          <div className="text-sm font-bold font-mono text-slate-200">
            ${formatPrice(base * 1.042)} / ${formatPrice(base * 0.960)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Variance: ~4.2%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Aggregate Liquidity</span>
          <div className="text-xl font-bold font-mono text-[#00f2fe]">
            $384.5M
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Deep pool depth
          </span>
        </div>
      </div>

      <div className="relative rounded-2xl bg-slate-950/90 border border-white/10 p-4 overflow-hidden">
        
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-2 border-b border-white/5">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-slate-400">Time: <span className="text-white">{activeCandle.time}</span></span>
            <span>O: <span className="text-white">${formatPrice(activeCandle.open)}</span></span>
            <span>H: <span className="text-emerald-400">${formatPrice(activeCandle.high)}</span></span>
            <span>L: <span className="text-rose-400">${formatPrice(activeCandle.low)}</span></span>
            <span>C: <span className="text-white font-bold">${formatPrice(activeCandle.close)}</span></span>
            <span className="hidden sm:inline text-slate-400">Vol: <span className="text-[#00f2fe]">{activeCandle.volume.toLocaleString()}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEma(!showEma)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                showEma ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/30' : 'bg-slate-900 text-slate-500 border-white/5'
              }`}
            >
              EMA 20
            </button>
          </div>
        </div>

        <div className="relative w-full h-64 flex items-center pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${chartHeight + volumeHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#9945FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="50%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>

            {[0.2, 0.4, 0.6, 0.8].map((pct, i) => (
              <line
                key={i}
                x1="0"
                y1={chartHeight * pct}
                x2={svgWidth}
                y2={chartHeight * pct}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            ))}

            <line
              x1="0"
              y1={chartHeight}
              x2={svgWidth}
              y2={chartHeight}
              stroke="rgba(255,255,255,0.08)"
            />

            {chartType === 'candles' && (
              <g>
                {candles.map((c, i) => {
                  const isBullish = c.close >= c.open;
                  const color = isBullish ? '#10b981' : '#f43f5e';
                  const x = i * candleSpacing + (candleSpacing - candleWidth) / 2;
                  const centerX = x + candleWidth / 2;

                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));

                  const volBarHeight = (c.volume / maxVolume) * (volumeHeight - 8);
                  const volY = chartHeight + volumeHeight - volBarHeight;

                  const isLatest = i === candles.length - 1;

                  return (
                    <g 
                      key={i} 
                      className="cursor-crosshair group"
                      onMouseEnter={() => setHoveredCandle(c)}
                      onMouseLeave={() => setHoveredCandle(null)}
                    >
                      <line
                        x1={centerX}
                        y1={yHigh}
                        x2={centerX}
                        y2={yLow}
                        stroke={color}
                        strokeWidth={isLatest && isLivePulsing ? 2 : 1.5}
                      />

                      <rect
                        x={x}
                        y={bodyTop}
                        width={candleWidth}
                        height={bodyHeight}
                        rx="2"
                        fill={color}
                        fillOpacity={isLatest && isLivePulsing ? 1 : 0.85}
                        stroke={color}
                        strokeWidth={isLatest && isLivePulsing ? 1.5 : 1}
                        className={`group-hover:fill-opacity-100 transition-all ${isLatest && isLivePulsing ? 'filter drop-shadow-[0_0_8px_rgba(20,241,149,0.7)]' : ''}`}
                      />

                      <rect
                        x={x + 2}
                        y={volY}
                        width={candleWidth - 4}
                        height={volBarHeight}
                        rx="1.5"
                        fill={color}
                        fillOpacity={0.35}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {chartType === 'line' && (
              <g>
                <path d={areaD} fill="url(#areaGradient)" />
                <path
                  d={linePoints}
                  fill="none"
                  stroke="url(#lineStrokeGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {showEma && (
              <path
                d={emaPoints}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.75"
              />
            )}
          </svg>
        </div>

        <div className="relative z-10 flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
          {cfg.axis.slice(0, -1).map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
          <span className="text-[#00f2fe] flex items-center gap-1.5 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isLivePulsing ? 'bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-ping' : 'bg-[#00f2fe]'}`} />
            {cfg.axis[cfg.axis.length - 1]}
          </span>
        </div>

      </div>

      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#00f2fe]" /> Live Liquidity Depth Split
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            Zero Local Slippage
          </span>
        </div>

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
