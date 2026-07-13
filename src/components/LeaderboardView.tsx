/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { Trophy, Medal, Star, Flame, Search, Sparkles, Globe } from "lucide-react";

interface LeaderboardViewProps {
  user: UserProfile;
}

export default function LeaderboardView({ user }: LeaderboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const leaderboardData = [
    { rank: 1, name: "Prateek_Invest", title: "Wall Street Legend", accuracy: 96, xp: 8200, avatar: "🤵" },
    { rank: 2, name: "Nikita_Bull", title: "Wall Street Legend", accuracy: 92, xp: 7450, avatar: "👩‍💼" },
    { rank: 3, name: "Ishaan_Bear", title: "Investment Guru", accuracy: 89, xp: 6200, avatar: "👨‍💻" },
    { rank: 4, name: "Aditi_Vite", title: "Investment Guru", accuracy: 85, xp: 5800, avatar: "👩‍🎨" },
    { rank: 5, name: "Siddharth_Alpha", title: "Market Analyst", accuracy: 81, xp: 4900, avatar: "👨‍🚀" },
    { rank: 6, name: "Kabir_Z", title: "Market Analyst", accuracy: 78, xp: 4100, avatar: "🕵️" },
    { rank: 7, name: "Meera_Kite", title: "Smart Trader", accuracy: 74, xp: 3200, avatar: "👩‍🔬" },
    { rank: 8, name: `${user.name} (You)`, title: user.rank, accuracy: user.accuracy, xp: user.xp, avatar: "👑" },
  ];

  const filteredLeaderboard = leaderboardData.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white text-slate-800 p-4 sm:p-6 lg:p-8 text-left">
      {/* Title */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-2xl font-black text-slate-900 flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-amber-500" /> Global Leaderboard
          </h1>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Compare your predictive accuracy, accumulated XP, and badges with investors worldwide.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 font-sans text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {/* Rank 2 */}
        <div className="order-2 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm sm:order-1 sm:mt-6">
          <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-3xl ring-2 ring-slate-300">
            🥈
          </div>
          <h3 className="font-sans text-sm font-bold text-slate-800">{leaderboardData[1].name}</h3>
          <span className="font-mono text-[9px] text-slate-500 block mt-1 uppercase tracking-wider">{leaderboardData[1].title}</span>
          <div className="mt-4 flex justify-around border-t border-slate-200 pt-3">
            <div>
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block">Accuracy</span>
              <span className="font-mono text-xs font-bold text-blue-600">{leaderboardData[1].accuracy}%</span>
            </div>
            <div>
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block">XP</span>
              <span className="font-mono text-xs font-bold text-slate-700">{leaderboardData[1].xp}</span>
            </div>
          </div>
        </div>

        {/* Rank 1 */}
        <div className="order-1 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center shadow-md shadow-amber-500/5 sm:order-2">
          <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-4xl ring-4 ring-amber-400 shadow-md">
            👑
            <span className="absolute -top-2 right-1 text-xs animate-bounce">🏆</span>
          </div>
          <h3 className="font-sans text-base font-extrabold text-slate-900">{leaderboardData[0].name}</h3>
          <span className="font-mono text-[9px] text-amber-700 block mt-1 uppercase tracking-wider font-semibold">{leaderboardData[0].title}</span>
          <div className="mt-4 flex justify-around border-t border-amber-200/50 pt-3">
            <div>
              <span className="font-sans text-[8px] font-bold text-amber-800 uppercase block">Accuracy</span>
              <span className="font-mono text-xs font-bold text-amber-700">{leaderboardData[0].accuracy}%</span>
            </div>
            <div>
              <span className="font-sans text-[8px] font-bold text-amber-800 uppercase block">XP</span>
              <span className="font-mono text-xs font-bold text-slate-700">{leaderboardData[0].xp}</span>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="order-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm sm:mt-12">
          <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl ring-2 ring-amber-300">
            🥉
          </div>
          <h3 className="font-sans text-sm font-bold text-slate-800">{leaderboardData[2].name}</h3>
          <span className="font-mono text-[9px] text-slate-500 block mt-1 uppercase tracking-wider">{leaderboardData[2].title}</span>
          <div className="mt-4 flex justify-around border-t border-slate-200 pt-3">
            <div>
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block">Accuracy</span>
              <span className="font-mono text-xs font-bold text-blue-600">{leaderboardData[2].accuracy}%</span>
            </div>
            <div>
              <span className="font-sans text-[8px] font-bold text-slate-400 uppercase block">XP</span>
              <span className="font-mono text-xs font-bold text-slate-700">{leaderboardData[2].xp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main rankings list table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Rank</div>
          <div className="col-span-5">Investor</div>
          <div className="col-span-3 text-right">Accuracy</div>
          <div className="col-span-2 text-right">Total XP</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLeaderboard.map((player) => {
            const isUser = player.name.includes("(You)");
            return (
              <div
                key={player.rank}
                className={`grid grid-cols-12 items-center p-4 transition-all ${
                  isUser 
                    ? "bg-blue-50/70 text-blue-900 font-bold" 
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="col-span-2 flex items-center space-x-1.5 font-mono">
                  <span>#{player.rank}</span>
                </div>
                <div className="col-span-5 flex items-center space-x-3 text-left">
                  <span className="text-lg block">{player.avatar}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{player.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase">{player.title}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right font-mono text-xs font-bold text-blue-600">
                  {player.accuracy}%
                </div>
                <div className="col-span-2 text-right font-mono text-xs font-bold text-slate-700">
                  {player.xp.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
