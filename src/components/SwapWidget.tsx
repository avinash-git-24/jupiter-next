import { useState } from 'react';
import type { Token, SwapMode, PriorityFeeLevel, SlippagePreset, RouteSplit, TransactionReceipt } from '../types';
import { RouteVisualizer } from './RouteVisualizer';
import { DiagnosticsHUD } from './DiagnosticsHUD';
import { MorphButton } from './MorphButton';
import { DCAWidget } from './DCAWidget';
import { LimitWidget } from './LimitWidget';
import { ArrowDownUp, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwapWidgetProps {
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
  inToken: Token;
  outToken: Token;
  onSwapTokens: () => void;
  onExecuteReceipt: (receipt: TransactionReceipt) => void;
  matchedPrice?: number | null;
}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  onOpenInTokenModal,
  onOpenOutTokenModal,
  inToken,
  outToken,
  onSwapTokens,
  onExecuteReceipt,
  matchedPrice
}) => {
  const [mode, setMode] = useState<SwapMode>('swap');
  const [inAmount, setInAmount] = useState('1.5');
  const [priorityFee, setPriorityFee] = useState<PriorityFeeLevel>('turbo');
  const [slippage, setSlippage] = useState<SlippagePreset>('auto');
  const [isRotating, setIsRotating] = useState(false);
  const [prevMatchedPrice, setPrevMatchedPrice] = useState(matchedPrice);

  if (prevMatchedPrice !== matchedPrice && matchedPrice) {
    setPrevMatchedPrice(matchedPrice);
    setMode('limit');
  }

  const amountNum = parseFloat(inAmount) || 0;
  const rate = inToken.priceUsd / outToken.priceUsd;
  const outAmount = amountNum * rate;
  const savedUsd = amountNum > 0 ? (amountNum * inToken.priceUsd * 0.012) + 1.25 : 0;

  const splits: RouteSplit[] = [
    {
      dexName: 'Orca Whirlpool',
      percentage: 65,
      poolType: 'Concentrated',
      inToken: inToken.symbol,
      outToken: outToken.symbol,
      latencyMs: 140
    },
    {
      dexName: 'Raydium CPMM',
      percentage: 35,
      poolType: 'Standard AMM',
      inToken: inToken.symbol,
      outToken: outToken.symbol,
      latencyMs: 190
    }
  ];

  const handleFlip = () => {
    setIsRotating(true);
    onSwapTokens();
    setTimeout(() => setIsRotating(false), 350);
  };

  const handleQuickPercent = (pct: number) => {
    const val = (inToken.balance * pct).toFixed(3);
    setInAmount(val);
  };

  const handleExecute = () => {
    const receipt: TransactionReceipt = {
      txSignature: '4ZkF9x8Nm2Pq7wLtV5bY1sX9dJ0vKw3mRt8pLa9cQm2bZ1xQ4v7wLa0m9pQr8sT',
      inAmount: amountNum,
      inToken,
      outAmount,
      outToken,
      savedUsd,
      routeSplits: splits,
      feePaidSol: priorityFee === 'ultra' ? 0.00001 : priorityFee === 'turbo' ? 0.000005 : 0.000002,
      timestamp: new Date().toLocaleTimeString(),
      executionMs: priorityFee === 'ultra' ? 240 : 380,
      mode,
      limitTriggerRate: matchedPrice || (rate * 0.95),
      dcaFrequency: 'day',
      dcaOrders: 10
    };
    onExecuteReceipt(receipt);
  };

  return (
    <div className="w-full rounded-3xl specular-card p-5 sm:p-6 transition-all space-y-4 shadow-2xl relative overflow-hidden">
      
      <div className="relative flex items-center p-1 rounded-2xl bg-slate-950/90 border border-white/10 text-xs shadow-inner">
        {(['swap', 'limit', 'dca'] as SwapMode[]).map((tabMode) => {
          const isActive = mode === tabMode;
          const label = tabMode === 'swap' ? 'Instant Swap' : tabMode === 'limit' ? 'Limit Order' : 'DCA';
          return (
            <button
              key={tabMode}
              onClick={() => setMode(tabMode)}
              className={`relative z-10 flex-1 py-2.5 rounded-xl font-bold transition-colors cursor-pointer text-center ${
                isActive ? 'text-[#00f2fe]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSwapModeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00f2fe]/20 via-[#4facfe]/15 to-[#9945FF]/20 border border-[#00f2fe]/50 shadow-md shadow-[#00f2fe]/20 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              {label}
            </button>
          );
        })}

        <div className="relative flex-1 py-2.5 rounded-xl text-center text-slate-500 text-xs cursor-not-allowed">
          <span>Perps</span>
          <span className="absolute -top-1.5 right-1 text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1 rounded-full font-bold">
            100x
          </span>
        </div>
      </div>

      {mode === 'swap' && (
        <div className="space-y-3.5">
          
          <div className="p-4 rounded-2xl glass-input space-y-2.5 relative overflow-hidden group focus-within:border-[#00f2fe]/60 focus-within:ring-2 focus-within:ring-[#00f2fe]/20 transition-all">
            
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <span>You Pay</span>
                <span className="text-[10px] text-slate-500 font-mono">Market</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">
                  Bal: {inToken.balance.toLocaleString()} {inToken.symbol}
                </span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickPercent(1)}
                  className="px-2 py-0.5 rounded-md bg-[#00f2fe]/15 text-[#00f2fe] text-[10px] font-bold hover:bg-[#00f2fe]/25 border border-[#00f2fe]/30 transition-all cursor-pointer font-mono"
                >
                  MAX
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                value={inAmount}
                onChange={(e) => setInAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-3xl sm:text-4xl font-mono font-extrabold text-white focus:outline-none placeholder:text-slate-600"
              />

              <button
                onClick={onOpenInTokenModal}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 hover:border-[#00f2fe]/50 hover:bg-slate-800 transition-all cursor-pointer shrink-0 shadow-lg group/btn"
              >
                <img src={inToken.icon} alt={inToken.symbol} className="w-6 h-6 rounded-full group-hover/btn:scale-110 transition-transform" />
                <span className="font-bold text-sm text-white">{inToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>

            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                ≈ ${(amountNum * inToken.priceUsd).toFixed(2)} USD
              </span>

              <div className="flex items-center gap-1.5">
                {[0.25, 0.5, 0.75].map((pct) => (
                  <motion.button
                    key={pct}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickPercent(pct)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 hover:border-[#00f2fe]/40 text-[10px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    {pct * 100}%
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2.5 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFlip}
              className={`p-3 rounded-2xl bg-slate-900 border border-white/20 text-[#00f2fe] hover:bg-slate-800 hover:border-[#00f2fe]/60 shadow-xl shadow-black/80 transition-all cursor-pointer group specular-card ${
                isRotating ? 'rotate-180 transition-transform duration-300' : ''
              }`}
              title="Reverse Token Direction"
            >
              <ArrowDownUp className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
            </motion.button>
          </div>

          <div className="p-4 rounded-2xl glass-input space-y-2.5 relative overflow-hidden group">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <span>You Receive (Estimated)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Best Return</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Bal: {outToken.balance.toLocaleString()} {outToken.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-400 flex items-center gap-1">
                <span>~{outAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={onOpenOutTokenModal}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900 border border-white/10 hover:border-[#00f2fe]/50 hover:bg-slate-800 transition-all cursor-pointer shrink-0 shadow-lg group/btn"
              >
                <img src={outToken.icon} alt={outToken.symbol} className="w-6 h-6 rounded-full group-hover/btn:scale-110 transition-transform" />
                <span className="font-bold text-sm text-white">{outToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 font-mono">
              <span>≈ ${(outAmount * outToken.priceUsd).toFixed(2)} USD</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                1 {inToken.symbol} = {rate.toFixed(4)} {outToken.symbol}
              </span>
            </div>
          </div>

          <RouteVisualizer
            inToken={inToken}
            outToken={outToken}
            inAmount={amountNum}
            outAmount={outAmount}
            savedUsd={savedUsd}
            splits={splits}
          />

          <DiagnosticsHUD
            priorityFee={priorityFee}
            setPriorityFee={setPriorityFee}
            slippage={slippage}
            setSlippage={setSlippage}
            priceImpactPct={amountNum > 10 ? 0.42 : 0.02}
          />

          <MorphButton
            amount={amountNum}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
          />

        </div>
      )}

      {mode === 'limit' && (
        <div className="space-y-4">
          <LimitWidget
            inToken={inToken}
            outToken={outToken}
            onOpenInTokenModal={onOpenInTokenModal}
            onOpenOutTokenModal={onOpenOutTokenModal}
            targetPrice={matchedPrice}
          />
          <MorphButton
            amount={amountNum}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
          />
        </div>
      )}

      {mode === 'dca' && (
        <div className="space-y-4">
          <DCAWidget
            inToken={inToken}
            outToken={outToken}
            onOpenInTokenModal={onOpenInTokenModal}
            onOpenOutTokenModal={onOpenOutTokenModal}
          />
          <MorphButton
            amount={amountNum}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
          />
        </div>
      )}

    </div>
  );
};
