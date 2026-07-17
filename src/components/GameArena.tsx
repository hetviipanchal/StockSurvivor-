/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StockScenario, UserProfile } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  Check, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  X, 
  ArrowRight, 
  Flame, 
  Coins, 
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  Trophy
} from "lucide-react";

interface GameArenaProps {
  scenarios: StockScenario[];
  user: UserProfile;
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

interface PreviousTrade {
  stockName: string;
  logo: string;
  ticker: string;
  actualPrice: number;
  predictedPrice: number;
  decision: string; // "BUY" | "HOLD" | "SELL"
  status: "PROFIT" | "LOSS" | "HOLD";
  profitAmount: string;
  accuracy: number;
}

export default function GameArena({
  scenarios,
  user,
  onDecisionSubmitted,
}: GameArenaProps) {
  // Filter for Indian Stocks only
  const indianStocks = scenarios.filter(
    (s) => !["AAPL", "NVDA", "TSLA", "AMZN"].includes(s.ticker)
  );

  const [activeStock, setActiveStock] = useState<StockScenario>(
    indianStocks[0] || scenarios[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  
  // Game Play States
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);
  const [predictedPriceInput, setPredictedPriceInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Previous trade state (persisted in session/state)
  const [prevTrade, setPrevTrade] = useState<PreviousTrade | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("stock_survivor_prev_trade");
    return saved ? JSON.parse(saved) : null;
  });

  const [tradeHistory, setTradeHistory] = useState<PreviousTrade[]>(() => {
    if (typeof window === "undefined") {
      return [
        {
          stockName: "Reliance Industries",
          logo: "🇮🇳",
          ticker: "RELIANCE",
          actualPrice: 2846.4,
          predictedPrice: 2880.0,
          decision: "BUY",
          status: "PROFIT",
          profitAmount: "+₹33.60",
          accuracy: 94,
        },
        {
          stockName: "Tata Consultancy Services",
          logo: "🏢",
          ticker: "TCS",
          actualPrice: 3845.2,
          predictedPrice: 3800.0,
          decision: "SELL",
          status: "PROFIT",
          profitAmount: "+₹45.20",
          accuracy: 91,
        },
        {
          stockName: "Infosys",
          logo: "💻",
          ticker: "INFY",
          actualPrice: 1520.8,
          predictedPrice: 1510.0,
          decision: "HOLD",
          status: "HOLD",
          profitAmount: "₹0.00",
          accuracy: 89,
        },
      ];
    }

    const savedHistory = localStorage.getItem("stock_survivor_trade_history");
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }

    return [
      {
        stockName: "Reliance Industries",
        logo: "🇮🇳",
        ticker: "RELIANCE",
        actualPrice: 2846.4,
        predictedPrice: 2880.0,
        decision: "BUY",
        status: "PROFIT",
        profitAmount: "+₹33.60",
        accuracy: 94,
      },
      {
        stockName: "Tata Consultancy Services",
        logo: "🏢",
        ticker: "TCS",
        actualPrice: 3845.2,
        predictedPrice: 3800.0,
        decision: "SELL",
        status: "PROFIT",
        profitAmount: "+₹45.20",
        accuracy: 91,
      },
      {
        stockName: "Infosys",
        logo: "💻",
        ticker: "INFY",
        actualPrice: 1520.8,
        predictedPrice: 1510.0,
        decision: "HOLD",
        status: "HOLD",
        profitAmount: "₹0.00",
        accuracy: 89,
      },
    ];
  });

