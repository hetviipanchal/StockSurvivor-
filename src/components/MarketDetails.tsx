/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StockScenario } from "../types";
import { 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart2, 
  BookOpen, 
  RefreshCw, 
  Info, 
  ChevronRight,
  Award,
  Coins,
  ArrowRight
} from "lucide-react";

interface MarketDetailsProps {
  stock: StockScenario;
  scenarios: StockScenario[];
  onSelectStock: (ticker: string) => void;
  onBack: () => void;
  onDecisionSubmitted: (outcome: {
    isCorrect: boolean;
    xpEarned: number;
    coinsEarned: number;
    decision: string;
    actualPrices: any[];
    aiAnalysis: string;
    message: string;
  }) => void;
}

export default function MarketDetails({
  stock,
  scenarios,
  onSelectStock,
  onBack,
  onDecisionSubmitted,
}: MarketDetailsProps) {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameResult, setGameResult] = useState<{
    isCorrect: boolean;
    outcomeMessage: string;
    priceChangePercent: number;
    rewardXP: number;
    actualPrices: any[];
    aiAnalysis: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"chart" | "profile" | "timeline">("chart");

  const isIndian = !["AAPL", "NVDA", "TSLA", "AMZN"].includes(stock.ticker);
  const currencySymbol = isIndian ? "₹" : "$";

  // Prices up to decision day (first 6 days)
  const visiblePrices = stock.prices;

  // Key figures
  const decisionDayPrice = visiblePrices[visiblePrices.length - 1].close;
  const openingPrice = visiblePrices[visiblePrices.length - 1].open;
  const highPrice = visiblePrices[visiblePrices.length - 1].high;
  const lowPrice = visiblePrices[visiblePrices.length - 1].low;
  const volumePrice = visiblePrices[visiblePrices.length - 1].volume;

  // Volatility and Risk Meter helper
  const getVolatilityColor = (v: string) => {
    if (v.includes("Extremely")) return "text-red-600 border-red-200 bg-red-50";
    if (v.includes("High")) return "text-amber-600 border-amber-200 bg-amber-50";
    return "text-blue-600 border-blue-200 bg-blue-50";
  };

  const handleSubmitDecision = async (decision: string) => {
    setSelectedDecision(decision);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: stock.ticker, decision }),
      });
      const data = await response.json();

      setGameResult({
        isCorrect: data.isCorrect,
        outcomeMessage: data.outcomeMessage,
        priceChangePercent: data.priceChangePercent,
        rewardXP: data.rewardXP,
        actualPrices: data.actualPrices,
        aiAnalysis: data.aiAnalysis,
      });

      // Notify parent to credit XP / coins
      onDecisionSubmitted({
        isCorrect: data.isCorrect,
        xpEarned: data.rewardXP,
        coinsEarned: data.isCorrect ? data.rewardXP / 2 : 10, // flat consolation reward
        decision,
        actualPrices: data.actualPrices,
        aiAnalysis: data.aiAnalysis,
        message: data.outcomeMessage,
      });
    } catch (err) {
      console.error("Decision submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetChallenge = () => {
    setSelectedDecision(null);
    setGameResult(null);
  };

  // Dynamic generation of 30 days of candlestick data interpolated from 10 sparse landmark prices
  const generate30DayPrices = (stockObj: StockScenario) => {
    const result: { date: string; open: number; high: number; low: number; close: number; volume: number }[] = [];
    
    // Phase 1: Pre-decision daily candles (Day 1 to Day 20)
    // We have 6 historical anchors: sc.prices[0] ... sc.prices[5]
    const preAnchors = stockObj.prices.slice(0, 6);
    for (let i = 0; i < 20; i++) {
      const ratio = i / 19; // 0 to 1
      const anchorIndexFloat = ratio * 5;
      const idx0 = Math.floor(anchorIndexFloat);
      const idx1 = Math.min(idx0 + 1, 5);
      const t = anchorIndexFloat - idx0;
      
      const p0 = preAnchors[idx0];
      const p1 = preAnchors[idx1];
      
      const open = p0.open + (p1.open - p0.open) * t;
      const close = p0.close + (p1.close - p0.close) * t;
      const baseHigh = Math.max(open, close);
      const baseLow = Math.min(open, close);
      
      const noiseSeed = Math.sin(i + stockObj.ticker.charCodeAt(0)) * 0.012;
      const highNoise = Math.abs(Math.cos(i) * 0.015);
      const lowNoise = Math.abs(Math.sin(i) * 0.015);
      
      const finalOpen = Number((open * (1 + noiseSeed * 0.2)).toFixed(2));
      const finalClose = Number((close * (1 - noiseSeed * 0.2)).toFixed(2));
      const finalHigh = Number((Math.max(finalOpen, finalClose, baseHigh) * (1 + highNoise)).toFixed(2));
      const finalLow = Number((Math.min(finalOpen, finalClose, baseLow) * (1 - lowNoise)).toFixed(2));
      const finalVolume = Math.round(p0.volume + (p1.volume - p0.volume) * t);
      
      result.push({
        date: `Day ${i + 1}`,
        open: finalOpen,
        high: finalHigh,
        low: finalLow,
        close: finalClose,
        volume: finalVolume
      });
    }
    
    // Phase 2: Post-decision daily candles (Day 21 to Day 30)
    // We have 5 anchors: sc.prices[5] to sc.prices[9]
    const postAnchors = stockObj.prices.slice(5);
    for (let i = 0; i < 10; i++) {
      const ratio = i / 9; // 0 to 1
      const anchorIndexFloat = ratio * (postAnchors.length - 1);
      const idx0 = Math.floor(anchorIndexFloat);
      const idx1 = Math.min(idx0 + 1, postAnchors.length - 1);
      const t = anchorIndexFloat - idx0;
      
      const p0 = postAnchors[idx0];
      const p1 = postAnchors[idx1];
      
      const open = p0.open + (p1.open - p0.open) * t;
      const close = p0.close + (p1.close - p0.close) * t;
      const baseHigh = Math.max(open, close);
      const baseLow = Math.min(open, close);
      
      const noiseSeed = Math.sin(i + 20 + stockObj.ticker.charCodeAt(0)) * 0.012;
      const highNoise = Math.abs(Math.cos(i + 20) * 0.015);
      const lowNoise = Math.abs(Math.sin(i + 20) * 0.015);
      
      const finalOpen = Number((open * (1 + noiseSeed * 0.2)).toFixed(2));
      const finalClose = Number((close * (1 - noiseSeed * 0.2)).toFixed(2));
      const finalHigh = Number((Math.max(finalOpen, finalClose, baseHigh) * (1 + highNoise)).toFixed(2));
      const finalLow = Number((Math.min(finalOpen, finalClose, baseLow) * (1 - lowNoise)).toFixed(2));
      const finalVolume = Math.round(p0.volume + (p1.volume - p0.volume) * t);
      
      result.push({
        date: `Day ${i + 21}`,
        open: finalOpen,
        high: finalHigh,
        low: finalLow,
        close: finalClose,
        volume: finalVolume
      });
    }
    
    return result;
  };

  const thirtyDayPrices = generate30DayPrices(stock);
  const allPrices = gameResult ? thirtyDayPrices : thirtyDayPrices.slice(0, 20);

  // SVG Chart Height and Width Bounds
  const chartW = 750;
  const chartH = 260;
  const padding = 30;

  // Compute scale boundaries
  const minVal = Math.min(...allPrices.map((p) => p.low)) * 0.95;
  const maxVal = Math.max(...allPrices.map((p) => p.high)) * 1.05;

  const getX = (index: number, total: number) => {
    return padding + (index / (total - 1)) * (chartW - padding * 2);
  };

  const getY = (val: number) => {
    return chartH - padding - ((val - minVal) / (maxVal - minVal)) * (chartH - padding * 2);
  };

  return (
    <div className="bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 text-left">
      {/* Header back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 font-sans text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>← Back to Dashboard</span>
        </button>

        <span className="font-mono text-xs text-slate-400 uppercase">
          Market Terminal: {stock.ticker}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left 3 columns: Primary charts and actions */}
        <div className="space-y-6 lg:col-span-3">
          {/* Stock Header & Stats Row */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl font-extrabold text-slate-800">
                  {stock.logo}
                </div>
                <div>
                  <h1 className="font-sans text-xl font-extrabold text-slate-900 leading-tight">
                    {stock.name} ({stock.ticker})
                  </h1>
                  <p className="font-sans text-xs text-slate-500 mt-0.5">
                    {stock.scenarioName} • Real Historical Data
                  </p>
                </div>
              </div>

              {/* Ticker values */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Milestone Price</span>
                  <span className="font-mono text-base font-bold text-slate-800">
                    {currencySymbol}{decisionDayPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block tracking-wider">52W High</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {currencySymbol}{stock.high52Week.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block tracking-wider">52W Low</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {currencySymbol}{stock.low52Week.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Market Cap</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {stock.marketCap}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Main TradingView-Style Candlestick Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            {/* Chart Subheading & Controls */}
            <div className="mb-4 flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
              <div className="flex space-x-1">
                <button 
                  onClick={() => setActiveTab("chart")}
                  className={`rounded-lg px-3 py-1 font-sans text-xs font-semibold ${
                    activeTab === "chart" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Candlestick Chart
                </button>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`rounded-lg px-3 py-1 font-sans text-xs font-semibold ${
                    activeTab === "profile" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Company Profile
                </button>
                <button 
                  onClick={() => setActiveTab("timeline")}
                  className={`rounded-lg px-3 py-1 font-sans text-xs font-semibold ${
                    activeTab === "timeline" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Scenario Timeline
                </button>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-500">
                <span>Start: {stock.startDate}</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">Day Interval: Daily</span>
              </div>
            </div>

            {/* Render selected view */}
            {activeTab === "chart" && (
              <div className="relative">
                {/* Custom Candlestick Chart Render */}
                <svg className="w-full overflow-visible" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75].map((ratio, i) => {
                    const gridY = padding + ratio * (chartH - padding * 2);
                    return (
                      <line
                        key={i}
                        x1={padding}
                        y1={gridY}
                        x2={chartW - padding}
                        y2={gridY}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Render candlesticks */}
                  {allPrices.map((p, idx) => {
                    const x = getX(idx, allPrices.length);
                    const openY = getY(p.open);
                    const closeY = getY(p.close);
                    const highY = getY(p.high);
                    const lowY = getY(p.low);

                    const isGreen = p.close >= p.open;
                    const candleColor = isGreen ? "#2563eb" : "#ef4444";

                    // Split visual indicator for Decision point day (index 19 of thirtyDayPrices)
                    const isDecisionDay = idx === 19;
                    const isFutureDay = idx > 19;

                    const candleWidth = allPrices.length === 20 ? 14 : 10;
                    const candleOffset = candleWidth / 2;

                    return (
                      <g key={idx}>
                        {/* Shading region for future days (when predictions are complete) */}
                        {isFutureDay && (
                          <rect
                            x={x - (chartW / allPrices.length) / 2}
                            y={padding}
                            width={chartW / allPrices.length}
                            height={chartH - padding * 2}
                            fill="rgba(37, 99, 235, 0.01)"
                            className="pointer-events-none"
                          />
                        )}

                        {/* Wick line */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={candleColor}
                          strokeWidth="1.5"
                        />

                        {/* Candle Body */}
                        <rect
                          x={x - candleOffset}
                          y={Math.min(openY, closeY)}
                          width={candleWidth}
                          height={Math.max(Math.abs(openY - closeY), 2)}
                          fill={candleColor}
                          rx="1.5"
                          className="transition-all"
                        />

                        {/* Decision Barrier marker */}
                        {isDecisionDay && !gameResult && (
                          <g>
                            <line
                              x1={x}
                              y1={padding}
                              x2={x}
                              y2={chartH - padding}
                              stroke="#eab308"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                            />
                            <circle cx={x} cy={closeY} r="5" fill="#eab308" className="animate-ping" />
                          </g>
                        )}

                        {/* X-axis date values (uncluttered) */}
                        {(idx % 3 === 0 || idx === 19 || idx === allPrices.length - 1) && (
                          <text
                            x={x}
                            y={chartH - 8}
                            fill="#64748b"
                            fontSize="8"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {p.date}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Vertical Separator Warning Overlay when game not solved */}
                {!gameResult && (
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 rounded-xl border border-blue-200 bg-white/95 p-4 text-center max-w-[240px] shadow-xl backdrop-blur-sm">
                    <span className="inline-block rounded-full bg-blue-50 p-1.5 text-blue-600 mb-2">
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <h4 className="font-sans text-[11px] font-bold text-slate-900">Future Price Locked</h4>
                    <p className="mt-1 font-sans text-[10px] leading-relaxed text-slate-600">
                      Submit your Buy, Hold, or Sell prediction below to reveal the actual outcome.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="py-4 font-sans text-slate-700">
                <h4 className="text-sm font-bold text-slate-900 text-left">Historical Challenge Briefing</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 text-left">
                  {stock.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Market Segment</span>
                    <span className="text-xs font-semibold text-slate-700">Global Equities Index</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Volatility Index</span>
                    <span className="text-xs font-semibold text-slate-700">{stock.volatility}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting Price</span>
                    <span className="text-xs font-semibold text-slate-700">{currencySymbol}{stock.prices[0].close}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Scenario</span>
                    <span className="text-xs font-semibold text-slate-700">{stock.scenarioName}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="py-4 space-y-4 text-left">
                <h4 className="font-sans text-sm font-bold text-slate-900">Event Catalyst Milestones</h4>
                <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-4">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <h5 className="font-sans text-xs font-semibold text-slate-800">Stage 1: Position Accumulation</h5>
                    <p className="font-sans text-[11px] text-slate-500 mt-0.5">Stock begins trading around base targets as institutional capital adjusts holdings.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <h5 className="font-sans text-xs font-semibold text-slate-800">Stage 2: Catalyst Announcement (Milestone Day)</h5>
                    <p className="font-sans text-[11px] text-slate-500 mt-0.5">Critical real-world events unfold. Volatility reaches standard max indexes.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 rounded-full bg-purple-600" />
                    <h5 className="font-sans text-xs font-semibold text-slate-800">Stage 3: The Survival Outrun (+180 Days)</h5>
                    <p className="font-sans text-[11px] text-slate-500 mt-0.5">The market absorbs the structural results, sorting winners from losers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Trading Controls (Buy, Hold, Sell Buttons) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            {!gameResult ? (
              <div className="text-left">
                <h3 className="mb-4 font-sans text-sm font-bold text-slate-900">
                  Predict Market Response: What will the stock do over the next 180 days?
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => handleSubmitDecision("buy")}
                    disabled={isSubmitting}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/50 p-4 transition-all hover:scale-[1.02] hover:border-blue-500 hover:bg-blue-100/40 active:scale-95"
                  >
                    <span className="text-blue-700 text-lg font-bold">BUY</span>
                    <span className="font-sans text-[10px] text-slate-500 mt-1">Bullish prediction</span>
                  </button>

                  <button
                    onClick={() => handleSubmitDecision("hold")}
                    disabled={isSubmitting}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-100 active:scale-95"
                  >
                    <span className="text-slate-600 text-lg font-bold">HOLD</span>
                    <span className="font-sans text-[10px] text-slate-500 mt-1">Consolidation prediction</span>
                  </button>

                  <button
                    onClick={() => handleSubmitDecision("sell")}
                    disabled={isSubmitting}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-4 transition-all hover:scale-[1.02] hover:border-red-500 hover:bg-red-100/40 active:scale-95"
                  >
                    <span className="text-red-600 text-lg font-bold">SELL / SHORT</span>
                    <span className="font-sans text-[10px] text-slate-500 mt-1">Bearish prediction</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Predictions Outcome Panel */
              <div className="space-y-4 text-left">
                <div className={`rounded-xl border p-4 ${
                  gameResult.isCorrect 
                    ? "border-blue-200 bg-blue-50 text-blue-700" 
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎯</span>
                    <h3 className="font-sans text-base font-bold text-slate-900">
                      {gameResult.isCorrect ? "Prediction Successful!" : "Prediction Incorrect"}
                    </h3>
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-700">
                    {gameResult.outcomeMessage}
                  </p>
                </div>

                {/* AI Wall Street Mentorship Commentary */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 text-left">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                      <h4 className="font-sans text-sm font-bold text-slate-900">Gemini AI Coach Feedback</h4>
                    </div>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[9px] text-blue-700 font-semibold">Personalized Insights</span>
                  </div>
                  <div className="font-sans text-xs leading-relaxed text-slate-600 space-y-2 whitespace-pre-line">
                    {gameResult.aiAnalysis}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleResetChallenge}
                    className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset Simulation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 column: Terminal Watchlist sidebar */}
        <div className="space-y-4">
          {/* Volatility & Risk compact block */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block mb-1">Volatility</span>
                <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${getVolatilityColor(stock.volatility)}`}>
                  {stock.volatility}
                </span>
              </div>
              <div>
                <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block mb-1">Risk Rating</span>
                <span className="font-mono text-xs font-bold text-slate-800">{stock.riskScore}/100</span>
              </div>
            </div>
          </div>

          {/* Interactive Indian Stocks Watchlist Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md text-left">
            <h3 className="mb-3 font-sans text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Indian Stock Panel 🇮🇳</span>
              <span className="text-[9px] font-mono font-bold text-slate-400">18 ACTIVE</span>
            </h3>

            <div className="max-h-[440px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {scenarios
                .filter(s => !["AAPL", "NVDA", "TSLA", "AMZN"].includes(s.ticker))
                .map((s) => {
                  const isActive = s.ticker === stock.ticker;
                  const initP = s.prices[0].close;
                  const finalP = s.prices[5].close;
                  const pChg = ((finalP - initP) / initP) * 100;
                  const isPos = pChg >= 0;

                  return (
                    <button
                      key={s.ticker}
                      onClick={() => onSelectStock(s.ticker)}
                      className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left transition-all border cursor-pointer ${
                        isActive
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm bg-slate-200/50 h-7 w-7 rounded-lg flex items-center justify-center font-bold">
                          {s.logo}
                        </span>
                        <div>
                          <span className="text-xs font-bold block leading-tight text-slate-800">{s.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono uppercase">{s.ticker}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold block text-slate-800">
                          ₹{finalP.toFixed(1)}
                        </span>
                        <span className={`text-[9px] font-mono font-bold ${isPos ? "text-blue-600" : "text-red-500"}`}>
                          {isPos ? "+" : ""}{pChg.toFixed(1)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quick learning card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-left">
            <h4 className="font-sans text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Pro terminal tips</h4>
            <p className="mt-1.5 font-sans text-[10px] leading-relaxed text-slate-600">
              Click any stock in the list above to immediately update the live candlestick charting representation of that particular stock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
