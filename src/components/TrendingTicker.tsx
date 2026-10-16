import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendingTickerProps {
  onSelectToken: (token: Token) => void;
  activeSymbol: string;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  onSelectToken,
  activeSymbol
}) => {
  return (
    <div className="w-full border-b border-white/5 bg-[#06080d]/60 backdrop-blur-md overflow-x-auto scrollbar-none py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Ticker Lead Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg shrink-0">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span>TRENDING</span>
        </div>

        {/* Ticker Tokens List */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {POPULAR_TOKENS.map((token) => {
            const isActive = activeSymbol === token.symbol;
            const isPositive = token.change24h >= 0;

            return (
              <button
                key={token.symbol}
                onClick={() => onSelectToken(token)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#00f2fe]/15 border border-[#00f2fe]/40 text-white shadow-sm'
                    : 'bg-slate-900/40 border border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-900/80'
                }`}
              >
                <img 
                  src={token.icon} 
                  alt={token.symbol} 
                  className="w-4 h-4 rounded-full object-cover bg-black" 
                />
                <span className="font-bold text-white">{token.symbol}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(6) : token.priceUsd.toFixed(2)}
                </span>
                <span className={`text-[10px] font-mono flex items-center font-semibold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                  {isPositive ? '+' : ''}{token.change24h}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
