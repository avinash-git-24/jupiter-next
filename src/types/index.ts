export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  priceUsd: number;
  decimals: number;
  isVerified: boolean;
  change24h: number;
}

export type SwapMode = 'swap' | 'limit' | 'dca' | 'perps';

export type PriorityFeeLevel = 'fast' | 'turbo' | 'ultra';

export type SlippagePreset = 'auto' | '0.1' | '0.5' | '1.0' | 'custom';

export type ButtonActionState = 'idle' | 'ready' | 'holding' | 'routing' | 'success';

export interface RouteSplit {
  dexName: string;
  percentage: number;
  poolType: string;
  inToken: string;
  outToken: string;
  latencyMs: number;
}

export interface TransactionReceipt {
  txSignature: string;
  inAmount: number;
  inToken: Token;
  outAmount: number;
  outToken: Token;
  savedUsd: number;
  routeSplits: RouteSplit[];
  feePaidSol: number;
  timestamp: string;
  executionMs: number;
}
