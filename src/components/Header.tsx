import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  BookOpen, 
  Zap, 
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenCaseStudy: () => void;
  connectedWallet: string;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileView,
  setIsMobileView,
  onOpenCaseStudy,
  connectedWallet
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-[#080b11]/85 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#9945FF] p-[1.5px] shadow-lg shadow-[#00f2fe]/20">
              <div className="w-full h-full bg-[#0b0e17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00f2fe] animate-pulse" />
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#9945FF] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Jupiter <span className="text-[#00f2fe]">Next</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 rounded-full font-mono">
                v3.0 Fluid
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Superteam India Redesign Submission
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Solana TPS:</span>
            <span className="font-mono text-emerald-400 font-medium">2,842</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Finality:</span>
            <span className="font-mono text-slate-200">380ms</span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="text-slate-400">Jito MEV Shield:</span>
            <span className="font-medium text-[#00f2fe]">Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          
          <div className="relative flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10">
            <button
              onClick={() => setIsMobileView(false)}
              className={`relative z-10 p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isMobileView ? 'text-[#00f2fe]' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (1440px)"
            >
              {!isMobileView && (
                <motion.div
                  layoutId="viewportModePill"
                  className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileView(true)}
              className={`relative z-10 p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMobileView ? 'text-[#00f2fe]' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390px iPhone Frame)"
            >
              {isMobileView && (
                <motion.div
                  layoutId="viewportModePill"
                  className="absolute inset-0 rounded-lg bg-[#00f2fe]/20 border border-[#00f2fe]/40 shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCaseStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/15 via-[#00f2fe]/15 to-emerald-500/15 hover:from-purple-500/25 hover:to-emerald-500/25 border border-[#00f2fe]/40 hover:border-[#00f2fe]/70 text-xs font-medium text-white transition-all shadow-lg shadow-[#00f2fe]/10 group cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00f2fe] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">UX Case Study</span>
            <span className="sm:hidden">Case Study</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#00f2fe]/20 text-[#00f2fe] text-[9px] font-bold rounded">
              Before/After
            </span>
          </motion.button>

          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/25 transition-all cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 shrink-0"></div>
            <span className="font-mono text-xs text-slate-200">
              <span className="inline sm:hidden">...{connectedWallet.slice(-4)}</span>
              <span className="hidden sm:inline">{connectedWallet}</span>
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
