import { useState, useEffect } from 'react';
import type { Token, TransactionReceipt } from './types';
import { POPULAR_TOKENS } from './data/tokens';
import { Sidebar } from './components/Sidebar';
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
  const [activeTab, setActiveTab] = useState<'swap' | 'limit' | 'dca' | 'perps' | 'portfolio'>('swap');
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
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex relative overflow-x-hidden selection:bg-[#c7f284]/30 selection:text-[#c7f284]">
      
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[650px] h-[500px] bg-[#c7f284]/4 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#14F195]/4 rounded-full blur-[180px] pointer-events-none -z-10" />

      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
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

        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center relative z-10">
          
          {isMobileView ? (
            <MobileFrame>
              <div className="space-y-4">
                <div className="text-center py-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c7f284]/15 border border-[#c7f284]/30 text-[10px] font-bold text-[#c7f284] font-mono">
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
            <div className="space-y-5 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#c7f284]/15 border border-[#c7f284]/30 text-[10px] font-bold font-mono text-[#c7f284] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c7f284] animate-ping" />
                      MAINNET BETA 3.0
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      High-Velocity Liquidity Engine
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <span>Jupiter <span className="text-[#c7f284]">Next</span></span>
                    <span className="text-xs font-mono font-bold text-slate-300 px-2.5 py-1 rounded-xl bg-[#131924] border border-white/10">
                      Fluid DEX Terminal
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Next-generation Solana aggregator: Split-hop graph liquidity, tactile hold-to-confirm execution, and Jito MEV protection.
                  </p>
                </div>

                <button
                  onClick={() => setIsCaseStudyOpen(true)}
                  className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131924] hover:bg-[#1a2233] border border-[#c7f284]/40 text-xs font-bold text-white transition-all shadow-md shadow-[#c7f284]/10 cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4 text-[#c7f284] group-hover:scale-110 transition-transform" />
                  <span>UX Case Study Deck</span>
                  <span className="px-1.5 py-0.5 bg-[#c7f284]/20 text-[#c7f284] text-[9px] font-extrabold rounded">
                    Before vs After
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                <div className="lg:col-span-7 space-y-5">
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

        <footer className="w-full border-t border-white/5 py-5 px-4 bg-[#080b11]/90 backdrop-blur-md relative z-10">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>Designed and Engineered by <strong>Avinash Kumar (@avinash-git-24)</strong></span>
              <span>•</span>
              <span className="text-[#c7f284] font-semibold">Solana Superteam Redesign Submission</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCaseStudyOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#c7f284]" />
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
      </div>

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
