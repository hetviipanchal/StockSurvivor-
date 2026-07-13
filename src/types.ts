/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockScenario {
  ticker: string;
  name: string;
  logo: string;
  scenarioName: string;
  description: string;
  startDate: string;
  prices: PricePoint[];
  marketCap: string;
  peRatio: string;
  high52Week: number;
  low52Week: number;
  volatility: string;
  riskScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  rank: string; // 'Beginner Investor' | 'Smart Trader' | 'Market Analyst' | 'Investment Guru' | 'Wall Street Legend'
  level: number;
  xp: number;
  coins: number;
  streak: number;
  accuracy: number;
  winRatio: number;
  totalChallenges: number;
  completedScenarios: string[]; // List of tickers completed
  skills: {
    riskManagement: number;
    trendPrediction: number;
    marketKnowledge: number;
    decisionSpeed: number;
    portfolioDiversification: number;
  };
  achievements: Achievement[];
  watchlist: string[]; // List of tickers
}

export interface MarketIndex {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: string;
}
