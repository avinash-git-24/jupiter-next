import { useState, useEffect, useRef } from 'react';
import type { ButtonActionState } from '../types';
import { ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface MorphButtonProps {
  amount: number;
  onExecuteSwap: () => void;
  inSymbol: string;
  outSymbol: string;
}

export const MorphButton: React.FC<MorphButtonProps> = ({
  amount,
  onExecuteSwap,
  inSymbol,
  outSymbol
}) => {
  const [state, setState] = useState<ButtonActionState>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state === 'routing' || state === 'success') return;
    if (amount > 0) {
      setState('ready');
    } else {
      setState('idle');
      setHoldProgress(0);
    }
  }, [amount, state]);

  // Handle Hold-to-Confirm Physics with Spring Feedback
  const startHold = () => {
    if (state !== 'ready') return;
    setState('holding');
    setHoldProgress(0);

    const stepMs = 20;
    const totalMs = 550;
    const increment = (stepMs / totalMs) * 100;

    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          triggerExecution();
          return 100;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const cancelHold = () => {
    if (state === 'holding') {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
      setState('ready');
    }
  };

  const triggerExecution = () => {
    setState('routing');
    
    // Simulate real Jito / Solana fast block inclusion
    setTimeout(() => {
      setState('success');
      
      // Confetti burst
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#14F195', '#9945FF']
      });

      // Call parent handler to show receipt
      setTimeout(() => {
        onExecuteSwap();
        setState('ready');
        setHoldProgress(0);
      }, 900);

    }, 1300);
  };

  return (
    <div className="w-full relative select-none">
      <motion.button
        type="button"
        disabled={state === 'idle' || state === 'routing'}
        whileHover={state === 'ready' ? { scale: 1.01 } : {}}
        whileTap={state === 'ready' || state === 'holding' ? { scale: 0.99 } : {}}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onClick={() => {
          // Instant tap support for accessibility
          if (state === 'ready') {
            triggerExecution();
          }
        }}
        className={`w-full relative overflow-hidden rounded-2xl h-14 font-semibold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer ${
          state === 'idle'
            ? 'bg-slate-900/60 border border-white/5 text-slate-500 cursor-not-allowed shadow-none'
            : state === 'ready' || state === 'holding'
            ? 'bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9945FF] text-slate-950 threeui-button-tactile font-bold hover:brightness-110'
            : state === 'routing'
            ? 'bg-slate-900 border border-[#00f2fe]/40 text-[#00f2fe] shadow-lg shadow-[#00f2fe]/20'
            : 'bg-emerald-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30'
        }`}
      >
        {/* ThreeUI Specular Top Light Bevel */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* ThreeUI Ambient Shimmer Sweep Animation */}
        {state === 'ready' && (
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer-pass pointer-events-none" />
        )}

        {/* Hold-to-Confirm Glowing Liquid Energy Reservoir */}
        {state === 'holding' && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/40 to-white/30 transition-all duration-75 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        <AnimatePresence mode="wait">
          {/* State 1: Idle */}
          {state === 'idle' && (
            <motion.span 
              key="idle"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2"
            >
              Enter an Amount to Swap
            </motion.span>
          )}

          {/* State 2: Ready */}
          {state === 'ready' && (
            <motion.span 
              key="ready"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 font-bold tracking-wide text-slate-950"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950/20" />
              <span>Instant Swap {inSymbol} to {outSymbol}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          )}

          {/* State 3: Holding */}
          {state === 'holding' && (
            <motion.span 
              key="holding"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 font-bold tracking-wide text-slate-950 z-10"
            >
              <ShieldCheck className="w-4 h-4 animate-bounce text-slate-950" />
              <span>Hold to Confirm ({Math.round(holdProgress)}%)</span>
            </motion.span>
          )}

          {/* State 4: Routing Execution */}
          {state === 'routing' && (
            <motion.span 
              key="routing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 font-mono text-xs text-[#00f2fe]"
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#00f2fe]" />
              <span>Routing via Jito MEV Bundle... ~280ms</span>
            </motion.span>
          )}

          {/* State 5: Success */}
          {state === 'success' && (
            <motion.span 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-bold text-slate-950"
            >
              <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
              <span>Swap Confirmed on Solana!</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Subtext instruction */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1 font-mono">
        <span>Click for instant swap, or hold to simulate hardware security</span>
        <span>Jito Anti-Frontrun Active</span>
      </div>
    </div>
  );
};
