import React, { useState, useEffect } from 'react';
import type { Token } from '../types';
import { 
  BarChart2, 
  LineChart, 
  ExternalLink,
  Maximize2,
  Camera,
  Crosshair,
  Settings2,
  ArrowRightLeft
} from 'lucide-react';

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
  if (val < 0.01) return val.toFixed(5);
  if (val < 1) return val.toFixed(4);
  return val.toFixed(2);
};

const RAW_TIMEFRAME_DATA: Record<string, { baseMults: number[]; times: string[]; axis: string[] }> = {
  '15m': {
    baseMults: [
      0.978, 0.975, 0.979, 0.976, 0.982, 0.980, 0.985, 0.983, 0.987, 0.984,
      0.981, 0.986, 0.989, 0.987, 0.992, 0.990, 0.995, 0.998, 0.994, 0.997,
      1.002, 1.005, 1.001, 1.008, 1.012, 1.009, 1.015, 1.011, 1.007, 1.013,
      1.018, 1.014, 1.020, 1.025, 1.021, 1.019, 1.024, 1.028, 1.025, 1.031,
      1.027, 1.033, 1.037, 1.034, 1.038, 1.042, 1.039, 1.044, 1.047, 1.045
    ],
    times: Array.from({ length: 50 }, (_, i) => {
      const h = Math.floor(i / 4) + 6;
      const m = (i % 4) * 15;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }),
    axis: ['06:00', '09:00', '12:00', '15:00', '18:00', 'Live']
  },
  '1h': {
    baseMults: [
      0.965, 0.962, 0.968, 0.971, 0.967, 0.974, 0.970, 0.978, 0.982, 0.979,
      0.985, 0.981, 0.988, 0.992, 0.989, 0.995, 0.999, 0.996, 1.002, 1.006,
      1.001, 1.008, 1.014, 1.010, 1.017, 1.022, 1.018, 1.025, 1.021, 1.028,
      1.033, 1.029, 1.035, 1.039, 1.036, 1.042, 1.047, 1.043, 1.049, 1.053,
      1.050, 1.055, 1.058, 1.054, 1.059, 1.063, 1.060, 1.064, 1.067, 1.065
    ],
    times: Array.from({ length: 50 }, (_, i) => `${String(i % 24).padStart(2, '0')}:00`),
    axis: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Live']
  },
  '4h': {
    baseMults: [
      0.940, 0.935, 0.942, 0.938, 0.948, 0.952, 0.947, 0.955, 0.961, 0.958,
      0.965, 0.970, 0.966, 0.975, 0.982, 0.978, 0.986, 0.992, 0.988, 0.995,
      1.004, 1.000, 1.012, 1.018, 1.014, 1.024, 1.030, 1.026, 1.035, 1.041,
      1.037, 1.045, 1.052, 1.048, 1.057, 1.063, 1.059, 1.068, 1.074, 1.070,
      1.078, 1.084, 1.080, 1.088, 1.094, 1.090, 1.096, 1.102, 1.098, 1.095
    ],
    times: Array.from({ length: 50 }, (_, i) => `D${Math.floor(i / 6) + 1} ${(i % 6) * 4}:00`),
    axis: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Live']
  },
  '1D': {
    baseMults: [
      0.910, 0.905, 0.915, 0.920, 0.916, 0.925, 0.930, 0.926, 0.938, 0.944,
      0.940, 0.950, 0.958, 0.952, 0.964, 0.972, 0.967, 0.979, 0.988, 0.982,
      0.995, 1.005, 0.998, 1.012, 1.022, 1.016, 1.028, 1.038, 1.032, 1.044,
      1.055, 1.048, 1.060, 1.070, 1.064, 1.075, 1.086, 1.080, 1.092, 1.102,
      1.096, 1.108, 1.118, 1.112, 1.124, 1.134, 1.128, 1.138, 1.145, 1.142
    ],
    times: Array.from({ length: 50 }, (_, i) => `Oct ${i + 1}`),
    axis: ['Sep 01', 'Sep 15', 'Oct 01', 'Oct 10', 'Live']
  }
};