  const [tradeMessage, setTradeMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Search filter
  const filteredStocks = indianStocks.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStock = (stock: StockScenario) => {
    setActiveStock(stock);
    setSelectedDecision(null);
    setTradeMessage(null);
  };

  const handleOpenPredictModal = (decisionType: string) => {
    setSelectedDecision(decisionType);
    const currentPrice = activeStock.prices[5].close;
    // Set default predicted price slightly offset based on decision type
    const multiplier = decisionType === "buy" ? 1.05 : decisionType === "sell" ? 0.95 : 1.0;
    setPredictedPriceInput((currentPrice * multiplier).toFixed(1));
    setIsPredictModalOpen(true);
  };

  const handleSubmitPrediction = async () => {
    const predictionValue = parseFloat(predictedPriceInput);
    if (isNaN(predictionValue) || predictionValue <= 0) {
      alert("Please enter a valid target price prediction.");
      return;
    }

    setIsSubmitting(true);
    setIsPredictModalOpen(false);

    try {
      const decisionToSend = selectedDecision || "hold";

      // Call server submit endpoint
      const response = await fetch("/api/submit-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: activeStock.ticker, decision: decisionToSend }),
      });
      const data = await response.json();

      // Retrieve actual next day outcome price (from Day 7 close)
      const actualNextDayPrice = activeStock.prices[6]?.close || activeStock.prices[5].close * (data.isCorrect ? 1.05 : 0.95);
      const startPrice = activeStock.prices[5].close;

      // Calculate proximity accuracy
      const difference = Math.abs(predictionValue - actualNextDayPrice);
      const accuracyPercent = Math.max(0, Math.min(100, 100 - (difference / actualNextDayPrice) * 100));

      // Calculate profit loss status based on chosen decision and price action
      let tradeStatus: "PROFIT" | "LOSS" | "HOLD" = "HOLD";
      let pnlValue = 0;
      let pnlDisplay = "₹0.00";

      if (decisionToSend === "buy") {
        pnlValue = actualNextDayPrice - startPrice;
        tradeStatus = pnlValue > 0 ? "PROFIT" : "LOSS";
        pnlDisplay = `${pnlValue > 0 ? "+" : ""}₹${pnlValue.toFixed(2)}`;
      } else if (decisionToSend === "sell") {
        pnlValue = startPrice - actualNextDayPrice; // profit when price falls
        tradeStatus = pnlValue > 0 ? "PROFIT" : "LOSS";
        pnlDisplay = `${pnlValue > 0 ? "+" : ""}₹${pnlValue.toFixed(2)}`;
      } else {
        tradeStatus = "HOLD";
        pnlDisplay = "₹0.00";
      }

      const newTradeResult: PreviousTrade = {
        stockName: activeStock.name,
        logo: activeStock.logo,
        ticker: activeStock.ticker,
        actualPrice: actualNextDayPrice,
        predictedPrice: predictionValue,
        decision: decisionToSend.toUpperCase(),
        status: tradeStatus,
        profitAmount: pnlDisplay,
        accuracy: Math.round(accuracyPercent),
      };

      setPrevTrade(newTradeResult);
      setTradeHistory((prev) => {
const nextHistory = [newTradeResult, ...prev];        localStorage.setItem("stock_survivor_trade_history", JSON.stringify(nextHistory));
        return nextHistory;
      });
      localStorage.setItem("stock_survivor_prev_trade", JSON.stringify(newTradeResult));

      // Show result toast message
      setTradeMessage({
        text: `Trade Submitted! You chose ${decisionToSend.toUpperCase()}. Target: ₹${predictionValue.toFixed(1)}, Actual next day: ₹${actualNextDayPrice.toFixed(1)} (${accuracyPercent.toFixed(1)}% accuracy!). ${data.outcomeMessage}`,
        type: data.isCorrect ? "success" : "error",
      });

      // Submit results to update global user score, XP, and gold
      onDecisionSubmitted({
        isCorrect: data.isCorrect,
        xpEarned: Math.round(data.rewardXP + (accuracyPercent > 90 ? 100 : 20)),
        coinsEarned: Math.round(data.isCorrect ? 50 : 15),
        decision: decisionToSend,
        actualPrices: activeStock.prices,
        aiAnalysis: data.aiAnalysis,
        message: data.outcomeMessage,
      });

      // Show the requested success popup modal!
      setShowSuccessPopup(true);

     } catch (err) {
  console.error("Submission failed:", err);

  const decisionToSend = selectedDecision || "hold";

  const startPrice = activeStock.prices[5].close;
  const actualNextDayPrice = activeStock.prices[6].close;

  const priceChange =
    ((actualNextDayPrice - startPrice) / startPrice) * 100;

  let isCorrect = false;
  let rewardXP = 50;
  let outcomeMessage = "";

  if (decisionToSend === "buy") {
    isCorrect = actualNextDayPrice > startPrice;
    rewardXP = isCorrect ? 120 : 40;
    outcomeMessage = isCorrect
      ? "Great call! The stock increased."
      : "The stock declined after your BUY.";
  }

  if (decisionToSend === "sell") {
    isCorrect = actualNextDayPrice < startPrice;
    rewardXP = isCorrect ? 120 : 40;
    outcomeMessage = isCorrect
      ? "Excellent! Selling avoided the decline."
      : "The stock went up after your SELL.";
  }

  if (decisionToSend === "hold") {
    isCorrect = Math.abs(priceChange) < 3;
    rewardXP = isCorrect ? 100 : 50;
    outcomeMessage = isCorrect
      ? "Good patience! The stock stayed fairly stable."
      : "The market moved more than expected.";
  }

  const difference = Math.abs(predictionValue - actualNextDayPrice);
  const accuracyPercent = Math.max(
    0,
    Math.min(100, 100 - (difference / actualNextDayPrice) * 100)
  );

  let tradeStatus: "PROFIT" | "LOSS" | "HOLD" = "HOLD";
  let pnlValue = 0;
  let pnlDisplay = "₹0.00";

  if (decisionToSend === "buy") {
    pnlValue = actualNextDayPrice - startPrice;
    tradeStatus = pnlValue > 0 ? "PROFIT" : "LOSS";
    pnlDisplay = `${pnlValue > 0 ? "+" : ""}₹${pnlValue.toFixed(2)}`;
  } else if (decisionToSend === "sell") {
    pnlValue = startPrice - actualNextDayPrice;
    tradeStatus = pnlValue > 0 ? "PROFIT" : "LOSS";
    pnlDisplay = `${pnlValue > 0 ? "+" : ""}₹${pnlValue.toFixed(2)}`;
  }

  const newTradeResult = {
    stockName: activeStock.name,
    logo: activeStock.logo,
    ticker: activeStock.ticker,
    actualPrice: actualNextDayPrice,
    predictedPrice: predictionValue,
    decision: decisionToSend.toUpperCase(),
    status: tradeStatus,
    profitAmount: pnlDisplay,
    accuracy: Math.round(accuracyPercent),
  };

  setPrevTrade(newTradeResult);

  setTradeHistory((prev) => {
const nextHistory = [newTradeResult, ...prev];    localStorage.setItem(
      "stock_survivor_trade_history",
      JSON.stringify(nextHistory)
    );
    return nextHistory;
  });

  localStorage.setItem(
    "stock_survivor_prev_trade",
    JSON.stringify(newTradeResult)
  );

  setTradeMessage({
    text: `Offline Mode: ${outcomeMessage}`,
    type: isCorrect ? "success" : "error",
  });

  onDecisionSubmitted({
    isCorrect,
    xpEarned: rewardXP,
    coinsEarned: isCorrect ? 50 : 15,
    decision: decisionToSend,
    actualPrices: activeStock.prices,
    aiAnalysis:
      "Offline Analysis: Your decision was evaluated using historical price movement. This allows the game to work even when the backend is unavailable.",
    message: outcomeMessage,
  });

  setShowSuccessPopup(true);
} finally {
      setIsSubmitting(false);
    }
  };

