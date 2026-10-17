import React, { useState, useEffect } from 'react';
import type { Token } from '../types';
import { POPULAR_TOKENS } from '../data/tokens';
import { Search, X, CheckCircle2, TrendingUp, TrendingDown, Copy, Check } from 'lucide-react';

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
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyMint = (e: React.MouseEvent, mint: string, symbol: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mint);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  const filteredTokens = POPULAR_TOKENS.filter((t) =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.mintAddress && t.mintAddress.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer select-none">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <span className="font-bold text-base text-white">Select a Token</span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#131924] border border-white/10 focus-within:border-[#c7f284]/50 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, symbol, or mint address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-medium"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-slate-500 hover:text-white transition-colors p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_TOKENS.slice(0, 5).map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedToken.symbol === t.symbol
                    ? 'bg-[#c7f284]/20 border-[#c7f284]/50 text-[#c7f284]'
                    : 'bg-[#131924] border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <img src={t.icon} alt={t.symbol} className="w-3.5 h-3.5 rounded-full" />
                <span>{t.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTokens.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium text-slate-400">No tokens found for "{search}"</p>
              <p className="text-xs text-slate-600 mt-1">Try searching by mint address, name, or symbol</p>
            </div>
          ) : (
            filteredTokens.map((t) => {
              const isSelected = selectedToken.symbol === t.symbol;
              const holdingUsd = t.balance * t.priceUsd;
              return (
                <div
                  key={t.symbol}
                  onClick={() => {
                    onSelect(t);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#c7f284]/15 border border-[#c7f284]/30'
                      : 'hover:bg-[#131924] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={t.icon} alt={t.symbol} className="w-9 h-9 rounded-full bg-black object-cover" />
                      {t.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c7f284] bg-[#0f141f] rounded-full absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{t.symbol}</span>
                        <span className="text-xs text-slate-400">{t.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-0.5">
                        {t.mintAddress && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {t.mintAddress.slice(0, 4)}...{t.mintAddress.slice(-4)}
                            </span>
                            <button
                              onClick={(e) => handleCopyMint(e, t.mintAddress!, t.symbol)}
                              className="text-slate-500 hover:text-[#c7f284] transition-colors p-0.5 rounded cursor-pointer"
                              title="Copy Solana Mint Address"
                            >
                              {copiedSymbol === t.symbol ? (
                                <Check className="w-2.5 h-2.5 text-[#c7f284]" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          ${t.priceUsd < 0.001 ? t.priceUsd.toFixed(6) : t.priceUsd.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm text-white font-medium">
                      {t.symbol === 'BONK'
                        ? t.balance.toLocaleString()
                        : t.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono">
                      <span className="text-slate-400">
                        ${holdingUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`flex items-center gap-0.5 ${
                        t.change24h >= 0 ? 'text-[#c7f284]' : 'text-rose-400'
                      }`}>
                        {t.change24h >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                        <span>{t.change24h >= 0 ? '+' : ''}{t.change24h}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
