import React from 'react';
import { 
  Search, 
  Settings2, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenCaseStudy: () => void;
  connectedWallet: string;
  onOpenPortfolio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileView,
  setIsMobileView,
  onOpenCaseStudy,
  connectedWallet,
  onOpenPortfolio
}) => {
  return (
    <header className="w-full border-b border-white/5 bg-[#080b11]/90 backdrop-blur-xl sticky top-0 z-40 select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c7f284] to-[#14F195] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#080b11] rounded-[10px] flex items-center justify-center">
                <span className="text-xs font-black text-[#c7f284]">♃</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>Jupiter</span>
              <span className="text-[#c7f284]">Next</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#c7f284]/15 text-[#c7f284] border border-[#c7f284]/30 rounded-full font-mono">
              v3.0 Fluid
            </span>
          </div>

          <div className="hidden xl:flex items-center relative ml-4">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tokens, pairs, markets..."
                readOnly
                className="w-72 pl-9 pr-10 py-1.5 rounded-xl bg-[#131924] border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#c7f284]/40 cursor-pointer transition-all"
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-400">
                /
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 px-4 py-1.5 rounded-full bg-[#0f141f] border border-white/5 text-xs text-slate-300 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c7f284] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c7f284]"></span>
            </span>
            <span className="text-slate-400 text-[11px]">TPS:</span>
            <span className="font-mono text-[#c7f284] font-bold text-[11px]">2,842</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Finality:</span>
            <span className="font-mono text-slate-200 text-[11px]">380ms</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c7f284]" />
            <span className="text-slate-400 text-[11px]">Jito MEV:</span>
            <span className="font-bold text-[#c7f284] text-[11px]">Shielded</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="lg:hidden flex items-center p-0.5 rounded-xl bg-[#131924] border border-white/10">
            <button
              onClick={() => setIsMobileView(false)}
              className={`p-1.5 rounded-lg transition-colors ${!isMobileView ? 'text-[#c7f284] bg-white/10' : 'text-slate-400'}`}
              title="Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMobileView(true)}
              className={`p-1.5 rounded-lg transition-colors ${isMobileView ? 'text-[#c7f284] bg-white/10' : 'text-slate-400'}`}
              title="Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCaseStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131924] hover:bg-[#1a2233] border border-[#c7f284]/40 hover:border-[#c7f284]/80 text-xs font-semibold text-white transition-all shadow-md shadow-[#c7f284]/10 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c7f284]" />
            <span className="hidden sm:inline">UX Case Study Deck</span>
            <span className="sm:hidden">Case Study</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#c7f284]/20 text-[#c7f284] text-[9px] font-extrabold rounded">
              Before/After
            </span>
          </motion.button>

          <div 
            onClick={onOpenPortfolio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f141f] border border-white/10 hover:border-[#c7f284]/50 transition-all cursor-pointer group"
            title="View Solana Portfolio"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] shrink-0" />
            <span className="font-mono text-xs text-slate-200 group-hover:text-[#c7f284] font-semibold transition-colors">
              <span className="inline sm:hidden">...{connectedWallet.slice(-4)}</span>
              <span className="hidden sm:inline">{connectedWallet}</span>
            </span>
          </div>

          <button 
            className="p-2 rounded-xl bg-[#0f141f] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Terminal Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
