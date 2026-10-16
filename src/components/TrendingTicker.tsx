import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingTickerProps {
  onSelectToken: (token: Token) => void;
  activeSymbol: string;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  onSelectToken,
  activeSymbol
}) => {
  return (
    <div className="w-full border-b border-white/10 bg-[#06080d]/80 backdrop-blur-md overflow-x-auto scrollbar-none py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Ticker Lead Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl shrink-0 shadow-sm">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span>TRENDING</span>
        </div>

        {/* Ticker Tokens List with OriginKit Spring Feedback */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-0.5 pr-8">
          {POPULAR_TOKENS.map((token) => {
            const isActive = activeSymbol === token.symbol;
            const isPositive = token.change24h >= 0;

            return (
              <motion.button
                key={token.symbol}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectToken(token)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#00f2fe]/15 border border-[#00f2fe]/50 text-white shadow-md shadow-[#00f2fe]/10'
                    : 'bg-slate-900/60 border border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-900/90'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={token.icon} 
                    alt={token.symbol} 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to text initials if image fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
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
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
