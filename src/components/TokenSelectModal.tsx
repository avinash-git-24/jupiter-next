import { useState } from 'react';
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
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#0c101a] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] threeui-specular-card cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-semibold text-base text-white">Select a Token</span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-900 border border-white/10 focus-within:border-[#00f2fe]/60 focus-within:ring-2 focus-within:ring-[#00f2fe]/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, symbol, or mint address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-medium"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_TOKENS.slice(0, 5).map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  selectedToken.symbol === t.symbol
                    ? 'bg-[#00f2fe]/15 border-[#00f2fe]/40 text-[#00f2fe]'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <img src={t.icon} alt={t.symbol} className="w-3.5 h-3.5 rounded-full" />
                <span>{t.symbol}</span>
              </button>
            ))}
          </div>
        </div>

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
                    ? 'bg-[#00f2fe]/10 border border-[#00f2fe]/30'
                    : 'hover:bg-slate-900/80 border border-transparent'
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
                    
                    {t.mintAddress && (
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {t.mintAddress.slice(0, 4)}...{t.mintAddress.slice(-4)}
                        </span>
                        <button
                          onClick={(e) => handleCopyMint(e, t.mintAddress!, t.symbol)}
                          className="text-slate-500 hover:text-[#00f2fe] transition-colors p-0.5 rounded cursor-pointer"
                          title="Copy Solana Mint Address"
                        >
                          {copiedSymbol === t.symbol ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    )}
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
