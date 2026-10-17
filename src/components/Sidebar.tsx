import React from 'react';
import { 
  ArrowLeftRight, 
  Clock, 
  Repeat, 
  TrendingUp, 
  Wallet, 
  BookOpen, 
  Smartphone, 
  Monitor, 
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'swap' | 'limit' | 'dca' | 'perps' | 'portfolio';
  onSelectTab: (tab: 'swap' | 'limit' | 'dca' | 'perps' | 'portfolio') => void;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenCaseStudy: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileView,
  setIsMobileView,
  onOpenCaseStudy
}) => {
  const navItems = [
    { id: 'swap' as const, label: 'Trade', icon: ArrowLeftRight },
    { id: 'limit' as const, label: 'Limit', icon: Clock },
    { id: 'dca' as const, label: 'DCA', icon: Repeat },
    { id: 'perps' as const, label: 'Perps', icon: TrendingUp, badge: '100x' },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Wallet }
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-16 py-4 bg-[#080b11] border-r border-white/5 shrink-0 z-30 select-none">
      <div className="flex flex-col items-center gap-6 w-full">
        <button 
          onClick={() => onSelectTab('swap')}
          className="relative group p-2 rounded-2xl bg-[#0f141f] border border-white/10 hover:border-[#c7f284]/50 transition-all cursor-pointer shadow-lg shadow-black/50"
          title="Jupiter Next Terminal"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c7f284] via-[#14F195] to-[#a3e635] p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#080b11] rounded-[10px] flex items-center justify-center">
              <span className="text-xs font-black text-[#c7f284] tracking-tighter">♃</span>
            </div>
          </div>
          <div className="absolute -inset-1 bg-[#c7f284] rounded-2xl blur-md opacity-20 group-hover:opacity-60 transition duration-300 -z-10" />
        </button>

        <nav className="flex flex-col items-center gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#131924] text-[#c7f284] shadow-md shadow-[#c7f284]/15 border border-[#c7f284]/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#c7f284]' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="text-[9px] font-semibold tracking-tight mt-0.5 scale-90">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[7px] font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#c7f284] rounded-r-full shadow-[0_0_8px_#c7f284]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={onOpenCaseStudy}
          className="relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-400 hover:text-[#c7f284] hover:bg-[#c7f284]/10 border border-transparent hover:border-[#c7f284]/30 transition-all cursor-pointer"
          title="UX Case Study Deck"
        >
          <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="text-[9px] font-semibold tracking-tight mt-0.5 scale-90">Audit</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c7f284] shadow-[0_0_6px_#c7f284]" />
        </button>

        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer border ${
            isMobileView 
              ? 'bg-[#131924] text-[#c7f284] border-[#c7f284]/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
          }`}
          title={isMobileView ? 'Switch to Desktop Mode' : 'Switch to Mobile Frame'}
        >
          {isMobileView ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          <span className="text-[9px] font-semibold tracking-tight mt-0.5 scale-90">{isMobileView ? 'Desk' : 'Mob'}</span>
        </button>

        <div className="w-8 h-px bg-white/10 my-1" />

        <div className="flex flex-col items-center gap-1.5 text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" title="Solana RPC Connected" />
          <span title="Jito MEV Shield">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c7f284]" />
          </span>
        </div>
      </div>
    </aside>
  );
};
