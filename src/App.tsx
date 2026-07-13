/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, StockScenario, Achievement } from "./types";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import HeroSection from "./components/HeroSection";
import Dashboard from "./components/Dashboard";
import MarketDetails from "./components/MarketDetails";
import GameArena from "./components/GameArena";
import PortfolioView from "./components/PortfolioView";
import LeaderboardView from "./components/LeaderboardView";
import LearnSection from "./components/LearnSection";
import AboutSection from "./components/AboutSection";
import CombinedView from "./components/CombinedView";
import { 
  Settings as SettingsIcon, 
  RefreshCw, 
  User, 
  Trash2, 
  TrendingUp, 
  GraduationCap, 
  Briefcase 
} from "lucide-react";

// Default Initial User Profile Data
const DEFAULT_USER: UserProfile = {
  name: "Guest_Investor",
  rank: "Beginner Investor",
  level: 1,
  xp: 150,
  coins: 100,
  streak: 3,
  accuracy: 75,
  winRatio: 0.65,
  totalChallenges: 4,
  completedScenarios: [],
  skills: {
    riskManagement: 55,
    trendPrediction: 60,
    marketKnowledge: 50,
    decisionSpeed: 45,
    portfolioDiversification: 50
  },
  watchlist: ["AAPL", "NVDA"],
  achievements: [
    { id: "first-trade", title: "Survival Launch", description: "Submit your very first market prediction.", badge: "🚀", unlocked: false },
    { id: "bull-seye", title: "Bullseye Vision", description: "Successfully predict a stock bull surge.", badge: "🎯", unlocked: false },
    { id: "survival-pro", title: "Survival Legend", description: "Reach Rank: Smart Trader (Level 3+).", badge: "🛡️", unlocked: false },
    { id: "wealth-multiplier", title: "Gold Accumulator", description: "Accumulate 300+ gold coins.", badge: "💰", unlocked: false }
  ]
};