export const TradingChart: React.FC<TradingChartProps> = ({ inToken, outToken }) => {
  const [timeframe, setTimeframe] = useState<'15m' | '1h' | '4h' | '1D'>('15m');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showIndicators, setShowIndicators] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [liveDelta, setLiveDelta] = useState(0);

  const base = inToken.priceUsd;

  useEffect(() => {
    const timer = setInterval(() => {
      const shift = (Math.random() * 0.0016 - 0.0008);
      setLiveDelta((prev) => +(prev + shift).toFixed(5));
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  const cfg = RAW_TIMEFRAME_DATA[timeframe] || RAW_TIMEFRAME_DATA['15m'];

  const candles: CandleData[] = cfg.baseMults.map((mult, idx) => {
    let finalMult = mult;
    if (idx === cfg.baseMults.length - 1) {
      finalMult += liveDelta;
    }
    const noise = ((idx * 7) % 11) * 0.0012 - 0.006;
    const open = base * (finalMult - noise);
    const close = base * finalMult;
    const wickHighOffset = Math.abs(open - close) * (0.6 + ((idx * 3) % 5) * 0.25);
    const wickLowOffset = Math.abs(open - close) * (0.5 + ((idx * 4) % 5) * 0.22);
    const high = Math.max(open, close) + wickHighOffset;
    const low = Math.min(open, close) - wickLowOffset;
    const volume = Math.round(450 + ((idx * 13) % 29) * 35 + (idx === cfg.baseMults.length - 1 ? 210 : 0));
    return {
      time: cfg.times[idx] || `T${idx}`,
      open,
      high,
      low,
      close,
      volume
    };
  });

  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.9985;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.0015;
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 240;
  const volumeHeight = 55;
  const totalSvgHeight = chartHeight + volumeHeight;
  const svgWidth = 620;
  const candleSpacing = svgWidth / candles.length;
  const candleWidth = 7.5;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 30) - 15;
  };

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  const activeCandle = hoveredCandle || candles[candles.length - 1];
  const currentPrice = candles[candles.length - 1].close;
  const currentY = getY(currentPrice);

  const priceTiers = [0.92, 0.74, 0.56, 0.38, 0.20, 0.05].map((pct) => {
    const price = minPrice + priceRange * pct;
    const y = getY(price);
    return { price, y };
  });

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

  const highCandle = candles.reduce((prev, curr) => curr.high > prev.high ? curr : prev, candles[0]);
  const lowCandle = candles.reduce((prev, curr) => curr.low < prev.low ? curr : prev, candles[0]);

  const priceChange = currentPrice - candles[0].open;
  const priceChangePct = ((priceChange / candles[0].open) * 100).toFixed(2);
  const isOverallPositive = priceChange >= 0;

  return (
    <div className="w-full rounded-2xl bg-[#0f141f] border border-white/5 p-4 space-y-2.5 shadow-2xl select-none text-slate-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <img 
              src={inToken.icon} 
              alt={inToken.symbol} 
              className="w-7 h-7 rounded-full border border-black bg-black z-10" 
            />
            <img 
              src={outToken.icon} 
              alt={outToken.symbol} 
              className="w-6 h-6 rounded-full border border-black bg-black" 
            />
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{inToken.symbol} / {outToken.symbol}</span>
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <span className="text-slate-500">{inToken.symbol}:</span>
            <span>{inToken.mintAddress ? `${inToken.mintAddress.slice(0, 4)}...${inToken.mintAddress.slice(-4)}` : 'So11...1112'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <span className="text-slate-500">{outToken.symbol}:</span>
            <span>{outToken.mintAddress ? `${outToken.mintAddress.slice(0, 4)}...${outToken.mintAddress.slice(-4)}` : 'EPJF...Dt1v'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            ${formatPrice(currentPrice)}
          </span>
          <span className={`text-xs font-mono font-bold ${isOverallPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {isOverallPositive ? '+' : ''}{priceChangePct}%
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500 text-[11px] mr-1">Mkt Cap:</span>
            <span className="text-slate-200 font-semibold">$78.2B</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] mr-1">24h Vol:</span>
            <span className="text-slate-200 font-semibold">$1.42B</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] mr-1">Liquidity:</span>
            <span className="text-[#c7f284] font-semibold">$427.8M</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs font-mono">
        <div className="flex items-center gap-1">
          {(['15m', '1h', '4h', '1D'] as const).map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  isActive 
                    ? 'text-[#c7f284] font-extrabold bg-[#c7f284]/15 border border-[#c7f284]/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            );
          })}

          <div className="w-px h-3.5 bg-white/10 mx-1.5" />

          <button
            onClick={() => setChartType('candles')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              chartType === 'candles' ? 'text-[#c7f284] bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Candlestick Chart"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              chartType === 'line' ? 'text-[#c7f284] bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Line Area Chart"
          >
            <LineChart className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-white/10 mx-1.5" />

          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              showIndicators ? 'text-[#c7f284] bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-slate-500 mr-1 italic">fx</span> Indicators
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Crosshair">
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Snapshot">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1 pb-1 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span>O <span className="text-slate-200">${formatPrice(activeCandle.open)}</span></span>
          <span>H <span className="text-[#10b981]">${formatPrice(activeCandle.high)}</span></span>
          <span>L <span className="text-[#ef4444]">${formatPrice(activeCandle.low)}</span></span>
          <span>C <span className="text-white font-bold">${formatPrice(activeCandle.close)}</span></span>
          <span className={activeCandle.close >= activeCandle.open ? 'text-[#10b981]' : 'text-[#ef4444]'}>
            {activeCandle.close >= activeCandle.open ? '+' : ''}
            {(activeCandle.close - activeCandle.open).toFixed(2)} (
            {(((activeCandle.close - activeCandle.open) / activeCandle.open) * 100).toFixed(2)}%)
          </span>
        </div>

        <div className="text-slate-400">
          <span>Volume <span className="text-slate-200 font-bold">{activeCandle.volume.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="relative w-full flex items-stretch pt-2">
        
        <div className="flex-1 relative overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-80 overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradientJup" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#26a69a" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#26a69a" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="lineStrokeJup" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#c7f284" />
              </linearGradient>
            </defs>

            {priceTiers.map((tier, i) => (
              <line
                key={i}
                x1="0"
                y1={tier.y}
                x2={svgWidth}
                y2={tier.y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="3 3"
              />
            ))}

            <line
              x1="0"
              y1={currentY}
              x2={svgWidth}
              y2={currentY}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.65"
            />

            <line
              x1="0"
              y1={chartHeight}
              x2={svgWidth}
              y2={chartHeight}
              stroke="rgba(255, 255, 255, 0.08)"
            />

            {chartType === 'candles' && (
              <g>
                {candles.map((c, i) => {
                  const isBullish = c.close >= c.open;
                  const color = isBullish ? '#26a69a' : '#ef5350';
                  const x = i * candleSpacing + (candleSpacing - candleWidth) / 2;
                  const centerX = x + candleWidth / 2;

                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));

                  const volBarHeight = (c.volume / maxVolume) * (volumeHeight - 10);
                  const volY = totalSvgHeight - volBarHeight;

                  const isLatest = i === candles.length - 1;

                  return (
                    <g 
                      key={i} 
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredCandle(c)}
                      onMouseLeave={() => setHoveredCandle(null)}
                    >
                      <line
                        x1={centerX}
                        y1={yHigh}
                        x2={centerX}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="1.2"
                      />

                      <rect
                        x={x}
                        y={bodyTop}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={color}
                        stroke={color}
                        strokeWidth="0.8"
                        rx="0.5"
                        className={isLatest ? 'filter drop-shadow-[0_0_6px_rgba(38,166,154,0.7)]' : ''}
                      />

                      <rect
                        x={x}
                        y={volY}
                        width={candleWidth}
                        height={volBarHeight}
                        fill={color}
                        fillOpacity="0.45"
                        rx="0.5"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {chartType === 'line' && (
              <g>
                <path d={areaD} fill="url(#areaGradientJup)" />
                <path
                  d={linePoints}
                  fill="none"
                  stroke="url(#lineStrokeJup)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {showIndicators && (
              <path
                d={emaPoints}
                fill="none"
                stroke="#4facfe"
                strokeWidth="1.4"
                strokeDasharray="4 4"
                opacity="0.75"
              />
            )}
          </svg>
        </div>

        <div className="w-20 border-l border-white/5 relative flex flex-col justify-between py-2 text-[10px] font-mono select-none pl-2 shrink-0">
          <div className="self-start px-1 py-0.5 rounded bg-[#c7f284]/15 text-[#c7f284] border border-[#c7f284]/30 text-[8px] font-bold font-mono">
            High ${formatPrice(highCandle.high)}
          </div>

          {priceTiers.map((tier) => (
            <span key={`tier-${tier.price}`} className="block leading-none text-slate-400 text-[10px]">
              ${formatPrice(tier.price)}
            </span>
          ))}

          <div 
            className="absolute left-0 -translate-y-1/2 px-1.5 py-0.5 rounded-r bg-[#ef4444] text-white font-mono font-bold text-[9px] shadow-md shadow-red-500/20 flex items-center z-20 pointer-events-none"
            style={{ top: `${Math.max(12, Math.min(chartHeight - 12, currentY))}px` }}
          >
            ${formatPrice(currentPrice)}
          </div>

          <div className="self-start px-1 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[8px] font-bold font-mono">
            Low ${formatPrice(lowCandle.low)}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5 pr-20">
        <div className="flex items-center gap-1.5 text-slate-600 font-bold">
          <span>Jup TradingView v3.0</span>
        </div>

        <div className="flex items-center gap-8">
          {cfg.axis.map((lbl, idx) => (
            <span key={`axis-${lbl}-${idx}`} className={idx === cfg.axis.length - 1 ? 'text-[#c7f284] font-bold' : ''}>
              {lbl}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-slate-600">
          <Settings2 className="w-3 h-3" />
        </div>
      </div>

    </div>
  );
};