  // Volatility style helper
  const getVolatilityBadge = (v: string) => {
    if (v.includes("Extremely") || v.includes("High")) {
      return "text-red-600 border-red-200 bg-red-50";
    }
    return "text-blue-600 border-blue-200 bg-blue-50";
  };

  return (
    <div className="bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 text-left relative min-h-[80vh]">
      {/* Header Banner */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="font-sans text-2xl font-black text-slate-900 flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-blue-600" /> Game Arena: Indian Stock Predictor
        </h1>
        <p className="font-sans text-xs text-slate-500 mt-1">
          Pick any premier Indian stock, add it to your predictor desk, and make high-stakes forecasts to win coins and build Wall Street status.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Watchlist panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-4 flex flex-col h-[650px] shadow-sm">
          <h2 className="font-sans text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
            <span>Premier Watchlist 🇮🇳</span>
            <span className="ml-auto text-[9px] bg-blue-50 text-blue-600 border border-blue-100 rounded-md px-1.5 py-0.5 font-mono">
              {filteredStocks.length} Assets
            </span>
          </h2>

          {/* Search inputs */}
          <div className="relative mb-3.5">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Indian stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 font-sans text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500/40 focus:bg-white transition-all"
            />
          </div>

          {/* Stocks Scroll list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredStocks.map((stk) => {
              const isSelected = activeStock.ticker === stk.ticker;
              const currentClose = stk.prices[5].close;
              const initialClose = stk.prices[0].close;
              const percentChg = ((currentClose - initialClose) / initialClose) * 100;
              const isPos = percentChg >= 0;

              return (
                <button
                   key={stk.ticker}
                  onClick={() => handleSelectStock(stk)}
                  className={`w-full flex items-center justify-between rounded-2xl p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm bg-slate-200/50 h-8 w-8 rounded-xl flex items-center justify-center font-bold text-slate-700">
                      {stk.logo}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{stk.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">{stk.ticker}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold block text-slate-800">
                      ₹{currentClose.toFixed(1)}
                    </span>
                    <span className={`text-[9px] font-mono font-bold ${isPos ? "text-blue-600" : "text-red-500"}`}>
                      {isPos ? "+" : ""}{percentChg.toFixed(1)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Game Desk (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          
          {/* Main Gameplay console */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Title block */}
            <div className="flex items-center space-x-3 mb-5">
              <span className="text-3xl bg-slate-100 h-12 w-12 rounded-2xl flex items-center justify-center border border-slate-200">
                {activeStock.logo}
              </span>
              <div>
                <span className="font-mono text-[9px] text-blue-600 font-bold uppercase tracking-widest block">Active Terminal</span>
                <h3 className="font-sans text-lg font-black text-slate-900 leading-tight">
                  {activeStock.name} ({activeStock.ticker})
                </h3>
              </div>

              <div className="ml-auto flex items-center space-x-2">
                <span className={`inline-block border text-[9px] font-bold uppercase rounded-md px-2 py-0.5 ${getVolatilityBadge(activeStock.volatility)}`}>
                  {activeStock.volatility}
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  Current Price: <strong className="text-slate-800">₹{activeStock.prices[5].close.toFixed(2)}</strong>
                </span>
              </div>
            </div>

            {/* Briefing */}
            <p className="font-sans text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5">
              <strong>Catalyst Briefing:</strong> {activeStock.description}
            </p>

            {/* Action predictions bar */}
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Select Position Direction to Trigger Prediction Desk:
              </h4>

              <div className="grid grid-cols-3 gap-3.5">
                <button
                  onClick={() => handleOpenPredictModal("buy")}
                  disabled={isSubmitting}
                  className="flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/50 py-4 transition-all hover:scale-[1.02] hover:border-blue-500 hover:bg-blue-100/40 active:scale-95 cursor-pointer"
                >
                  <span className="text-blue-600 text-lg font-black tracking-widest">BUY</span>
                  <span className="font-sans text-[9px] text-slate-500 mt-0.5">Bullish forecast</span>
                </button>

                <button
                  onClick={() => handleOpenPredictModal("hold")}
                  disabled={isSubmitting}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-4 transition-all hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-100 active:scale-95 cursor-pointer"
                >
                  <span className="text-slate-600 text-lg font-black tracking-widest">HOLD</span>
                  <span className="font-sans text-[9px] text-slate-500 mt-0.5">Consolidating forecast</span>
                </button>

                <button
                  onClick={() => handleOpenPredictModal("sell")}
                  disabled={isSubmitting}
                  className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 py-4 transition-all hover:scale-[1.02] hover:border-red-500 hover:bg-red-100/40 active:scale-95 cursor-pointer"
                >
                  <span className="text-red-600 text-lg font-black tracking-widest">SELL</span>
                  <span className="font-sans text-[9px] text-slate-500 mt-0.5">Bearish forecast</span>
                </button>
              </div>
            </div>

            {/* System notifications */}
            {tradeMessage && (
              <div className={`mt-5 p-4 rounded-2xl border flex items-start space-x-2.5 font-sans text-xs ${
                tradeMessage.type === "success"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : tradeMessage.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}>
                {tradeMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />}
                <span>{tradeMessage.text}</span>
              </div>
            )}
          </div>

          {/* Previous Trade performance block */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md text-left">
            <h3 className="mb-4 font-sans text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Previous Trade Performance console
            </h3>

            {tradeHistory.length > 0 ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Recent signal snapshots
                  </p>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {tradeHistory.map((trade, index) => (
                    <div
                      key={`${trade.ticker}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{trade.logo}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{trade.stockName}</p>
                            <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{trade.ticker}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                          trade.decision === "BUY"
                            ? "bg-blue-50 text-blue-700"
                            : trade.decision === "SELL"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {trade.decision}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl bg-slate-50 p-2">
                          <p className="text-[8px] uppercase tracking-wider text-slate-400">Target</p>
                          <p className="mt-0.5 font-mono text-[11px] font-bold text-slate-700">₹{trade.predictedPrice.toFixed(2)}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2">
                          <p className="text-[8px] uppercase tracking-wider text-slate-400">Actual</p>
                          <p className="mt-0.5 font-mono text-[11px] font-bold text-slate-700">₹{trade.actualPrice.toFixed(2)}</p>
                        </div>
                        <div className={`rounded-xl p-2 ${
                          trade.status === "PROFIT"
                            ? "bg-emerald-50 text-emerald-700"
                            : trade.status === "LOSS"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          <p className="text-[8px] uppercase tracking-wider">Result</p>
                          <p className="mt-0.5 font-mono text-[11px] font-bold">{trade.status} • {trade.accuracy}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                <p className="font-sans text-xs text-slate-500 italic">
                  No previous trade simulated yet. Place your prediction position on any stock above to initialize tracking records.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl text-center animate-in fade-in zoom-in-95">
            {/* Close button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 animate-bounce">
              <Check className="h-6 w-6" />
            </div>

            {/* Popup Title & Message */}
            <h3 className="font-sans text-lg font-black text-slate-900 mb-2">
              Submission Received!
            </h3>
            <p className="font-sans text-sm text-slate-600 mb-6">
              your response is submitted successfully!
            </p>

            {/* OK Action Button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Great!
            </button>
          </div>
        </div>
      )}

      {/* Prediction popup modal */}
      {isPredictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full relative shadow-2xl text-left">
            {/* Close button */}
            <button
              onClick={() => setIsPredictModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Popup Title */}
            <h3 className="font-sans text-base font-black text-slate-900 flex items-center border-b border-slate-100 pb-3">
              <Sparkles className="mr-2 h-5 w-5 text-blue-600 animate-spin" /> Next-Day Price Predictor
            </h3>

            {/* Form details */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider">Stock Assets</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{activeStock.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider">Position Action</span>
                  <span className={`text-[10px] font-extrabold uppercase rounded px-1.5 py-0.5 ${
                    selectedDecision === "buy" ? "bg-blue-100 text-blue-700" : selectedDecision === "sell" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {selectedDecision?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Predict question */}
              <div>
                <label className="font-sans text-xs font-bold text-slate-700 block mb-2">
                  Predict what will be the price of {activeStock.ticker} on the next day?
                </label>
                
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-sm text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.1"
                    value={predictedPriceInput}
                    onChange={(e) => setPredictedPriceInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-4 font-mono text-sm text-slate-800 font-bold outline-none focus:border-blue-500"
                  />
                </div>
                
                <span className="text-[9px] text-slate-500 block mt-1.5 font-sans leading-normal">
                  Today's Close: <strong>₹{activeStock.prices[5].close.toFixed(2)}</strong>. Enter tomorrow's predicted target. Accuracies above 90% earn high-performance gold bonuses!
                </span>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitPrediction}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-extrabold tracking-widest uppercase text-white transition-all shadow-lg hover:shadow-blue-600/10 cursor-pointer mt-2"
              >
                Submit Trade Prediction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
