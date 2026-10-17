import { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'before-after' | 'rubric' | 'prototype'>('overview');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg animate-fadeIn cursor-pointer">
      <div 
        className="w-full max-w-4xl rounded-3xl bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] specular-card cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c7f284] via-[#14F195] to-[#9945FF] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#c7f284]" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Jupiter Next (Jup 3.0: Fluid DeFi)</span>
                <span className="px-2 py-0.5 text-[10px] bg-[#c7f284]/10 text-[#c7f284] border border-[#c7f284]/20 rounded-full font-mono font-medium">
                  UX Case Study
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official Redesign Blueprint for Superteam India Bounty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-white/5 bg-slate-950/40 text-xs overflow-x-auto scrollbar-none relative">
          {[
            { id: 'overview', label: '1. Executive Summary' },
            { id: 'before-after', label: '2. Before vs After UX Audit' },
            { id: 'rubric', label: '3. Judging Rubric Alignment' },
            { id: 'prototype', label: '4. Prototype Architecture' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-3.5 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer z-10 ${
                  isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="caseStudyActiveTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#c7f284]/25 to-[#9945FF]/25 border border-[#c7f284]/40 shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-[#c7f284] uppercase tracking-wider">
                  Superteam Form Question 1
                </span>
                <h3 className="text-sm font-bold text-white">
                  Which app did you redesign, and which features did you pick?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We chose <strong>Jupiter Exchange (jup.ag)</strong>, the flagship liquidity aggregator of the Solana ecosystem. We redesigned <strong>4 core features</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>1. Kinetic Multi-Hop Routing:</strong> Real-time split-pool liquidity visualizer with savings counter.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c7f284] shrink-0" />
                    <span><strong>2. Jup Morph Action Button:</strong> Fuse-inspired hold-to-confirm button with celebration state.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>3. Safety & MEV Diagnostics HUD:</strong> Real-time on-chain telemetry for front-run protection.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>4. Unified Execution Matrix:</strong> Direct tab switching between Instant Swap, DCA, and Limit.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-[#c7f284] uppercase tracking-wider">
                  Superteam Form Question 2
                </span>
                <h3 className="text-sm font-bold text-white">
                  What was the biggest problem you found in the current design, in 2–3 sentences?
                </h3>
                <blockquote className="p-3 rounded-xl bg-slate-950/70 border-l-2 border-[#c7f284] text-xs text-slate-200 italic leading-relaxed">
                  "Despite handling billions in volume, Jupiter suffers from high cognitive load and transaction anxiety. Intelligent routing savings are buried in opaque text accordions, critical MEV and slippage protections require digging into nested settings, and static CTA buttons provide zero feedback during high-stakes on-chain settlement."
                </blockquote>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#c7f284]/10 to-transparent border border-[#c7f284]/20 space-y-1">
                  <span className="font-bold text-[#c7f284]">1. Radical Clarity</span>
                  <p className="text-[11px] text-slate-400">Transform cryptic routing algorithms into intuitive visual stories showing exactly how much money Jupiter saves users.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 space-y-1">
                  <span className="font-bold text-purple-300">2. Zero Anxiety</span>
                  <p className="text-[11px] text-slate-400">Eliminate fat-finger slippage and MEV sandwiching with tactile hold-to-confirm physics and automated Jito bundling.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-emerald-400">3. Unified DeFi</span>
                  <p className="text-[11px] text-slate-400">Integrate DCA and Limit orders into a cohesive trading terminal without requiring users to jump across disparate sub-apps.</p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'before-after' && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#c7f284]/15 text-[#c7f284] text-[10px] font-bold font-mono">
                    FEATURE 1
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Liquidity Routing & Route Splitting
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Current Jupiter (Before)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      <li>Routing is hidden inside a collapsed, nondescript text link: <code>1 SOL = 154.2 USDC (via 2 hops)</code>.</li>
                      <li>Users do not understand why their trade was split between Orca and Raydium.</li>
                      <li>Jupiter's most powerful competitive advantage (saving users money vs direct DEX pools) is completely invisible.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Jupiter Next (After)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                      <li><strong>Kinetic SVG Bezier Flow:</strong> Animated split paths visually demonstrate how 65% routes through Orca and 35% through Raydium.</li>
                      <li><strong>Value-Add Banner:</strong> Prominent badge highlighting exact savings: <code>⚡ Saved +$3.82 vs direct pool</code>.</li>
                      <li><strong>Telemetry Inspection:</strong> Real-time hop latency and gas efficiency metrics accessible on hover.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#c7f284]/15 text-[#c7f284] text-[10px] font-bold font-mono">
                    FEATURE 2
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Execution Button & Confirmation Feedback (Fuse Inspired)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Current Jupiter (Before)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      <li>Static "Swap" button with abrupt modal triggers.</li>
                      <li>Accidental taps on mobile lead to unintended order submission.</li>
                      <li>Spinning indicator provides zero context on RPC status, leaving users anxious about whether their trade succeeded.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Jupiter Next (After)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                      <li><strong>Multi-Action Morph Button:</strong> Tactile 5-state lifecycle: <code>Idle → Ready → Hold to Confirm → Jito Routing → Celebration</code>.</li>
                      <li><strong>Hold-to-Confirm Physics:</strong> Radial progress ring prevents fat-finger slippage while preserving 1-tap accessibility.</li>
                      <li><strong>Micro-Confetti Celebration:</strong> Confirms on-chain finality with an instant Solscan receipt drawer.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#c7f284]/15 text-[#c7f284] text-[10px] font-bold font-mono">
                    FEATURE 3
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    MEV Protection & Token Safety Radar (On-Chain Diagnostics)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Current Jupiter (Before)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      <li>Slippage and priority settings are hidden behind a gear icon modal.</li>
                      <li>Users trading volatile meme tokens get blindsided by high price impact or malicious token freeze authorities.</li>
                      <li>MEV tip settings are confusing and require deep Solana technical knowledge.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Jupiter Next (After)</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                      <li><strong>Safety Diagnostics HUD:</strong> Dedicated card displaying Mint Authority Revocation, Liquidity Lock %, and Price Impact Gauge.</li>
                      <li><strong>1-Click Jito Bundle Selector:</strong> Simplified priority fee toggle (Fast, Turbo, Ultra) with guaranteed anti-sandwiching.</li>
                      <li><strong>Dynamic Slippage:</strong> Automatically calculates optimal tolerance based on block congestion.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'rubric' && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs text-slate-400">
                How Jupiter Next maps directly onto the four official evaluation dimensions of the Superteam India challenge:
              </p>

              <div className="grid grid-cols-1 gap-3 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#c7f284] text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#c7f284]" /> 1. Real Problem Solving
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c7f284]/10 text-[#c7f284] font-bold">10/10 Focus</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Solana trades settle in under 400 milliseconds, but existing UIs treat swaps like slow Ethereum transactions. By introducing Jito MEV bundling into the main HUD, visual route splits, and instant feedback, we solve real financial anxiety, slippage failures, and front-running risks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> 2. Design Rationale & Clarity
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">10/10 Focus</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Every design element is anchored in cognitive psychology: progressive disclosure hides technical clutter while making critical security metrics (honeypots, price impact) immediately visible without modal hunting.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Craft, Polish & Taste
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">10/10 Focus</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Deep obsidian palette (<code>#07090e</code>), subtle glass refraction (<code>backdrop-blur-2xl</code>), specular borders, smooth Framer Motion spring physics, and canvas confetti bursts create an unmistakably premium, Tier-1 finish.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> 4. New User Intuition
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">10/10 Focus</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    A beginner can understand their trade in 2 seconds: "I'm putting in 1 SOL, Jupiter is routing 65% via Orca and 35% via Raydium to save me $3.82, and I'm receiving 154.20 USDC with 0% risk of sandwiching."
                  </p>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'prototype' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                <span className="font-bold text-[#c7f284] text-sm">Interactive Prototype Stack:</span>
                <p className="text-slate-300 leading-relaxed">
                  Unlike traditional static Figma submissions, this redesign is backed by an interactive, responsive React application built with:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/5">React 19 + TypeScript</div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/5">Tailwind CSS v4</div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/5">Framer Motion</div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/5">Canvas Confetti</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#c7f284]/10 via-[#14F195]/10 to-[#9945FF]/10 border border-[#c7f284]/20 space-y-2">
                <span className="font-bold text-white text-sm">Interactive Features to Test in this Live App:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Device Viewport Switcher:</strong> Click the monitor/phone icon in the top header to preview Desktop vs Mobile iPhone 16 Pro view.</li>
                  <li><strong>Token Switcher:</strong> Click token badges or the 180° flip button to inspect real-time route changes between SOL, USDC, JUP, JTO, and BONK.</li>
                  <li><strong>Execution Modes:</strong> Toggle between Instant Swap, DCA (with accumulation slider), and Limit Orders (with offset pills).</li>
                  <li><strong>Hold-to-Confirm Morph Button:</strong> Enter an amount, hold down the button to watch the radial progress fill, and trigger the live confetti receipt!</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-white/5 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 hidden sm:inline">
            Superteam India • Solana Summit India Track
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c7f284] to-[#14F195] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer ml-auto"
          >
            Explore Live Prototype
          </button>
        </div>

      </div>
    </div>
  );
};
