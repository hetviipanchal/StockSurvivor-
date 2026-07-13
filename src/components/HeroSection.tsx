/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Flame, 
  Cpu, 
  BarChart3, 
  Trophy, 
  Gift, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  Users, 
  Gamepad2, 
  Target,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface HeroSectionProps {
  onStartPlaying: () => void;
  onExploreMarket: () => void;
  onLearnInvesting: () => void;
}

export default function HeroSection({
  onStartPlaying,
  onExploreMarket,
  onLearnInvesting,
}: HeroSectionProps) {
  const [stats, setStats] = useState({
    players: 14850,
    stocks: 250,
    challenges: 124300,
    successRate: 74,
    activeUsers: 3420
  });

  // Animated numbers increment slightly to represent dynamic mock real-time movement
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        players: prev.players + Math.floor(Math.random() * 2),
        challenges: prev.challenges + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2 - 1)
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="h-5 w-5 text-emerald-400" />,
      title: "Real-Time Stock Data",
      desc: "Simulate decisions using real, historical daily candle histories sourced from live records of global markets."
    },
    {
      icon: <Gamepad2 className="h-5 w-5 text-amber-400" />,
      title: "Interactive Challenges",
      desc: "Analyze high-stakes history (e.g., iPhone Launch or AI boom), predict the stock direction, and trace outcomes."
    },
    {
      icon: <Cpu className="h-5 w-5 text-emerald-400" />,
      title: "AI-Based Insights",
      desc: "Get customized Wall Street mentor feedback powered by server-side Gemini AI for every investment decision."
    },
    {
      icon: <Target className="h-5 w-5 text-teal-400" />,
      title: "Performance Analytics",
      desc: "Analyze your progress with beautiful radial radar charts and line graphs visualizing your financial skill levels."
    },
    {
      icon: <Trophy className="h-5 w-5 text-yellow-400" />,
      title: "Global Leaderboards",
      desc: "Compete with peers, climb the ranks from Rookie to Wall Street Legend, and showcase your high accuracy."
    },
    {
      icon: <Gift className="h-5 w-5 text-red-400" />,
      title: "Daily Rewards",
      desc: "Login daily, complete streaks, and claim gold coins, dynamic rank upgrades, and master badges."
    },
    {
      icon: <BookOpen className="h-5 w-5 text-blue-400" />,
      title: "Financial Education",
      desc: "Access bite-sized, premium lessons covering candlestick patterns, indicators, risk management, and diversification."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-purple-400" />,
      title: "Zero-Risk Simulation",
      desc: "Gain raw financial survival intuition and beat common behavioral traps without losing a single Rupee."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-800">
      {/* Dynamic Animated Stock Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(6,182,212,0.04),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Candlestick & line graphs visual decorations (Floating) */}
      <div className="pointer-events-none absolute top-20 right-10 hidden h-72 w-96 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-lg sm:block lg:right-24 xl:right-32">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live Simulation Terminal</span>
          </div>
          <span className="font-mono text-[9px] text-blue-600 font-semibold">+41.2% Surge</span>
        </div>
        <div className="mt-4 flex items-end justify-between space-x-2 h-40">
          {/* Mock beautifully styled candlesticks */}
          <div className="flex flex-col items-center flex-1">
            <span className="h-10 w-[1px] bg-slate-300" />
            <span className="h-14 w-4 bg-red-500/80 rounded-sm" />
            <span className="h-6 w-[1px] bg-slate-300" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="h-8 w-[1px] bg-slate-300" />
            <span className="h-16 w-4 bg-emerald-500/80 rounded-sm" />
            <span className="h-12 w-[1px] bg-slate-300" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="h-12 w-[1px] bg-slate-300" />
            <span className="h-10 w-4 bg-red-500/80 rounded-sm" />
            <span className="h-8 w-[1px] bg-slate-300" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="h-14 w-[1px] bg-slate-300" />
            <span className="h-24 w-4 bg-emerald-500/80 rounded-sm shadow-lg shadow-emerald-500/20" />
            <span className="h-16 w-[1px] bg-slate-300" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="h-6 w-[1px] bg-slate-300" />
            <span className="h-28 w-4 bg-emerald-500/80 rounded-sm shadow-lg shadow-emerald-500/30" />
            <span className="h-10 w-[1px] bg-slate-300" />
          </div>
        </div>
        <div className="mt-2 text-right">
          <span className="font-mono text-[10px] text-slate-400">AAPL Scenario Replay</span>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl text-left">
          {/* Gamified badge */}
          <div className="mb-4 inline-flex items-center space-x-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 shadow-md">
            <Flame className="h-4 w-4 animate-bounce text-blue-500" />
            <span>Beat the Market Simulation Arena</span>
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Master the Stock Market <br />
            <span className="qwerety
            ">
              Without Losing a Single Rupee
            </span>
          </h1>

          <p className="mt-6 font-sans text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Practice investing using actual high-stakes historical stock market data. Predict, decide, survive, and win. Sharpen your trading instincts, earn rewards, and secure your financial literacy in an elite, premium gaming simulation powered by AI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={onStartPlaying}
              className="group flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 font-sans text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/35 hover:brightness-110 active:scale-95"
            >
              <span>Start Playing</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onExploreMarket}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-sans text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            >
              Explore Market
            </button>
            <button
              onClick={onLearnInvesting}
              className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 font-sans text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:border-blue-300 active:scale-95"
            >
              Learn Investing
            </button>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg backdrop-blur-sm">
            <Users className="mx-auto mb-2 h-5 w-5 text-slate-400" />
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Players</span>
            <span className="font-mono text-xl font-extrabold text-slate-800 sm:text-2xl">{stats.players.toLocaleString()}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg backdrop-blur-sm">
            <TrendingUp className="mx-auto mb-2 h-5 w-5 text-blue-500" />
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Available Stocks</span>
            <span className="font-mono text-xl font-extrabold text-slate-800 sm:text-2xl">{stats.stocks}+</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg backdrop-blur-sm">
            <Gamepad2 className="mx-auto mb-2 h-5 w-5 text-amber-500" />
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Completed Runs</span>
            <span className="font-mono text-xl font-extrabold text-slate-800 sm:text-2xl">{stats.challenges.toLocaleString()}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg backdrop-blur-sm">
            <Target className="mx-auto mb-2 h-5 w-5 text-teal-500" />
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Success Rate</span>
            <span className="font-mono text-xl font-extrabold text-blue-600 sm:text-2xl">{stats.successRate}%</span>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-lg backdrop-blur-sm sm:col-span-1">
            <div className="mx-auto mb-2 flex justify-center text-rose-500">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping mr-1" />
              <span className="font-sans text-xs">●</span>
            </div>
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Active</span>
            <span className="font-mono text-xl font-extrabold text-slate-800 sm:text-2xl">{stats.activeUsers.toLocaleString()}</span>
          </div>
        </div>

        {/* Features Showcase Section */}
        <div className="mt-24 border-t border-slate-200 pt-20">
          <div className="text-center">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Packed with Premium Institutional Features
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-slate-500">
              We combined advanced financial datasets with immersive gaming loops to deliver an ultimate trading sandbox.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/20 hover:bg-slate-50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-colors group-hover:bg-blue-500/10">
                  {feat.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                  {feat.title}
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-slate-500">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SDGs Impact Indicators Banner */}
        <div className="mt-24 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 via-slate-50 to-white p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="font-sans text-[10px] font-bold text-blue-600 uppercase tracking-widest">Global Academic Impact</span>
              <h3 className="mt-1 font-sans text-lg font-bold text-slate-950 sm:text-xl">
                Supporting Sustainable Development Goals (SDG)
              </h3>
              <p className="abcd">
                Stock Survivor contributes actively to <strong>SDG 4 (Quality Education)</strong> by delivering free institutional financial training, and <strong>SDG 8 (Decent Work & Economic Growth)</strong> by giving young people critical saving and risk-management competencies.
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="flex items-center space-x-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                <GraduationCap className="h-4 w-4" />
                <span>SDG 4</span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                <Briefcase className="h-4 w-4" />
                <span>SDG 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
