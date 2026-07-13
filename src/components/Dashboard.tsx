/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StockScenario, MarketIndex, MarketNews } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Check, 
  Sparkles, 
  Clock, 
  Globe, 
  Bookmark, 
  Volume2, 
  Activity,
  ArrowUpRight,
  Flame,
  Zap,
  Info
} from "lucide-react";

interface DashboardProps {
  scenarios: StockScenario[];
  onSelectStock: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

export default function Dashboard({
  scenarios,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
}: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "tech" | "watchlist" | "indian">("all");
  const [marketSentiment, setMarketSentiment] = useState<{ score: number; sentiment: string; bullets: string[]; goldenTip: string } | null>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(true);

  // Hardcoded index data to look like a real terminal
  const indices: MarketIndex[] = [
    { name: "NASDAQ", price: 17850.50, change: 124.30, changePercent: 0.70 },
    { name: "S&P 500", price: 5430.20, change: 15.80, changePercent: 0.29 },
    { name: "Dow Jones", price: 39510.80, change: -45.20, changePercent: -0.11 },
    { name: "NIFTY 50", price: 23540.10, change: 185.40, changePercent: 0.79 },
    { name: "Sensex", price: 77340.50, change: 610.20, changePercent: 0.80 },
  ];

  // Live Market News
  const newsItems: MarketNews[] = [
    {
      id: "n1",
      title: "NVIDIA demand triggers custom AI chip design race across cloud giants",
      source: "Bloomberg",
      time: "10m ago",
      sentiment: "positive",
      impact: "High Impact"
    },
    {
      id: "n2",
      title: "Apple schedules global developers keynote with deep operating system AI integrations",
      source: "TechCrunch",
      time: "45m ago",
      sentiment: "positive",
      impact: "Medium Impact"
    },
    {
      id: "n3",
      title: "Treasury bond yields pause as inflation benchmarks meet standard consumer expectations",
      source: "Reuters",
      time: "2h ago",
      sentiment: "neutral",
      impact: "Low Impact"
    },
    {
      id: "n4",
      title: "Regulatory changes hit retail derivative sizing limits in major Asian markets",
      source: "Financial Times",
      time: "4h ago",
      sentiment: "negative",
      impact: "High Impact"
    }
  ];

  useEffect(() => {
    // Fetch live market sentiment from server
    async function fetchSentiment() {
      try {
        const res = await fetch("/api/market-sentiment");
        const data = await res.json();
        setMarketSentiment(data);
      } catch (err) {
        console.error("Failed to load sentiment:", err);
      } finally {
        setLoadingSentiment(false);
      }
    }
    fetchSentiment();
  }, []);

  const filteredStocks = scenarios.filter((sc) => {
    if (activeCategory === "tech") {
      return ["AAPL", "NVDA", "TSLA", "AMZN"].includes(sc.ticker);
    }
    if (activeCategory === "indian") {
      return !["AAPL", "NVDA", "TSLA", "AMZN"].includes(sc.ticker);
    }
    if (activeCategory === "watchlist") {
      return watchlist.includes(sc.ticker);
    }
    return true;
  });

  // Calculate top gainers/losers/most active based on scenario values
  const topGainers = [...scenarios].sort((a, b) => {
    const aChg = ((a.prices[5].close - a.prices[0].close) / a.prices[0].close) * 100;
    const bChg = ((b.prices[5].close - b.prices[0].close) / b.prices[0].close) * 100;
    return bChg - aChg;
  });

  const USD_TO_INR = 83;

  const renderStockCard = (sc: StockScenario) => {
    const initialPrice = sc.prices[0].close;
    const decisionDayPrice = sc.prices[5].close;
    const percentChg = ((decisionDayPrice - initialPrice) / initialPrice) * 100;
    const isPositive = percentChg >= 0;

    const isIndian = !["AAPL", "NVDA", "TSLA", "AMZN"].includes(sc.ticker);
    
    const priceInUSD = isIndian ? decisionDayPrice / USD_TO_INR : decisionDayPrice;
    const priceInINR = isIndian ? decisionDayPrice : decisionDayPrice * USD_TO_INR;

    return (
      <div
        key={sc.ticker}
        className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-500/30 hover:bg-slate-50/50 hover:shadow-lg flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-sans text-lg font-extrabold text-slate-800 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                {sc.logo}
              </div>
              <div>
                <h3 className="font-sans text-xs font-extrabold text-slate-900 block leading-snug">
                  {sc.name}
                </h3>
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                  {sc.ticker} • {sc.scenarioName}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(sc.ticker);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:text-slate-700 transition-all cursor-pointer"
            >
              {watchlist.includes(sc.ticker) ? <Check className="h-3.5 w-3.5 text-blue-600" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 items-center gap-2">
            {/* Price Details */}
            <div className="text-left">
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block tracking-wider">Milestone Price</span>
              <span className="font-mono text-xs font-black text-slate-800 block">
                ${priceInUSD.toFixed(2)}
              </span>
              <span className="font-mono text-[10px] text-slate-500 block">
                ₹{priceInINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Percentage Shift */}
            <div className="text-right">
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block tracking-wider">Start Shift</span>
              <span className={`inline-flex items-center rounded-md font-mono text-[10px] font-bold px-1.5 py-0.5 ${
                isPositive ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
              }`}>
                {isPositive ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
                {percentChg.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* CTA Overlay Trigger */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="font-sans text-[9px] text-slate-500">Risk: <strong>{sc.riskScore}/100</strong></span>
          <button
            onClick={() => onSelectStock(sc.ticker)}
            className="flex items-center space-x-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 font-sans text-[10px] font-bold text-blue-600 transition-all hover:bg-blue-600 hover:text-white active:scale-95 cursor-pointer"
          >
            <span>Trade Chart</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  const americanStocks = filteredStocks.filter((sc) => ["AAPL", "NVDA", "TSLA", "AMZN"].includes(sc.ticker));
  const indianStocks = filteredStocks.filter((sc) => !["AAPL", "NVDA", "TSLA", "AMZN"].includes(sc.ticker));

  return (
    <div className="bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Real-time Ticker Tape Ribbon */}
      <div className="mb-6 flex space-x-4 overflow-x-auto pb-3 scrollbar-none border-b border-slate-200">
        {indices.map((idx, i) => (
          <div 
            key={i} 
            className="flex min-w-[150px] items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm"
          >
            <span className="font-sans text-[10px] font-bold text-slate-500">{idx.name}</span>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-800 block">
                {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`inline-flex items-center font-mono text-[9px] font-semibold ${
                idx.change >= 0 ? "text-blue-600" : "text-red-500"
              }`}>
                {idx.change >= 0 ? "+" : ""}
                {idx.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Welcome and Summary Banner */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-slate-50 to-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-sans text-xl font-bold text-slate-900 sm:text-2xl">
                Historical Trading Simulator
              </h2>
              <p className="mt-1.5 font-sans text-xs text-slate-600">
                Select a historical stock below to open its trading chart. Make Buy, Hold, or Sell choices on decision milestones.
              </p>
            </div>
            <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-600">Live Server Connected</span>
            </div>
          </div>
        </div>

        {/* Filtering Tabs & Grid of Stocks */}
        <div>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap space-x-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                 onClick={() => setActiveCategory("all")}
                 className={`rounded-lg px-3 py-1 font-sans text-[10px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                   activeCategory === "all" ? "bg-blue-600 text-white animate-fade-in" : "text-slate-500 hover:text-slate-800"
                 }`}
              >
                All Markets
              </button>
              <button
                 onClick={() => setActiveCategory("indian")}
                 className={`rounded-lg px-3 py-1 font-sans text-[10px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                   activeCategory === "indian" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                 }`}
              >
                Indian Stocks 🇮🇳
              </button>
              <button
                 onClick={() => setActiveCategory("tech")}
                 className={`rounded-lg px-3 py-1 font-sans text-[10px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                   activeCategory === "tech" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                 }`}
              >
                US Tech Giants 🇺🇸
              </button>
              <button
                 onClick={() => setActiveCategory("watchlist")}
                 className={`rounded-lg px-3 py-1 font-sans text-[10px] sm:text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                   activeCategory === "watchlist" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
                 }`}
              >
                My Watchlist ({watchlist.length})
              </button>
            </div>
            <span className="font-mono text-[10px] text-slate-400">{filteredStocks.length} assets found</span>
          </div>

          {/* Segregated Stocks Section */}
          <div className="space-y-8 mt-6">
            {/* American Market (US Stocks) */}
            {americanStocks.length > 0 && (
              <div>
                <h3 className="mb-4 font-sans text-xs font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                  <span>🇺🇸</span> American Market (US Stocks)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {americanStocks.map((sc) => renderStockCard(sc))}
                </div>
              </div>
            )}

            {/* Indian Market (Indian Stocks) */}
            {indianStocks.length > 0 && (
              <div>
                <h3 className="mb-4 font-sans text-xs font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                  <span>🇮🇳</span> Indian Market (Indian Stocks)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {indianStocks.map((sc) => renderStockCard(sc))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: AI Sentiment Advisor and Market Feed */}
        <div className="grid gap-6 md:grid-cols-2 border-t border-slate-200 pt-8">
          {/* Market Sentiment (AI insights widget) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                <h3 className="font-sans text-sm font-bold text-slate-900">AI Sentiment Advisor</h3>
              </div>
              <span className="font-sans text-[9px] font-semibold text-slate-400">Gemini Live</span>
            </div>

            {loadingSentiment ? (
              <div className="space-y-3 py-4">
                <div className="h-6 w-3/4 rounded bg-slate-100 animate-pulse" />
                <div className="h-20 w-full rounded bg-slate-100 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sentiment score indicator */}
                <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-mono text-lg font-black text-blue-600 shadow-sm">
                    {marketSentiment?.score || 68}
                  </div>
                  <div className="text-left">
                    <span className="font-sans text-[9px] font-bold text-slate-400 uppercase block">Market Climate</span>
                    <span className="font-sans text-xs font-bold text-slate-800">{marketSentiment?.sentiment || "Bullish"}</span>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
                  {marketSentiment?.bullets?.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-left">
                      <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                      <p className="font-sans text-[11px] leading-relaxed text-slate-600">{b}</p>
                    </div>
                  ))}
                </div>

                {/* Golden Tip */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-left">
                  <span className="mb-1 font-sans text-[10px] font-bold text-blue-600 uppercase tracking-widest block flex items-center">
                    <Info className="mr-1 h-3 w-3" /> Mentor Golden Tip
                  </span>
                  <p className="font-sans text-[10px] leading-relaxed text-slate-600 italic">
                    "{marketSentiment?.goldenTip || "Always study the cash-flow statement before investing."}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Active News widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <Activity className="mr-1.5 h-4 w-4 text-blue-600" /> Market Feed
            </h3>
            <div className="space-y-4">
              {newsItems.map((news) => (
                <div key={news.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 text-left">
                  <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-slate-500 uppercase tracking-wider">
                    {news.source} • {news.time}
                  </span>
                  <h4 className="mt-1 font-sans text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`font-sans text-[9px] font-semibold ${
                      news.sentiment === "positive" ? "text-blue-600" : news.sentiment === "negative" ? "text-red-500" : "text-slate-500"
                    }`}>
                      {news.sentiment.toUpperCase()}
                    </span>
                    <span className="font-sans text-[9px] text-slate-400">{news.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
