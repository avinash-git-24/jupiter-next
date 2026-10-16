import { useState } from 'react';
import type { Token, TransactionReceipt } from './types';
import { POPULAR_TOKENS } from './data/tokens';
import { Header } from './components/Header';
import { TrendingTicker } from './components/TrendingTicker';
import { TradingChart } from './components/TradingChart';
import { SwapWidget } from './components/SwapWidget';
import { TokenSelectModal } from './components/TokenSelectModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { MobileFrame } from './components/MobileFrame';
import { 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  ExternalLink
} from 'lucide-react';

export function App() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenModalTarget, setTokenModalTarget] = useState<'in' | 'out'>('in');
  const [inToken, setInToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [outToken, setOutToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

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

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      
      {/* Background Animated Futuristic Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[550px] bg-[#00f2fe]/8 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[650px] h-[650px] bg-[#9945FF]/9 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[450px] bg-[#14F195]/7 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Persistent Navigation Header */}
      <Header
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
        connectedWallet="avinash...7x89"
      />

      {/* Live Trending Tokens Ticker */}
      <TrendingTicker
        onSelectToken={handleSelectTrendingToken}
        activeSymbol={inToken.symbol}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center relative z-10">
        
        {/* VIEWPORT MODE: MOBILE PHONE MOCKUP */}
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
              />
            </div>
          </MobileFrame>
        ) : (
          /* VIEWPORT MODE: EXPANSIVE DUAL-COLUMN PRO TERMINAL */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00f2fe]/15 via-purple-500/15 to-[#14F195]/15 border border-[#00f2fe]/30 text-xs font-semibold text-white shadow-lg shadow-[#00f2fe]/10 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
                  <span>Superteam India Redesign Bounty</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[#00f2fe] font-mono">1,500 USDC Pool</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Jupiter <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9945FF]">Next</span>
                  <span className="text-xs ml-3 font-mono text-[#00f2fe] px-2.5 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 align-middle">
                    Pro Terminal
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  Next-generation Solana aggregator. Kinetic split-routing, tactile hold-to-confirm execution, and Jito MEV protection.
                </p>
              </div>

              <button
                onClick={() => setIsCaseStudyOpen(true)}
                className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00f2fe]/15 to-[#9945FF]/15 hover:from-[#00f2fe]/25 hover:to-[#9945FF]/25 border border-[#00f2fe]/40 text-xs font-bold text-white transition-all shadow-lg shadow-[#00f2fe]/10 cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
                <span>Read Full UX Case Study</span>
                <span className="px-1.5 py-0.5 bg-[#00f2fe]/20 text-[#00f2fe] text-[9px] font-bold rounded">
                  Before/After
                </span>
              </button>
            </div>

            {/* Expansive Two-Column Trading Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Irfan Trading Chart & Market Analytics (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <TradingChart inToken={inToken} outToken={outToken} />

                {/* 3 Value Pillars for Judges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => setIsCaseStudyOpen(true)}
                    className="p-3.5 rounded-2xl glass-card cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Zap className="w-3.5 h-3.5 text-[#00f2fe] group-hover:scale-110 transition-transform" />
                      <span>Kinetic Routing</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Visualizes real-time split liquidity (Orca + Raydium) and shows savings vs direct pool.
                    </p>
                  </div>

                  <div 
                    onClick={() => setIsCaseStudyOpen(true)}
                    className="p-3.5 rounded-2xl glass-card cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>Jup Morph Button</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Fuse-inspired hold-to-confirm prevents fat-finger slippage and celebrates on-chain finality.
                    </p>
                  </div>

                  <div 
                    onClick={() => setIsCaseStudyOpen(true)}
                    className="p-3.5 rounded-2xl glass-card cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>MEV Shield HUD</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Real-time honeypot check, mint authority audit, and 1-click Jito bundle accelerator.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Fluid Swap Widget & Execution (5 cols) */}
              <div className="lg:col-span-5">
                <SwapWidget
                  inToken={inToken}
                  outToken={outToken}
                  onOpenInTokenModal={handleOpenInToken}
                  onOpenOutTokenModal={handleOpenOutToken}
                  onSwapTokens={handleSwapTokens}
                  onExecuteReceipt={(rec) => setReceipt(rec)}
                />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer & Source Credentials */}
      <footer className="w-full border-t border-white/5 py-6 px-4 bg-[#05070b]/90 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Built by <strong>Avinash Kumar (@avinash-git-24)</strong></span>
            <span>•</span>
            <span className="text-[#00f2fe]">Superteam India Redesign Bounty</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCaseStudyOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>View UX Case Study</span>
            </button>
            <a
              href="https://superteam.fun/earn/listing/redesign-your-favourite-app-on-solana"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Superteam Challenge</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
