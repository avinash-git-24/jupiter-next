import { useState } from 'react';
import type { Token, TransactionReceipt } from './types';
import { POPULAR_TOKENS } from './data/tokens';
import { Header } from './components/Header';
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

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      
      {/* Ambient Gradient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#00f2fe]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[600px] bg-[#9945FF]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-[#14F195]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Persistent Navigation Header */}
      <Header
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
        connectedWallet="avinash...7x89"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center">
        
        {/* Hero Title & Motivation Banner */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00f2fe]/15 via-purple-500/15 to-[#14F195]/15 border border-[#00f2fe]/30 text-xs font-semibold text-white shadow-lg shadow-[#00f2fe]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>Superteam India Redesign Bounty</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#00f2fe] font-mono">1,500 USDC Pool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Jupiter <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9945FF]">Next</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Zero-anxiety trading on Solana. Kinetic split-routing, tactile hold-to-confirm execution, and embedded Jito MEV protection.
          </p>
        </div>

        {/* Viewport Render (Desktop Mode vs iPhone 16 Pro Frame) */}
        {isMobileView ? (
          <MobileFrame>
            <SwapWidget
              inToken={inToken}
              outToken={outToken}
              onOpenInTokenModal={handleOpenInToken}
              onOpenOutTokenModal={handleOpenOutToken}
              onSwapTokens={handleSwapTokens}
              onExecuteReceipt={(rec) => setReceipt(rec)}
            />
          </MobileFrame>
        ) : (
          <div className="w-full flex justify-center animate-fadeIn">
            <SwapWidget
              inToken={inToken}
              outToken={outToken}
              onOpenInTokenModal={handleOpenInToken}
              onOpenOutTokenModal={handleOpenOutToken}
              onSwapTokens={handleSwapTokens}
              onExecuteReceipt={(rec) => setReceipt(rec)}
            />
          </div>
        )}

        {/* Key Features Callout Pills for Judges */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl w-full">
          <div 
            onClick={() => setIsCaseStudyOpen(true)}
            className="p-4 rounded-2xl glass-panel hover:border-[#00f2fe]/40 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
              <span>Kinetic Split Routing</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualizes real-time liquidity splits (Orca + Raydium) and highlights savings vs direct pool.
            </p>
          </div>

          <div 
            onClick={() => setIsCaseStudyOpen(true)}
            className="p-4 rounded-2xl glass-panel hover:border-purple-500/40 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Fuse Multi-Action Button</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hold-to-confirm physical feedback prevents accidental slippage and celebrate on-chain finality.
            </p>
          </div>

          <div 
            onClick={() => setIsCaseStudyOpen(true)}
            className="p-4 rounded-2xl glass-panel hover:border-emerald-500/40 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Telemetry & Safety Radar</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time audit badges, honeypot safety checks, and 1-click Jito bundle MEV shield.
            </p>
          </div>
        </div>

      </main>

      {/* Footer & Source Credentials */}
      <footer className="w-full border-t border-white/5 py-6 px-4 bg-slate-950/80 backdrop-blur-md">
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
