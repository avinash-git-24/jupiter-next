import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 animate-fadeIn">
      {/* iPhone 16 Pro Mockup Chassis */}
      <div className="relative w-full max-w-[390px] rounded-[52px] bg-[#1a1f2c] p-3 shadow-2xl shadow-[#00f2fe]/10 border-4 border-[#2d3748]">
        
        {/* Outer Titanium Edge Reflection */}
        <div className="absolute inset-0 rounded-[48px] border border-white/20 pointer-events-none" />

        {/* Screen Bezel */}
        <div className="relative w-full rounded-[44px] bg-[#07090e] overflow-hidden border border-black flex flex-col min-h-[780px]">
          
          {/* iOS Status Bar & Dynamic Island */}
          <div className="w-full px-7 pt-3.5 pb-2 flex items-center justify-between text-white text-[12px] font-semibold select-none z-20">
            <span>9:41</span>
            
            {/* Dynamic Island Capsule */}
            <div className="w-24 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-[#00f2fe]/60 animate-pulse" />
              <span className="text-[9px] text-[#00f2fe] font-mono">Jup 3.0</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Screen Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-none pb-8">
            {children}
          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <div className="w-full py-2 flex justify-center bg-[#07090e] z-20">
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
