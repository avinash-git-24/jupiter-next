import { useState } from 'react';
import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';
import { Search, X, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken: Token;
}

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTokens = POPULAR_TOKENS.filter((t) =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#0c101a] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <span className="font-semibold text-base text-white">Select a Token</span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-900 border border-white/10 focus-within:border-[#00f2fe]/40 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by token name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-medium"
              autoFocus
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_TOKENS.slice(0, 5).map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  selectedToken.symbol === t.symbol
                    ? 'bg-[#00f2fe]/15 border-[#00f2fe]/30 text-[#00f2fe]'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <img src={t.icon} alt={t.symbol} className="w-3.5 h-3.5 rounded-full" />
                <span>{t.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTokens.map((t) => {
            const isSelected = selectedToken.symbol === t.symbol;
            return (
              <div
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#00f2fe]/10 border border-[#00f2fe]/20'
                    : 'hover:bg-slate-900/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={t.icon} alt={t.symbol} className="w-9 h-9 rounded-full bg-black object-cover" />
                    {t.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2fe] bg-[#0c101a] rounded-full absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{t.symbol}</span>
                      <span className="text-xs text-slate-400">{t.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ${t.priceUsd < 0.01 ? t.priceUsd.toFixed(7) : t.priceUsd.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm text-white font-medium">
                    {t.balance > 1000 ? t.balance.toLocaleString() : t.balance.toFixed(2)}
                  </div>
                  <div className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${
                    t.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {t.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{t.change24h >= 0 ? '+' : ''}{t.change24h}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