import { HISTORICAL_SCENARIOS } from "./data/scenariosData";

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("stock_survivor_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [scenarios, setScenarios] = useState<StockScenario[]>(HISTORICAL_SCENARIOS);
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Settings custom states
  const [tempUsername, setTempUsername] = useState(user.name);
  const [settingsSubTab, setSettingsSubTab] = useState<"terminal" | "learn" | "about">("terminal");

  // Redirect consolidated tabs to their new clubbed views
  useEffect(() => {
    if (activeTab === "learn") {
      setActiveTab("settings");
      setSettingsSubTab("learn");
    } else if (activeTab === "about") {
      setActiveTab("settings");
      setSettingsSubTab("about");
    } else if (activeTab === "leaderboard") {
      setActiveTab("portfolio");
    }
  }, [activeTab]);

  // Sync user changes to LocalStorage
  useEffect(() => {
    localStorage.setItem("stock_survivor_user", JSON.stringify(user));
  }, [user]);

  // Fetch stocks scenarios from Express backend
  useEffect(() => {
    async function loadScenarios() {
      try {
        const response = await fetch("/api/stock-scenarios");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setScenarios(data);
          }
        }
      } catch (err) {
        console.error("Backend offline or unreachable, using fully-functional fallback presets.");
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, []);

  const handleToggleWatchlist = (ticker: string) => {
    setUser((prev) => {
      const exists = prev.watchlist.includes(ticker);
      const updated = exists
        ? prev.watchlist.filter((t) => t !== ticker)
        : [...prev.watchlist, ticker];
      return { ...prev, watchlist: updated };
    });
  };

  const handleDecisionResult = (outcome: {
    isCorrect: boolean;
    xpEarned: number;
    coinsEarned: number;
    decision: string;
    actualPrices: any[];
    aiAnalysis: string;
    message: string;
  }) => {
    setUser((prev) => {
      // Calculate updated stats
      const total = prev.totalChallenges + 1;
      const completed = prev.completedScenarios.includes(selectedStockTicker || "")
        ? prev.completedScenarios
        : [...prev.completedScenarios, selectedStockTicker || ""];

      const updatedXP = prev.xp + outcome.xpEarned;
      const updatedCoins = prev.coins + Math.round(outcome.coinsEarned);

      // Determine level progression
      const currentLevel = Math.floor(updatedXP / 1000) + 1;

      // Classify Ranks based on levels
      let currentRank = prev.rank;
      if (currentLevel >= 5) currentRank = "Wall Street Legend";
      else if (currentLevel >= 4) currentRank = "Investment Guru";
      else if (currentLevel >= 3) currentRank = "Market Analyst";
      else if (currentLevel >= 2) currentRank = "Smart Trader";

      // Dynamically unlock achievements
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === "first-trade" && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        if (ach.id === "bull-seye" && outcome.decision === "buy" && outcome.isCorrect && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        if (ach.id === "survival-pro" && currentLevel >= 3 && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        if (ach.id === "wealth-multiplier" && updatedCoins >= 300 && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return ach;
      });

      // Update skill meters slightly based on decision quality
      return {
        ...prev,
        totalChallenges: total,
        completedScenarios: completed,
        xp: updatedXP,
        coins: updatedCoins,
        level: currentLevel,
        rank: currentRank,
        achievements: updatedAchievements,
        skills: {
          riskManagement: Math.min(prev.skills.riskManagement + (outcome.isCorrect ? 6 : 2), 100),
          trendPrediction: Math.min(prev.skills.trendPrediction + (outcome.isCorrect ? 8 : 1), 100),
          marketKnowledge: Math.min(prev.skills.marketKnowledge + 4, 100),
          decisionSpeed: Math.min(prev.skills.decisionSpeed + 5, 100),
          portfolioDiversification: Math.min(prev.skills.portfolioDiversification + (outcome.decision === "hold" ? 6 : 2), 100)
        }
      };
    });
  };

  const handleUpdateUsername = () => {
    if (tempUsername.trim()) {
      setUser((prev) => ({ ...prev, name: tempUsername.trim() }));
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to completely wipe your portfolios, XP stats, and survival ranks?")) {
      setUser(DEFAULT_USER);
      setTempUsername(DEFAULT_USER.name);
      localStorage.removeItem("stock_survivor_user");
    }
  };

  const handleSelectStock = (ticker: string) => {
    setSelectedStockTicker(ticker);
    setActiveTab("market");
  };

  const handleHeroNavigation = (target: "arena" | "market" | "learn") => {
    if (target === "market") {
      setSelectedStockTicker(null);
      setActiveTab("market");
      return;
    }

    if (target === "learn") {
      setActiveTab("settings");
      setSettingsSubTab("learn");
      return;
    }

    setActiveTab("arena");
  };

  const selectedStockObj = scenarios.find((s) => s.ticker === selectedStockTicker) || scenarios[0];

  return (
    <div className="min-h-screen bg-transparent text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Slide-out Sidebar Panel */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "market") setSelectedStockTicker(null);
        }}
        user={user}
      />

      {/* Top sticky Navigation */}
      <Navigation
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto clear stock selections when changing primary routes
          if (tab !== "market") setSelectedStockTicker(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl">
        {loading ? (
          <div className="flex h-[60vh] flex-col items-center justify-center">
            <RefreshCw className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="mt-4 font-sans text-sm text-slate-400">Booting Stock Survivor Terminal...</p>
          </div>
        ) : (
          <div>
            {/* Home Screen */}
            {activeTab === "home" && (
              <HeroSection
                onStartPlaying={() => handleHeroNavigation("arena")}
                onExploreMarket={() => handleHeroNavigation("market")}
                onLearnInvesting={() => handleHeroNavigation("learn")}
              />
            )}

            {/* Market Area Screen (Consolidated Dashboard & Market Details) */}
            {activeTab === "market" && (
              selectedStockTicker && selectedStockObj ? (
                <MarketDetails
                  stock={selectedStockObj}
                  scenarios={scenarios}
                  onSelectStock={handleSelectStock}
                  onBack={() => {
                    setSelectedStockTicker(null);
                  }}
                  onDecisionSubmitted={handleDecisionResult}
                />
              ) : (
                <Dashboard
                  scenarios={scenarios}
                  onSelectStock={handleSelectStock}
                  watchlist={user.watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              )
            )}

            {/* Game Arena Screen */}
            {activeTab === "arena" && (
              <GameArena
                scenarios={scenarios}
                user={user}
                onDecisionSubmitted={handleDecisionResult}
              />
            )}

            {/* Portfolio Screen (Clubs Portfolio & Leaderboard) */}
            {activeTab === "portfolio" && <CombinedView user={user} />}

            {/* Settings Screen (Clubs Settings, Learn, and About) */}
            {activeTab === "settings" && (
              <div className="p-4 sm:p-6 lg:p-8 text-left">
                {/* Premium Sub-tab navigation bar */}
                <div className="mx-auto max-w-4xl mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
                  <button
                    onClick={() => setSettingsSubTab("terminal")}
                    className={`rounded-xl px-4 py-2 font-sans text-xs font-bold tracking-wide transition-all ${
                      settingsSubTab === "terminal"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    ⚙️ Terminal Settings
                  </button>
                  <button
                    onClick={() => setSettingsSubTab("learn")}
                    className={`rounded-xl px-4 py-2 font-sans text-xs font-bold tracking-wide transition-all ${
                      settingsSubTab === "learn"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    📚 Education Academy
                  </button>
                  <button
                    onClick={() => setSettingsSubTab("about")}
                    className={`rounded-xl px-4 py-2 font-sans text-xs font-bold tracking-wide transition-all ${
                      settingsSubTab === "about"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    ℹ️ Project Mission & SDG
                  </button>
                </div>

                {/* Render active sub-tab */}
                {settingsSubTab === "terminal" && (
                  <div className="p-4 sm:p-6 lg:p-8 text-left max-w-2xl mx-auto bg-slate-900/10 rounded-3xl border border-white/5">
                    <div className="mb-6 border-b border-white/5 pb-4">
                      <h1 className="font-sans text-2xl font-black text-white flex items-center">
                        <SettingsIcon className="mr-2 h-6 w-6 text-slate-400" /> survivor Settings
                      </h1>
                      <p className="font-sans text-xs text-slate-400 mt-1">
                        Manage your investor nickname, wipe local storage simulations, and calibrate controls.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Edit Username */}
                      <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5">
                        <h3 className="font-sans text-sm font-bold text-white mb-3 flex items-center">
                          <User className="mr-2 h-4 w-4 text-emerald-400" /> Edit Investor Alias
                        </h3>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            placeholder="Choose high-stakes moniker..."
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 px-3 font-sans text-xs text-white outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={handleUpdateUsername}
                            className="rounded-xl bg-emerald-600 px-4 py-2 font-sans text-xs font-bold hover:bg-emerald-500 transition-all"
                          >
                            Apply Name
                          </button>
                        </div>
                      </div>

                      {/* Reset Account */}
                      <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-5">
                        <h3 className="font-sans text-sm font-bold text-rose-400 mb-2 flex items-center">
                          <Trash2 className="mr-2 h-4 w-4" /> Reset Simulator Profiles
                        </h3>
                        <p className="font-sans text-xs text-slate-400 mb-4">
                          Completely purge your level, XP progression, daily log histories, custom Moniker, and achievements from local state permanently.
                        </p>
                        <button
                          onClick={handleResetData}
                          className="rounded-xl bg-rose-600/20 border border-rose-500/30 px-4 py-2 font-sans text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Wipe Data Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {settingsSubTab === "learn" && <LearnSection isNested={true} />}
                {settingsSubTab === "about" && <AboutSection isNested={true} />}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 bg-slate-950/40 py-10 text-center font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-xs text-slate-500">
              © 2026 Stock Survivor: Beat the Market. Educational Gaming Sandbox.
            </span>
            <div className="flex space-x-4">
              <span className="font-mono text-[9px] text-slate-500 tracking-wider">PREMIUM TRADINGVIEW EXPERIENCE</span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="font-mono text-[9px] text-slate-500 tracking-wider">SDG ACADEMIC SPONSOR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
