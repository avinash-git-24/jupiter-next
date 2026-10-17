import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 animate-fadeIn">
      <div className="relative w-full max-w-[390px] rounded-[52px] bg-[#0f141f] p-3 shadow-2xl shadow-[#c7f284]/10 border-4 border-white/10">
        
        <div className="absolute inset-0 rounded-[48px] border border-white/10 pointer-events-none" />

        <div className="relative w-full rounded-[44px] bg-[#080b11] overflow-hidden border border-black flex flex-col min-h-[780px]">
          
          <div className="w-full px-7 pt-3.5 pb-2 flex items-center justify-between text-white text-[12px] font-semibold select-none z-20">
            <span>9:41</span>
            
            <div className="w-24 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-[#c7f284]/80 animate-pulse" />
              <span className="text-[9px] text-[#c7f284] font-mono font-bold">Jup 3.0</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-none pb-8">
            {children}
          </div>

          <div className="w-full py-2 flex justify-center bg-[#080b11] z-20">
            <div className="w-32 h-1 rounded-full bg-white/30" />
          </div>

        </div>

      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        iPhone 16 Pro (390px) Mobile Viewport Simulation
      </p>
    </div>
  );
};
