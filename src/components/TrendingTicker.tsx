import { useRef } from 'react';
import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';
import { Flame, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingTickerProps {
  onSelectToken: (token: Token) => void;
  activeSymbol: string;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  onSelectToken,
  activeSymbol
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full border-b border-white/10 bg-[#06080d]/85 backdrop-blur-md py-1.5 px-4 sm:px-6 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg shrink-0 shadow-sm">
          <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>TRENDING</span>
        </div>

        <div className="relative flex-1 flex items-center overflow-hidden">
          
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full"
          >
            {POPULAR_TOKENS.map((token) => {
              const isActive = activeSymbol === token.symbol;
              const isPositive = token.change24h >= 0;

              return (
                <motion.button
                  key={token.symbol}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectToken(token)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#c7f284]/15 border border-[#c7f284]/50 text-white shadow-md shadow-[#c7f284]/20'
                      : 'bg-slate-900/70 border border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-900'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                    <img 
                      src={token.icon} 
                      alt={token.symbol} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="font-bold text-white text-[11px]">{token.symbol}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(5) : token.priceUsd.toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-mono flex items-center font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                    {isPositive ? '+' : ''}{token.change24h.toFixed(1)}%
                  </span>
                </motion.button>
              );
            })}
          </div>

        </div>

        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
