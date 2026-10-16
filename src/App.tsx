import { useState, useEffect } from 'react';
import type { Token, TransactionReceipt } from './types';
import { POPULAR_TOKENS } from './data/tokens';
import { Header } from './components/Header';
import { TrendingTicker } from './components/TrendingTicker';
import { TradingChart } from './components/TradingChart';
import { OrderBook } from './components/OrderBook';
import { RecentSwapsFeed } from './components/RecentSwapsFeed';
import { SwapWidget } from './components/SwapWidget';
import { TokenSelectModal } from './components/TokenSelectModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { MobileFrame } from './components/MobileFrame';
import { 
  BookOpen, 
  ExternalLink
} from 'lucide-react';

export function App() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenModalTarget, setTokenModalTarget] = useState<'in' | 'out'>('in');
  const [inToken, setInToken] = useState<Token>(POPULAR_TOKENS[0]);
  const [outToken, setOutToken] = useState<Token>(POPULAR_TOKENS[1]);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [matchedPrice, setMatchedPrice] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTokenModalOpen(false);
        setReceipt(null);
        setIsCaseStudyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSwapTokens = () => {
    const temp = inToken;
    setInToken(outToken);
    setOutToken(temp);
  };

  const handleOpenInToken = () => {
    setTokenModalTarget('in');
    setIsTokenModalOpen(true);
  };

  const handleOpenOutToken = () => {
    setTokenModalTarget('out');
    setIsTokenModalOpen(true);
  };

  const handleSelectToken = (selected: Token) => {
    if (tokenModalTarget === 'in') {
      if (selected.symbol === outToken.symbol) {
        setOutToken(inToken);
      }
      setInToken(selected);
    } else {
      if (selected.symbol === inToken.symbol) {
        setInToken(outToken);
      }
      setOutToken(selected);
    }
  };

  const handleSelectTrendingToken = (token: Token) => {
    if (token.symbol === outToken.symbol) {
      setOutToken(inToken);
      setInToken(token);
    } else {
      setInToken(token);
    }
  };

  const handleSelectPair = (inSymbol: string, outSymbol: string) => {
    const foundIn = POPULAR_TOKENS.find(t => t.symbol === inSymbol);
    const foundOut = POPULAR_TOKENS.find(t => t.symbol === outSymbol);
    if (foundIn) setInToken(foundIn);
    if (foundOut) setOutToken(foundOut);
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="fixed top-0 left-1/4 w-[650px] h-[500px] bg-[#00f2fe]/6 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[600px] h-[600px] bg-[#9945FF]/7 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[650px] h-[400px] bg-[#14F195]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <Header
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
        connectedWallet="avinash...7x89"
      />

      <TrendingTicker
        onSelectToken={handleSelectTrendingToken}
        activeSymbol={inToken.symbol}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center relative z-10">
        
        {isMobileView ? (
          <MobileFrame>
            <div className="space-y-4">
              <div className="text-center py-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/25 text-[10px] font-bold text-[#00f2fe] font-mono">
                  Jupiter Next Mobile
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Instant Swap</h2>
              </div>

              <SwapWidget
                inToken={inToken}
                outToken={outToken}
                onOpenInTokenModal={handleOpenInToken}
                onOpenOutTokenModal={handleOpenOutToken}
                onSwapTokens={handleSwapTokens}
                onExecuteReceipt={(rec) => setReceipt(rec)}
                matchedPrice={matchedPrice}
              />
            </div>
          </MobileFrame>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-bold font-mono text-[#00f2fe] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    MAINNET BETA 3.0
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    High-Velocity Liquidity Engine
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  <span>Jupiter <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9945FF]">Next</span></span>
                  <span className="text-xs font-mono font-medium text-slate-300 px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10">
                    Fluid DEX Terminal
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Next-generation Solana aggregator. Split-hop graph liquidity, tactile hold-to-confirm execution, and Jito MEV protection.
                </p>
              </div>

              <button
                onClick={() => setIsCaseStudyOpen(true)}
                className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00f2fe]/15 via-purple-500/15 to-[#14F195]/15 hover:from-[#00f2fe]/25 hover:to-[#9945FF]/25 border border-[#00f2fe]/40 text-xs font-bold text-white transition-all shadow-lg shadow-[#00f2fe]/10 cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
                <span>UX Case Study Deck</span>
                <span className="px-1.5 py-0.5 bg-[#00f2fe]/20 text-[#00f2fe] text-[9px] font-bold rounded">
                  Before vs After
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 space-y-6">
                
                <TradingChart inToken={inToken} outToken={outToken} />

                <OrderBook 
                  inToken={inToken} 
                  outToken={outToken} 
                  onSelectPrice={(p) => setMatchedPrice(p)}
                />

                <RecentSwapsFeed
                  activeToken={inToken}
                  onSelectPair={handleSelectPair}
                />
              </div>

              <div className="lg:col-span-5 sticky top-20">
                <SwapWidget
                  inToken={inToken}
                  outToken={outToken}
                  onOpenInTokenModal={handleOpenInToken}
                  onOpenOutTokenModal={handleOpenOutToken}
                  onSwapTokens={handleSwapTokens}
                  onExecuteReceipt={(rec) => setReceipt(rec)}
                  matchedPrice={matchedPrice}
                />
              </div>

            </div>

          </div>
        )}

      </main>

      <footer className="w-full border-t border-white/5 py-6 px-4 bg-[#05070b]/90 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Designed and Engineered by <strong>Avinash Kumar (@avinash-git-24)</strong></span>
            <span>•</span>
            <span className="text-[#00f2fe]">Solana Superteam Redesign Submission</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCaseStudyOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Inspect Case Study</span>
            </button>
            <a
              href="https://superteam.fun/earn/listing/redesign-your-favourite-app-on-solana"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Superteam Listing</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      <TokenSelectModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={handleSelectToken}
        selectedToken={tokenModalTarget === 'in' ? inToken : outToken}
      />

      <ReceiptModal
        receipt={receipt}
        onClose={() => setReceipt(null)}
      />

      <CaseStudyModal
        isOpen={isCaseStudyOpen}
        onClose={() => setIsCaseStudyOpen(false)}
      />

    </div>
  );
}

export default App;
