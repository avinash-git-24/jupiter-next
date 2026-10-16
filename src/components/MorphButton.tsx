import { useState, useEffect, useRef } from 'react';
import type { ButtonActionState } from '../types';
import { ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  // Handle Hold-to-Confirm Physics
  const startHold = () => {
    if (state !== 'ready') return;
    setState('holding');
    setHoldProgress(0);

    const stepMs = 20;
    const totalMs = 600;
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#14F195', '#9945FF']
      });

      // Call parent handler to show receipt
      setTimeout(() => {
        onExecuteSwap();
        setState('ready');
        setHoldProgress(0);
      }, 900);

    }, 1400);
  };

  return (
    <div className="w-full relative select-none">
      <button
        type="button"
        disabled={state === 'idle' || state === 'routing'}
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
            ? 'bg-slate-900/60 border border-white/5 text-slate-500 cursor-not-allowed'
            : state === 'ready' || state === 'holding'
            ? 'bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9945FF] text-slate-950 shadow-xl shadow-[#00f2fe]/20 hover:shadow-[#00f2fe]/35 hover:brightness-110 active:scale-[0.99]'
            : state === 'routing'
            ? 'bg-slate-900 border border-[#00f2fe]/40 text-[#00f2fe] shadow-lg shadow-[#00f2fe]/10'
            : 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/25 font-bold'
        }`}
      >
        {/* Radial / Linear Hold Progress Overlay */}
        {state === 'holding' && (
          <div 
            className="absolute inset-0 bg-white/25 transition-all"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        {/* State 1: Idle */}
        {state === 'idle' && (
          <span className="flex items-center gap-2">
            Enter an Amount
          </span>
        )}

        {/* State 2: Ready */}
        {state === 'ready' && (
          <span className="flex items-center gap-2 font-bold tracking-wide">
            <span>Instant Swap {inSymbol} to {outSymbol}</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        )}

        {/* State 3: Holding */}
        {state === 'holding' && (
          <span className="flex items-center gap-2 font-bold tracking-wide text-slate-950 z-10">
            <span>Hold to Confirm ({Math.round(holdProgress)}%)</span>
            <ShieldCheck className="w-4 h-4 animate-bounce" />
          </span>
        )}

        {/* State 4: Routing Execution */}
        {state === 'routing' && (
          <span className="flex items-center gap-2.5 font-mono text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#00f2fe]" />
            <span>Routing via Jito MEV Bundle... ~280ms</span>
          </span>
        )}

        {/* State 5: Success */}
        {state === 'success' && (
          <span className="flex items-center gap-2 font-bold">
            <Check className="w-5 h-5 text-slate-950 stroke-[3]" />
            <span>Swap Confirmed on Solana!</span>
          </span>
        )}
      </button>

      {/* Helpful Hint */}
      {state === 'ready' && (
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Click for instant execution or hold to prevent fat-finger slippage
        </p>
      )}
    </div>
  );
};
