/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserProfile } from "../types";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";
import { 
  Award, 
  TrendingUp, 
  ShieldAlert, 
  Trophy, 
  Target, 
  Activity, 
  Star,
  Zap,
  BookmarkCheck,
  CheckCircle2
} from "lucide-react";

interface PortfolioViewProps {
  user: UserProfile;
}

export default function PortfolioView({ user }: PortfolioViewProps) {
  // Recharts skill data mapping
  const skillData = [
    { subject: "Risk Management", value: user.skills.riskManagement, fullMark: 100 },
    { subject: "Trend Prediction", value: user.skills.trendPrediction, fullMark: 100 },
    { subject: "Market Knowledge", value: user.skills.marketKnowledge, fullMark: 100 },
    { subject: "Decision Speed", value: user.skills.decisionSpeed, fullMark: 100 },
    { subject: "Diversification", value: user.skills.portfolioDiversification, fullMark: 100 },
  ];

  // Recharts pie data mapping
  const pieData = [
    { name: "US Tech Giants", value: 45, color: "#10b981" },
    { name: "Energy & Infrastructure", value: 25, color: "#06b6d4" },
    { name: "Crypto Assets", value: 15, color: "#f59e0b" },
    { name: "Defensive Utilities", value: 15, color: "#a855f7" },
  ];

  // Progression mock data
  const progressionData = [
    { run: "Run 1", score: 620, accuracy: 60 },
    { run: "Run 2", score: 780, accuracy: 68 },
    { run: "Run 3", score: 850, accuracy: 72 },
    { run: "Run 4", score: 940, accuracy: 78 },
    { run: "Run 5", score: 1100, accuracy: user.accuracy },
  ];

  const COLORS = ["#2563eb", "#06b6d4", "#f59e0b", "#8b5cf6"];

  return (
    <div className="bg-white text-slate-800 p-4 sm:p-6 lg:p-8 text-left">
      {/* Title */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-2xl font-black text-slate-900 flex items-center">
            <Activity className="mr-2 h-6 w-6 text-blue-600" /> My Investment Portfolio & Analytics
          </h1>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Analyze your survival stats, accuracy scores, completed milestones, and core Wall Street skill map.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs text-slate-400 uppercase">
            Account: {user.name}
          </span>
        </div>
      </div>

      {/* Stats Bento Grid Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prediction Accuracy</span>
            <Target className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-mono text-2xl font-black text-slate-900 block mt-2">
            {user.accuracy}%
          </span>
          <p className="font-sans text-[10px] text-slate-500 mt-1.5">Based on {user.totalChallenges} historical scenarios.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">Survivor Win Ratio</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-mono text-2xl font-black text-blue-600 block mt-2">
            {(user.winRatio * 100).toFixed(0)}%
          </span>
          <p className="font-sans text-[10px] text-slate-500 mt-1.5">Overall positive returns on correct decisions.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">Streak Multiplier</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-mono text-2xl font-black text-amber-600 block mt-2">
            {user.streak} Days
          </span>
          <p className="font-sans text-[10px] text-slate-500 mt-1.5">Claim daily rewards consecutively.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coins & Assets</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-mono text-2xl font-black text-amber-600 block mt-2">
            {user.coins} Gold
          </span>
          <p className="font-sans text-[10px] text-slate-500 mt-1.5">Trade simulated gold in the shop arena.</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Radar Chart: Financial Skills */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-md">
          <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
            <Trophy className="mr-1.5 h-4 w-4 text-blue-600" /> Financial Skill Radar
          </h3>
          <div className="flex h-64 w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={8} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <span className="mt-2 block text-center font-sans text-[10px] text-slate-400">
            Skills increase automatically when you correctly solve high-risk scenarios.
          </span>
        </div>

        {/* Pie Chart: Simulated Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-md">
          <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
            <Activity className="mr-1.5 h-4 w-4 text-blue-600" /> Asset Allocation Distribution
          </h3>
          <div className="flex h-64 w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Legends */}
          <div className="flex flex-wrap justify-center gap-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-sans text-[10px] text-slate-500">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart: Progression */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-md">
          <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
            <BookmarkCheck className="mr-1.5 h-4 w-4 text-blue-600" /> Win Score Progression
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData}>
                <XAxis dataKey="run" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b" }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Accuracy Progression */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-md">
          <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
            <Target className="mr-1.5 h-4 w-4 text-blue-600" /> Success Rate bar Chart
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressionData}>
                <XAxis dataKey="run" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b" }} />
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achieved Badges and Milestones Section */}
      <div className="mt-8 border-t border-slate-200 pt-8">
        <h3 className="mb-6 font-sans text-sm font-bold text-slate-900 uppercase tracking-wider">
          Earned Badges & Wall Street Achievements
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {user.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 text-left transition-all ${
                ach.unlocked
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-2xl block">{ach.badge}</span>
                {ach.unlocked ? (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-700 uppercase">Unlocked</span>
                ) : (
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[8px] font-bold text-slate-500 uppercase">Locked</span>
                )}
              </div>
              <h4 className={`mt-3 font-sans text-xs font-bold ${ach.unlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                {ach.title}
              </h4>
              <p className="mt-1 font-sans text-[10px] leading-relaxed text-slate-600">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
