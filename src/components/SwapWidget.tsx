import { useState } from 'react';
import type { Token, SwapMode, PriorityFeeLevel, SlippagePreset, RouteSplit, TransactionReceipt } from '../types';
import { RouteVisualizer } from './RouteVisualizer';
import { DiagnosticsHUD } from './DiagnosticsHUD';
import { MorphButton } from './MorphButton';
import { DCAWidget } from './DCAWidget';
import { LimitWidget } from './LimitWidget';
import { ArrowDownUp } from 'lucide-react';

interface SwapWidgetProps {
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
  inToken: Token;
  outToken: Token;
  onSwapTokens: () => void;
  onExecuteReceipt: (receipt: TransactionReceipt) => void;
}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  onOpenInTokenModal,
  onOpenOutTokenModal,
  inToken,
  outToken,
  onSwapTokens,
  onExecuteReceipt
}) => {
  const [mode, setMode] = useState<SwapMode>('swap');
  const [inAmount, setInAmount] = useState('1.5');
  const [priorityFee, setPriorityFee] = useState<PriorityFeeLevel>('turbo');
  const [slippage, setSlippage] = useState<SlippagePreset>('auto');
  const [isRotating, setIsRotating] = useState(false);

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
    setTimeout(() => setIsRotating(false), 300);
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
      executionMs: priorityFee === 'ultra' ? 240 : 380
    };
    onExecuteReceipt(receipt);
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl glass-panel-elevated p-4 sm:p-6 transition-all space-y-4">
      
      {/* Unified Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-950/70 border border-white/5 text-xs">
        <button
          onClick={() => setMode('swap')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            mode === 'swap'
              ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#9945FF]/20 text-[#00f2fe] border border-[#00f2fe]/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Market Swap
        </button>

        <button
          onClick={() => setMode('limit')}
          className={`flex-1 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            mode === 'limit'
              ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#9945FF]/20 text-[#00f2fe] border border-[#00f2fe]/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Limit Order
        </button>

        <button
          onClick={() => setMode('dca')}
          className={`flex-1 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            mode === 'dca'
              ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#9945FF]/20 text-[#00f2fe] border border-[#00f2fe]/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          DCA
        </button>

        <div className="relative flex-1 py-2 rounded-xl text-center text-slate-500 text-xs cursor-not-allowed">
          <span>Perps</span>
          <span className="absolute -top-1 right-2 text-[8px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1 rounded-full font-bold">
            100x
          </span>
        </div>
      </div>

      {/* MODE 1: MARKET SWAP */}
      {mode === 'swap' && (
        <div className="space-y-3">
          
          {/* Input Card */}
          <div className="p-4 rounded-2xl glass-input space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>You Pay:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono">Balance: {inToken.balance.toLocaleString()} {inToken.symbol}</span>
                <button 
                  onClick={() => handleQuickPercent(1)}
                  className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#00f2fe] font-bold hover:bg-white/20 transition-colors cursor-pointer"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                value={inAmount}
                onChange={(e) => setInAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-3xl font-mono font-bold text-white focus:outline-none placeholder:text-slate-600"
              />

              <button
                onClick={onOpenInTokenModal}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800/90 border border-white/10 hover:border-[#00f2fe]/40 transition-all cursor-pointer shrink-0 shadow-md group"
              >
                <img src={inToken.icon} alt={inToken.symbol} className="w-6 h-6 rounded-full group-hover:scale-105 transition-transform" />
                <span className="font-bold text-sm text-white">{inToken.symbol}</span>
                <span className="text-slate-400 text-xs">▼</span>
              </button>
            </div>

            {/* Price USD & Quick Percent Pills */}
            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                ≈ ${(amountNum * inToken.priceUsd).toFixed(2)} USD
              </span>

              <div className="flex items-center gap-1">
                {[0.25, 0.5, 0.75].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleQuickPercent(pct)}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 hover:border-white/20 text-[10px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 180° Rotating Reversible Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleFlip}
              className={`p-2.5 rounded-2xl bg-slate-900 border border-white/15 text-[#00f2fe] hover:bg-slate-800 hover:border-[#00f2fe]/50 shadow-xl shadow-black/50 transition-all cursor-pointer ${
                isRotating ? 'rotate-180' : ''
              }`}
              title="Reverse Token Direction"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          {/* Output Card */}
          <div className="p-4 rounded-2xl glass-input space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>You Receive (Estimated):</span>
              <span className="font-mono">Balance: {outToken.balance.toLocaleString()} {outToken.symbol}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-3xl font-mono font-bold text-emerald-400">
                ~{outAmount.toFixed(2)}
              </div>

              <button
                onClick={onOpenOutTokenModal}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800/90 border border-white/10 hover:border-[#00f2fe]/40 transition-all cursor-pointer shrink-0 shadow-md group"
              >
                <img src={outToken.icon} alt={outToken.symbol} className="w-6 h-6 rounded-full group-hover:scale-105 transition-transform" />
                <span className="font-bold text-sm text-white">{outToken.symbol}</span>
                <span className="text-slate-400 text-xs">▼</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 font-mono">
              <span>≈ ${(outAmount * outToken.priceUsd).toFixed(2)} USD</span>
              <span className="text-emerald-400">1 {inToken.symbol} = {rate.toFixed(4)} {outToken.symbol}</span>
            </div>
          </div>

          {/* Feature 1: Kinetic Split-Hop Route Visualizer */}
          <RouteVisualizer
            inToken={inToken}
            outToken={outToken}
            inAmount={amountNum}
            outAmount={outAmount}
            savedUsd={savedUsd}
            splits={splits}
          />

          {/* Feature 2: Transaction Health & Safety Radar HUD */}
          <DiagnosticsHUD
            priorityFee={priorityFee}
            setPriorityFee={setPriorityFee}
            slippage={slippage}
            setSlippage={setSlippage}
            priceImpactPct={amountNum > 10 ? 0.42 : 0.02}
          />

          {/* Feature 3: Fuse-Inspired Dynamic Morph Button */}
          <MorphButton
            amount={amountNum}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
          />

        </div>
      )}

      {/* MODE 2: LIMIT ORDER */}
      {mode === 'limit' && (
        <div className="space-y-4">
          <LimitWidget
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

      {/* MODE 3: DOLLAR COST AVERAGING (DCA) */}
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
