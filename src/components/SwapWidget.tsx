import React, { useState } from 'react';
import type { Token, SwapMode, PriorityFeeLevel, SlippagePreset, RouteSplit, TransactionReceipt } from '../types';
import { RouteVisualizer } from './RouteVisualizer';
import { DiagnosticsHUD } from './DiagnosticsHUD';
import { MorphButton } from './MorphButton';
import { DCAWidget } from './DCAWidget';
import { LimitWidget } from './LimitWidget';
import { ArrowDownUp, ChevronDown, RotateCw, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwapWidgetProps {
  onOpenInTokenModal: () => void;
  onOpenOutTokenModal: () => void;
  inToken: Token;
  outToken: Token;
  onSwapTokens: () => void;
  onExecuteReceipt: (receipt: TransactionReceipt) => void;
  matchedPrice?: number | null;
  activeMode?: SwapMode;
  onModeChange?: (mode: SwapMode) => void;
  onOpenPerps?: () => void;
}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  onOpenInTokenModal,
  onOpenOutTokenModal,
  inToken,
  outToken,
  onSwapTokens,
  onExecuteReceipt,
  matchedPrice,
  activeMode,
  onModeChange,
  onOpenPerps
}) => {
  const [internalMode, setInternalMode] = useState<SwapMode>('swap');
  const mode = activeMode !== undefined ? activeMode : internalMode;
  const setMode = (m: SwapMode) => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };
  const [inAmount, setInAmount] = useState('1.5');
  const [limitAmount, setLimitAmount] = useState('5');
  const [limitRateOffset, setLimitRateOffset] = useState<-1 | -5 | -10 | 5 | 10>(-5);
  const [dcaAmount, setDcaAmount] = useState('50');
  const [dcaOrders, setDcaOrders] = useState(10);
  const [dcaFrequency, setDcaFrequency] = useState<'hour' | 'day' | 'week'>('day');
  const [priorityFee, setPriorityFee] = useState<PriorityFeeLevel>('turbo');
  const [slippage, setSlippage] = useState<SlippagePreset>('auto');
  const [isRotating, setIsRotating] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(true);
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
    const isLimit = mode === 'limit';
    const isDca = mode === 'dca';
    const activeInAmount = isLimit ? (parseFloat(limitAmount) || 0) : isDca ? (parseFloat(dcaAmount) || 0) : amountNum;
    const targetTrigger = matchedPrice || (rate * (1 + limitRateOffset / 100));
    const activeOutAmount = isLimit ? activeInAmount * targetTrigger : isDca ? (activeInAmount * inToken.priceUsd) / outToken.priceUsd : outAmount;

    const receipt: TransactionReceipt = {
      txSignature: '4ZkF9x8Nm2Pq7wLtV5bY1sX9dJ0vKw3mRt8pLa9cQm2bZ1xQ4v7wLa0m9pQr8sT',
      inAmount: activeInAmount,
      inToken,
      outAmount: activeOutAmount,
      outToken,
      savedUsd: isLimit || isDca ? 0 : savedUsd,
      routeSplits: splits,
      feePaidSol: priorityFee === 'ultra' ? 0.00001 : priorityFee === 'turbo' ? 0.000005 : 0.000002,
      timestamp: new Date().toLocaleTimeString(),
      executionMs: priorityFee === 'ultra' ? 240 : 380,
      mode,
      limitTriggerRate: targetTrigger,
      dcaFrequency,
      dcaOrders
    };
    onExecuteReceipt(receipt);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0f141f] border border-white/5 p-4 sm:p-5 transition-all space-y-4 shadow-2xl relative select-none">
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-1">
          {(['swap', 'limit', 'dca'] as SwapMode[]).map((tabMode) => {
            const isActive = mode === tabMode;
            const label = tabMode === 'swap' ? 'Swap' : tabMode === 'limit' ? 'Limit' : 'DCA';
            return (
              <button
                key={tabMode}
                onClick={() => setMode(tabMode)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive ? 'text-[#080b11] bg-[#c7f284] shadow-md shadow-[#c7f284]/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}

          <button
            onClick={onOpenPerps}
            className="relative px-3 py-1.5 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Perps</span>
            <span className="text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1 rounded-full">
              100x
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button 
            onClick={() => {}}
            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            title="Refresh Quotes"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            title="Slippage and Fees Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {mode === 'swap' && (
        <div className="space-y-2">
          
          <div className="p-3.5 rounded-xl bg-[#131924] border border-white/5 space-y-2 focus-within:border-[#c7f284]/40 transition-all">
            
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Selling</span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">
                  Balance: {inToken.balance.toLocaleString()} {inToken.symbol}
                </span>
                <button 
                  onClick={() => handleQuickPercent(0.5)}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold border border-white/10 transition-colors cursor-pointer"
                >
                  Half
                </button>
                <button 
                  onClick={() => handleQuickPercent(1)}
                  className="px-1.5 py-0.5 rounded bg-[#c7f284]/15 hover:bg-[#c7f284]/25 text-[#c7f284] text-[10px] font-bold border border-[#c7f284]/30 transition-colors cursor-pointer"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                value={inAmount}
                onChange={(e) => setInAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-3xl sm:text-4xl font-mono font-black text-white focus:outline-none placeholder:text-slate-600"
              />

              <button
                onClick={onOpenInTokenModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a2233] border border-white/10 hover:border-[#c7f284]/40 hover:bg-[#222c42] transition-all cursor-pointer shrink-0 shadow-md group/btn"
              >
                <img src={inToken.icon} alt={inToken.symbol} className="w-6 h-6 rounded-full group-hover/btn:scale-105 transition-transform" />
                <span className="font-bold text-sm text-white">{inToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>

            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                ≈ ${(amountNum * inToken.priceUsd).toFixed(2)} USD
              </span>

              <div className="flex items-center gap-1">
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleQuickPercent(pct)}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {pct === 1 ? '100%' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFlip}
              className={`p-2.5 rounded-xl bg-[#0f141f] border border-white/10 text-[#c7f284] hover:bg-[#131924] hover:border-[#c7f284]/60 shadow-xl shadow-black/80 transition-all cursor-pointer ${
                isRotating ? 'rotate-180 transition-transform duration-300' : ''
              }`}
              title="Reverse Token Direction"
            >
              <ArrowDownUp className="w-4 h-4 text-[#c7f284]" />
            </motion.button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131924] border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Buying</span>
              <span className="font-mono text-[11px] text-slate-400">
                Balance: {outToken.balance.toLocaleString()} {outToken.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-3xl sm:text-4xl font-mono font-black text-[#c7f284]">
                ~{outAmount.toFixed(2)}
              </div>

              <button
                onClick={onOpenOutTokenModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a2233] border border-white/10 hover:border-[#c7f284]/40 hover:bg-[#222c42] transition-all cursor-pointer shrink-0 shadow-md group/btn"
              >
                <img src={outToken.icon} alt={outToken.symbol} className="w-6 h-6 rounded-full group-hover/btn:scale-105 transition-transform" />
                <span className="font-bold text-sm text-white">{outToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 font-mono">
              <span>≈ ${(outAmount * outToken.priceUsd).toFixed(2)} USD</span>
              <span className="text-[#c7f284] font-semibold flex items-center gap-1">
                1 {inToken.symbol} ≈ {rate.toFixed(4)} {outToken.symbol}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRouteOpen(!isRouteOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#131924] border border-white/5 hover:border-white/10 text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c7f284] animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">
                Route: 3 hops via Orca (65%) + Raydium (35%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c7f284] font-mono font-bold text-[11px]">
                +${savedUsd.toFixed(2)} saved
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRouteOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <MorphButton
            amount={amountNum}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
          />

          {isRouteOpen && (
            <div className="space-y-4 animate-fadeIn">
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
            </div>
          )}

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
            amount={limitAmount}
            onAmountChange={setLimitAmount}
            rateOffset={limitRateOffset}
            onRateOffsetChange={setLimitRateOffset}
          />
          <MorphButton
            amount={parseFloat(limitAmount) || 0}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
            customLabel="Place Limit Order"
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
            totalAmount={dcaAmount}
            onTotalAmountChange={setDcaAmount}
            orders={dcaOrders}
            onOrdersChange={setDcaOrders}
            frequency={dcaFrequency}
            onFrequencyChange={setDcaFrequency}
          />
          <MorphButton
            amount={parseFloat(dcaAmount) || 0}
            onExecuteSwap={handleExecute}
            inSymbol={inToken.symbol}
            outSymbol={outToken.symbol}
            customLabel="Start DCA Accumulation"
          />
        </div>
      )}

    </div>
  );
};
