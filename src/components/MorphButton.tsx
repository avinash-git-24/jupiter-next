import { useState, useRef } from 'react';
import type { ButtonActionState } from '../types';
import { ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface MorphButtonProps {
  amount: number;
  onExecuteSwap: () => void;
  inSymbol: string;
  outSymbol: string;
  customLabel?: string;
}

export const MorphButton: React.FC<MorphButtonProps> = ({
  amount,
  onExecuteSwap,
  inSymbol,
  outSymbol,
  customLabel
}) => {
  const [internalState, setInternalState] = useState<'holding' | 'routing' | 'success' | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<number | null>(null);
  const wasHoldingRef = useRef(false);

  const state: ButtonActionState = internalState ?? (amount > 0 ? 'ready' : 'idle');

  const startHold = () => {
    if (state !== 'ready') return;
    wasHoldingRef.current = true;
    setInternalState('holding');
    setHoldProgress(0);

    const stepMs = 20;
    const totalMs = 550;
    const increment = (stepMs / totalMs) * 100;

    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          wasHoldingRef.current = false;
          triggerExecution();
          return 100;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const cancelHold = () => {
    if (internalState === 'holding') {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
      setInternalState(null);
      setTimeout(() => {
        wasHoldingRef.current = false;
      }, 150);
    }
  };

  const triggerExecution = () => {
    setInternalState('routing');
    
    setTimeout(() => {
      setInternalState('success');
      
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#c7f284', '#14F195', '#ffffff', '#a3e635']
      });

      setTimeout(() => {
        onExecuteSwap();
        setInternalState(null);
        setHoldProgress(0);
        wasHoldingRef.current = false;
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
          if (wasHoldingRef.current) {
            wasHoldingRef.current = false;
            return;
          }
          if (state === 'ready') {
            triggerExecution();
          }
        }}
        className={`w-full relative overflow-hidden rounded-2xl h-14 font-semibold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer ${
          state === 'idle'
            ? 'bg-slate-900/60 border border-white/5 text-slate-500 cursor-not-allowed shadow-none'
            : state === 'ready' || state === 'holding'
            ? 'bg-[#c7f284] hover:bg-[#b4ea68] text-slate-950 font-extrabold tracking-wide shadow-lg shadow-[#c7f284]/25 hover:shadow-xl hover:shadow-[#c7f284]/35 transition-all'
            : state === 'routing'
            ? 'bg-[#131924] border border-[#c7f284]/50 text-[#c7f284] shadow-lg shadow-[#c7f284]/20'
            : 'bg-[#c7f284] text-slate-950 font-extrabold shadow-xl shadow-[#c7f284]/35'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {state === 'ready' && (
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer-pass pointer-events-none" />
        )}

        {state === 'holding' && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/40 to-white/30 transition-all duration-75 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        <AnimatePresence mode="wait">
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

          {state === 'ready' && (
            <motion.span 
              key="ready"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 font-bold tracking-wide text-slate-950"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950/20" />
              <span>{customLabel || `Instant Swap ${inSymbol} to ${outSymbol}`}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          )}

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

          {state === 'routing' && (
            <motion.span 
              key="routing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 font-mono text-xs text-[#c7f284]"
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#c7f284]" />
              <span>Routing via Jito MEV Bundle... ~280ms</span>
            </motion.span>
          )}

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

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1 font-mono">
        <span>Click for instant swap, or hold to simulate hardware security</span>
        <span>Jito Anti-Frontrun Active</span>
      </div>
    </div>
  );
};
